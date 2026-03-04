const PAGE_SIZE = 10;
let currentPage = 0;
let totalNotes = 0;

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.text();
    let message;
    try {
      const parsed = JSON.parse(body);
      message = parsed.detail || parsed.message || body;
    } catch {
      message = body;
    }
    if (res.status === 404) {
      throw new Error('Catatan tidak ditemukan');
    } else if (res.status === 400) {
      throw new Error(`Data tidak valid: ${message}`);
    }
    throw new Error(`Terjadi kesalahan: ${message}`);
  }
  return res.json();
}

function showError(container, message) {
  const el = document.createElement('li');
  el.className = 'error-message';
  el.textContent = message;
  container.innerHTML = '';
  container.appendChild(el);
}

function updatePaginationButtons() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageInfo = document.getElementById('page-info');

  const totalPages = Math.max(1, Math.ceil(totalNotes / PAGE_SIZE));
  prevBtn.disabled = currentPage <= 0;
  nextBtn.disabled = currentPage >= totalPages - 1;
  pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
}

async function loadNotes() {
  const list = document.getElementById('notes');
  list.innerHTML = '';
  try {
    const skip = currentPage * PAGE_SIZE;
    const data = await fetchJSON(`/notes/?skip=${skip}&limit=${PAGE_SIZE}`);
    const notes = data.items || data;
    totalNotes = data.total != null ? data.total : notes.length;
    for (const n of notes) {
      const li = document.createElement('li');
      li.textContent = `${n.title}: ${n.content}`;
      list.appendChild(li);
    }
    updatePaginationButtons();
  } catch (err) {
    showError(list, err.message);
  }
}

async function loadActions() {
  const list = document.getElementById('actions');
  list.innerHTML = '';
  try {
    const items = await fetchJSON('/action-items/');
    for (const a of items) {
      const li = document.createElement('li');
      li.textContent = `${a.description} [${a.completed ? 'done' : 'open'}]`;
      if (!a.completed) {
        const btn = document.createElement('button');
        btn.textContent = 'Complete';
        btn.onclick = async () => {
          try {
            await fetchJSON(`/action-items/${a.id}/complete`, { method: 'PUT' });
            loadActions();
          } catch (err) {
            alert(err.message);
          }
        };
        li.appendChild(btn);
      }
      list.appendChild(li);
    }
  } catch (err) {
    showError(list, err.message);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('note-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const title = document.getElementById('note-title').value;
      const content = document.getElementById('note-content').value;
      await fetchJSON('/notes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      e.target.reset();
      loadNotes();
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById('action-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const description = document.getElementById('action-desc').value;
      await fetchJSON('/action-items/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      e.target.reset();
      loadActions();
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      loadNotes();
    }
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    const totalPages = Math.ceil(totalNotes / PAGE_SIZE);
    if (currentPage < totalPages - 1) {
      currentPage++;
      loadNotes();
    }
  });

  loadNotes();
  loadActions();
});
