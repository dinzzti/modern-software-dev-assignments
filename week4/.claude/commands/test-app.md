# Jalankan Testing dan Cek Error

Jalankan semua file testing menggunakan pytest dan berikan ringkasan hasilnya.

Langkah-langkah:
1. Jalankan perintah terminal: `pytest -q backend/tests`
2. Jika ada test yang gagal (FAILED), periksa pesan error-nya dan berikan saran perbaikan (baris kode mana yang salah).
3. Jika semua test berhasil (PASSED), jalankan linter dengan perintah: `ruff check .` untuk memastikan tidak ada masalah gaya penulisan kode.
4. Berikan laporan akhir singkat (maksimal 3 kalimat) kepada pengguna.