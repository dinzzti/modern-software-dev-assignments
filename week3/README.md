# NASA MCP Server (Local STDIO) 🚀

## 📌 Deskripsi Proyek
Proyek ini adalah implementasi Server Model Context Protocol (MCP) kustom yang membungkus **NASA API**. Server ini berjalan secara lokal menggunakan transport STDIO dan mengimplementasikan fitur **Otentikasi (Bonus +5 Poin)** menggunakan API Key resmi dari NASA.

## 🛠️ Persyaratan & Pengaturan Lingkungan
1. Pastikan Python sudah terinstall (versi 3.10+).
2. Install dependensi yang dibutuhkan dengan perintah berikut di terminal:
   ```bash
   pip install mcp requests
Pengaturan Token (Otentikasi):
Server ini membutuhkan API Key NASA untuk mengakses data tanpa batasan rate limit publik (Bonus Poin). API Key sudah disematkan di dalam variabel NASA_API_KEY di dalam file main.py.

🖥️ Cara Menjalankan (Integrasi dengan Claude Desktop)
Server ini menggunakan transport STDIO, sehingga harus dipanggil oleh klien MCP seperti Claude Desktop.

Langkah-langkah integrasi ke Claude Desktop:

Buka aplikasi Claude Desktop di komputermu.

Buka file konfigurasi Claude Desktop:

Windows: Tekan Win + R, ketik %APPDATA%\Claude\claude_desktop_config.json, lalu tekan Enter.

Mac: Buka terminal dan ketik open ~/Library/Application\ Support/Claude/claude_desktop_config.json

Tambahkan konfigurasi server NASA ini ke dalam file JSON tersebut:

JSON
{
  "mcpServers": {
    "NASA_Agent": {
      "command": "python",
      "args": [
        "C:\\JALUR\\MENUJU\\FOLDER\\week3\\server\\main.py" 
      ]
    }
  }
}
(Catatan: Ganti tulisan C:\\JALUR\\MENUJU... dengan lokasi asli file main.py di komputermu. Gunakan garis miring ganda \\ untuk Windows).

Simpan file claude_desktop_config.json tersebut.

Restart (Tutup dan Buka lagi) aplikasi Claude Desktop. Ikon palu/tools akan muncul di layar chat Claude menandakan server berhasil terhubung.

🧰 Referensi Alat (Tools Reference)
Server ini menyediakan 2 alat (tools) utama yang dilengkapi dengan validasi input dan penanganan pesan error (graceful error handling):

1. get_astronomi_hari_ini
Deskripsi: Mengambil Gambar Astronomi NASA Hari Ini (Astronomy Picture of the Day).

Parameter:

tanggal (string, opsional): Tanggal spesifik dengan format YYYY-MM-DD (contoh: "2023-10-15"). Jika dikosongkan, akan mengambil data hari ini.

Perilaku yang Diharapkan: Mengembalikan data berupa Judul, Tanggal, Link Gambar, Hak Cipta, dan Penjelasan (Sinopsis) dari fenomena astronomi tersebut. Jika format tanggal salah, akan mengembalikan pesan error yang elegan.

2. cari_foto_mars
Deskripsi: Mencari foto asli yang diambil oleh robot penjelajah NASA (Curiosity Rover) di planet Mars berdasarkan tanggal di bumi.

Parameter:

tanggal_bumi (string, wajib): Tanggal foto diambil dengan format YYYY-MM-DD (contoh: "2015-06-03").

Perilaku yang Diharapkan: Mengembalikan daftar maksimal 3 foto pertama yang diambil pada tanggal tersebut, lengkap dengan nama kamera dan link fotonya. Jika pada tanggal tersebut robot tidak mengambil foto, akan mengembalikan pesan pemberitahuan yang rapi.


---

**Langkah Terakhir untuk Menyambungkan ke Claude:**
Sesuai instruksi di README tersebut, pastikan kamu memasukkan lokasi asli file `main.py` kamu ke dalam file pengaturan Claude Desktop (`claude_desktop_config.json`).