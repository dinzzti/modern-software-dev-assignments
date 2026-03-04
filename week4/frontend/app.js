async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function showEmpty(container, message) {
  container.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'empty-state';
  p.textContent = message;
  container.appendChild(p);
}

async function loadNotes(query) {
  const list = document.getElementById('notes');
  list.innerHTML = '';
  const url = query ? `/notes/search/?q=${encodeURIComponent(query)}` : '/notes/';
  const notes = await fetchJSON(url);

  if (notes.length === 0) {
    showEmpty(list, query ? 'Tidak ada catatan yang cocok.' : 'Belum ada catatan. Tambahkan yang pertama!');
    return;
  }

  for (const n of notes) {
    const li = document.createElement('li');
    li.className = 'note-card';

    const title = document.createElement('div');
    title.className = 'note-title';
    title.textContent = n.title;

    const content = document.createElement('div');
    content.className = 'note-content';
    content.textContent = n.content;

    li.appendChild(title);
    li.appendChild(content);
    list.appendChild(li);
  }
}

async function loadActions() {
  const list = document.getElementById('actions');
  list.innerHTML = '';
  const items = await fetchJSON('/action-items/');

  if (items.length === 0) {
    showEmpty(list, 'Belum ada tugas. Tambahkan yang pertama!');
    return;
  }

  for (const a of items) {
    const li = document.createElement('li');
    li.className = 'action-item' + (a.completed ? ' done' : '');

    const text = document.createElement('span');
    text.className = 'action-text';
    text.textContent = a.description;

    const badge = document.createElement('span');
    badge.className = 'status-badge ' + (a.completed ? 'done' : 'open');
    badge.textContent = a.completed ? 'Selesai' : 'Belum';

    li.appendChild(text);
    li.appendChild(badge);

    if (!a.completed) {
      const btn = document.createElement('button');
      btn.className = 'btn-accent';
      btn.textContent = 'Complete';
      btn.onclick = async () => {
        await fetchJSON(`/action-items/${a.id}/complete`, { method: 'PUT' });
        loadActions();
      };
      li.appendChild(btn);
    }

    list.appendChild(li);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('note-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    await fetchJSON('/notes/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    e.target.reset();
    loadNotes();
    loadActions();
  });

  document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    loadNotes(query);
  });

  document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      loadNotes(e.target.value);
    }
  });

  document.getElementById('action-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = document.getElementById('action-desc').value;
    await fetchJSON('/action-items/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    });
    e.target.reset();
    loadActions();
  });

  loadNotes();
  loadActions();
});
