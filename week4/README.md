# Panduan Claude Code untuk Proyek Week 4

Ini adalah panduan utama untuk mengerjakan proyek ini. Patuhi aturan berikut setiap kali diminta untuk menulis atau memodifikasi kode.

## 📁 Navigasi Kode
- Backend (FastAPI): `/backend`
- Database & Models: `/backend/app/db.py` dan `/backend/app/models.py`
- API Routers: `/backend/app/routers/`
- Frontend (HTML/JS/CSS statis): `/frontend`
- Tests (Pytest): `/backend/tests/`

## 🛠️ Perintah Penting (Commands)
- Menjalankan aplikasi: `uvicorn backend.app.main:app --reload`
- Menjalankan tes: `pytest -q backend/tests`
- Merapikan kode (Formatting): `black .` dilanjutkan dengan `ruff check . --fix`
- Mengecek error kode (Linting): `ruff check .`

## 📋 Aturan Alur Kerja (Workflow Rules)
1. **Test-Driven:** Jika kamu diminta untuk menambahkan *endpoint* API baru atau fitur baru, kamu HARUS menulis file test-nya (di folder tests) terlebih dahulu agar *failing*, lalu baru tulis implementasi kodenya agar test-nya *pass*.
2. **Rapi & Bersih:** Setiap kali selesai mengedit atau menambahkan kode Python, kamu HARUS menjalankan perintah *formatting* dan *linting* di atas untuk memastikan kode sesuai standar (black/ruff).
3. **Database:** Aplikasi ini menggunakan SQLite. Jika ada perubahan skema, pastikan untuk memperbarui skema di `models.py` dan periksa apakah `data/seed.sql` perlu disesuaikan.