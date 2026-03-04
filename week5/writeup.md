# Week 5 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## INSTRUCTIONS

Fill out all of the `TODO`s in this file.

## SUBMISSION DETAILS

Name: **Dina** \
SUNet ID: **dina** \
Citations: Warp AI Agent (Oz) digunakan sebagai asisten untuk implementasi kode dan penulisan test.

This assignment took me about **4** hours to do.


## YOUR RESPONSES

### Tasks yang Dikerjakan

**Tugas 8 — List endpoint pagination for all collections (easy)**

Perubahan backend:
- `backend/app/schemas.py`: Menambahkan model `PaginatedNoteResponse` dan `PaginatedActionItemResponse`, masing-masing berisi field `items` (list data) dan `total` (jumlah seluruh data di database). Juga menambahkan validasi `min_length=1` pada field `title`, `content` (NoteCreate) dan `description` (ActionItemCreate) menggunakan `pydantic.Field`.
- `backend/app/routers/notes.py`: Endpoint `GET /notes/` diubah agar menerima query parameter `page` (default 1) dan `page_size` (default 10). Query menggunakan `func.count()` untuk menghitung total, serta `offset` dan `limit` untuk pagination. Response model diubah menjadi `PaginatedNoteResponse`.
- `backend/app/routers/action_items.py`: Perubahan yang sama diterapkan pada `GET /action-items/` dengan `PaginatedActionItemResponse`.

Perubahan frontend:
- `frontend/index.html`: Menambahkan elemen pagination berupa tombol "Previous", "Next", dan teks "Page X of Y" di bawah daftar notes.
- `frontend/app.js`: Menambahkan logika pagination (`currentPage`, `PAGE_SIZE`, `totalNotes`). Fungsi `loadNotes()` memanggil `/notes/?page=...&page_size=...` dan mengekstrak `items` dan `total` dari response JSON. Menambahkan fungsi `fetchJSON()` dengan error handling untuk status 404 dan 400. Menambahkan fungsi `showError()` untuk menampilkan pesan error yang ramah pengguna di UI.

Perubahan test:
- `backend/tests/test_notes.py`: Test `test_create_and_list_notes` diperbarui untuk mengecek format response `{items, total}`. Ditambahkan test `test_notes_pagination_boundaries` yang menguji: page_size=2 dengan 3 data (halaman 1 berisi 2 item, halaman 2 berisi 1 item), halaman kosong (page 3), dan page_size yang lebih besar dari total data.
- `backend/tests/test_action_items.py`: Perubahan serupa pada test `test_create_and_complete_action_item` dan penambahan `test_action_items_pagination_boundaries`.

**Tugas 10 — Test coverage improvements (easy)**

Perubahan test:
- `backend/tests/test_notes.py`: Ditambahkan 4 skenario test baru:
  - `test_get_note_not_found`: GET `/notes/9999` mengembalikan status 404.
  - `test_create_note_empty_title_returns_422`: POST dengan title kosong (`""`) mengembalikan 422.
  - `test_create_note_empty_content_returns_422`: POST dengan content kosong mengembalikan 422.
  - `test_create_note_missing_fields_returns_422`: POST dengan body kosong (`{}`) mengembalikan 422.
- `backend/tests/test_action_items.py`: Ditambahkan 3 skenario test baru:
  - `test_complete_item_not_found`: PUT `/action-items/9999/complete` mengembalikan 404.
  - `test_create_item_empty_description_returns_422`: POST dengan description kosong mengembalikan 422.
  - `test_create_item_missing_fields_returns_422`: POST dengan body kosong mengembalikan 422.

Total test: 12 test (semua passed).

---

### Automation A: Warp Drive saved prompts, rules, MCP servers

a. Design of each automation, including goals, inputs/outputs, steps

Saya merancang workflow di Warp Drive berjudul "Final Quality & Testing".

Goal: Memastikan integritas kode setelah modifikasi otomatis oleh agen AI.

Input: Perintah terminal `$env:PYTHONPATH="."; pytest -v backend/tests ; ruff check . --fix`.

Steps: (1) Inisialisasi environment variabel, (2) Eksekusi unit tests untuk validasi logika, (3) Menjalankan linter Ruff untuk merapikan format kode secara otomatis.

b. Before vs. after (i.e. manual workflow vs. automated workflow)

Before: Setiap kali agen selesai mengubah file, saya harus mengetik manual dua perintah panjang secara terpisah untuk memastikan tidak ada fitur yang rusak (regression).

