# Week 4 Write-up

## SUBMISSION DETAILS

Name: Dina
SUNet ID: [Isi dengan NIM atau Username Kampus kamu ya, Din!]
Citations: Claude Code documentation, Course Best Practices, and AI Collaboration.

This assignment took me about 4 hours to do. 

## YOUR RESPONSES
### Automation #1: Project Knowledge Base (`CLAUDE.md`)
a. Design inspiration
> Terinspirasi dari dokumen "Claude Code Best Practices". Fokusnya adalah memberikan "Shared Context" agar AI tidak perlu terus-menerus bertanya tentang struktur folder dan aturan penulisan kode di proyek ini.

b. Design of each automation, including goals, inputs/outputs, steps
> - **Goals:** Memberikan SOP (Standard Operating Procedure) otomatis kepada AI agen.
> - **Inputs:** Inisialisasi sesi Claude Code di direktori proyek.
> - **Outputs:** Respons AI yang patuh pada aturan (misal: selalu menulis test sebelum kode).
> - **Steps:** Claude membaca file CLAUDE.md -> Mengekstrak navigasi folder -> Menerapkan aturan TDD (Test-Driven Development) pada setiap permintaan modifikasi kode.

c. How to run it (exact commands), expected outputs, and rollback/safety notes
> - **How to run:** Jalankan perintah `claude` di terminal folder `week4`.
> - **Expected outputs:** Claude mengakui adanya panduan proyek dan memberikan saran folder yang tepat (misal: `/backend/app/routers`).
> - **Safety notes:** File ini bersifat instruksional (read-only context), tidak ada risiko modifikasi file secara paksa.

d. Before vs. after
> - **Before:** Saya harus menjelaskan berulang kali di mana letak file backend atau meminta AI untuk menjalankan linter secara manual.
> - **After:** AI sudah tahu "peta" proyek dan otomatis menjalankan pengecekan linter/formatter (black & ruff) setelah mengedit kode sesuai instruksi di file ini.

e. How you used the automation to enhance the starter application
> Saya menggunakannya untuk memastikan setiap perubahan pada endpoint `/notes` atau `/action-items` selalu disertai dengan unit test di folder `/backend/tests`, menjaga kualitas kode tetap stabil tanpa perlu pengawasan manual yang ketat.


### Automation #2: Custom Slash Command (`/test-app`)
a. Design inspiration
> Terinspirasi dari fitur "Custom Commands" pada Claude Code. Tujuannya adalah menyederhanakan workflow pengujian yang tadinya terdiri dari beberapa perintah terminal menjadi satu perintah singkat.

b. Design of each automation, including goals, inputs/outputs, steps
> - **Goals:** Menjalankan testing (pytest) dan linting (ruff) dalam satu rangkaian otomatis.
> - **Inputs:** Mengetik perintah `/test-app` di prompt Claude Code.
> - **Outputs:** Ringkasan status tes (PASS/FAIL) dan laporan kebersihan kode dari ruff.
> - **Steps:** Menjalankan `pytest -q backend/tests` -> Jika sukses, lanjut menjalankan `ruff check .` -> Memberikan ringkasan akhir kepada pengguna.

c. How to run it (exact commands), expected outputs, and rollback/safety notes
> - **How to run:** Ketik `/test-app` di terminal Claude Code.
> - **Expected outputs:** Laporan ringkas: "All tests passed. Code looks clean!" atau daftar error yang perlu diperbaiki.
> - **Safety notes:** Perintah ini hanya bersifat diagnostik (pengecekan), tidak akan mengubah kode sumber secara permanen tanpa persetujuan pengguna.

d. Before vs. after
> - **Before:** Saya harus mengetik manual `pytest`, lalu `black .`, lalu `ruff check .` secara bergantian untuk memastikan kode aman.
> - **After:** Cukup satu perintah `/test-app` dan AI akan melakukan semua pengecekan tersebut secara otomatis dan melaporkan hasilnya dalam bahasa manusia yang mudah dimengerti.

e. How you used the automation to enhance the starter application
> Saya menggunakannya setiap kali selesai melakukan *refactoring* kode backend. Otomatisasi ini mempercepat siklus *feedback*, sehingga saya tahu detik itu juga jika ada perubahan kode yang merusak fitur yang sudah ada (*regression*).