After: Cukup memanggil workflow dari Warp Drive dengan satu klik. Proses verifikasi menjadi jauh lebih cepat dan terstandarisasi.

c. Autonomy levels used for each completed task (what code permissions, why, and how you supervised)

Saya menggunakan Supervised Autonomy. Agen memiliki izin untuk menulis file (backend/, frontend/) dan menjalankan perintah terminal, namun saya tetap mengawasi setiap langkah dan meninjau (diff check) perubahan sebelum disetujui untuk memastikan tidak ada kode yang salah atau menghapus data penting.

d. (if applicable) Multi‑agent notes: roles, coordination strategy, and concurrency wins/risks/failures

N/A (Detail multi-agent ada di bagian Automation B).

e. How you used the automation (what pain point it resolves or accelerates)

Automation ini menyelesaikan pain point berupa lambatnya proses pengetikan perintah berulang di Windows PowerShell. Setiap kali agen selesai mengedit file backend (routers, schemas) atau menambahkan test baru, workflow ini langsung dijalankan untuk memverifikasi bahwa seluruh 12 test tetap passed dan tidak ada linting error. Ini sangat mempercepat siklus Fix → Test → Refactor.

### Automation B: Multi‑agent workflows in Warp

a. Design of each automation, including goals, inputs/outputs, steps

Saya menjalankan sesi Multi-agent secara konkuren di dua tab Warp yang berbeda untuk mengerjakan Tugas 8 (Pagination) dan Tugas 10 (Test Coverage).

Agent 1 (Tab 1): Bertanggung jawab pada logika Backend — mengubah `schemas.py` (menambah `PaginatedNoteResponse`, `PaginatedActionItemResponse`, validasi `min_length`), mengubah `routers/notes.py` dan `routers/action_items.py` (menambah parameter `page`/`page_size`, query `func.count`, `offset`/`limit`), serta menulis semua unit test di `test_notes.py` dan `test_action_items.py`.

Agent 2 (Tab 2): Bertanggung jawab pada UI Frontend — mengupdate `app.js` untuk memanggil endpoint paginated (`/notes/?page=...&page_size=...`), mem-parse response `{items, total}`, menambahkan navigasi Previous/Next, error handling (`fetchJSON`, `showError`), dan menambahkan elemen pagination di `index.html`.

b. Before vs. after (i.e. manual workflow vs. automated workflow)

Before: Saya harus bekerja secara sekuensial; menunggu backend selesai dikoding, baru kemudian berpindah ke frontend untuk menyesuaikan tampilan.

After: Kedua agen bekerja secara paralel. Saat Agen 1 sedang mengimplementasikan pagination di routers dan menulis test boundaries, Agen 2 sudah selesai mendesain tombol "Previous/Next" dan logika `updatePaginationButtons()` di frontend.

c. Autonomy levels used for each completed task (what code permissions, why, and how you supervised)

Kedua agen diberikan izin tulis penuh pada folder proyek. Saya bertindak sebagai Orchestrator, memberikan instruksi spesifik kepada setiap agen agar format data JSON yang dihasilkan backend (`{items: [...], total: N}`) dipahami secara sinkron oleh agen frontend. Saya juga meninjau setiap diff sebelum menyetujui perubahan.

d. (if applicable) Multi‑agent notes: roles, coordination strategy, and concurrency wins/risks/failures

Concurrency Wins: Pengerjaan Tugas 8 (Pagination) selesai lebih cepat karena logika backend dan frontend dibangun bersamaan. Backend menghasilkan 12 test passed sementara frontend sudah siap mengkonsumsi API.

Risks: Ada risiko konflik jika kedua agen mencoba mengubah file yang sama. Saya mengatasinya dengan membagi tanggung jawab yang jelas (Agen 1 fokus di `backend/`, Agen 2 fokus di `frontend/`).

Failures: Tidak ada kegagalan signifikan. Satu-satunya masalah minor adalah modul `fastapi` belum terinstal di awal, yang segera diatasi oleh agen dengan menjalankan `pip install fastapi`.

e. How you used the automation (what pain point it resolves or accelerates)

Mempercepat proses integrasi full-stack. Pain point utama yang teratasi adalah sinkronisasi kontrak API antara frontend dan backend — frontend harus tahu bahwa response berubah dari array biasa menjadi objek `{items, total}`, dan hal ini dikoordinasikan secara paralel tanpa menunggu satu sisi selesai terlebih dahulu.
