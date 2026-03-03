import requests
from mcp.server.fastmcp import FastMCP

# 1. Inisialisasi Server MCP
mcp = FastMCP("NASA_Agent")

# 2. Siapkan API Key NASA (Bonus Poin Tugas: Otentikasi API Key)
NASA_API_KEY = "w1dIDf8EtTwNrSAqesTioJyb2DvIcKr7UUhHeTqd"

# ==========================================
# TOOL 1: Gambar Astronomi Hari Ini (APOD)
# ==========================================
@mcp.tool()
def get_astronomi_hari_ini(tanggal: str = "") -> str:
    """
    Mengambil Gambar Astronomi NASA Hari Ini (Astronomy Picture of the Day).
    Parameter 'tanggal' opsional (format: YYYY-MM-DD). Jika kosong, akan mengambil hari ini.
    """
    url = "https://api.nasa.gov/planetary/apod"
    params = {"api_key": NASA_API_KEY}
    
    if tanggal:
        params["date"] = tanggal
        
    try:
        response = requests.get(url, params=params)
        
        # Penanganan jika format tanggal salah atau data tidak ada
        if response.status_code == 400:
            return f"Maaf, format tanggal salah atau data untuk tanggal '{tanggal}' belum tersedia."
        response.raise_for_status()
        
        data = response.json()
        
        output = (
            f"🌌 Judul: {data.get('title')}\n"
            f"📅 Tanggal: {data.get('date')}\n"
            f"📸 Link Gambar: {data.get('url')}\n"
            f"👤 Hak Cipta: {data.get('copyright', 'Public Domain NASA')}\n\n"
            f"📝 Penjelasan:\n{data.get('explanation')}"
        )
        return output

    except requests.exceptions.RequestException as e:
        return f"Error saat menghubungi NASA API: {str(e)}"

# ==========================================
# TOOL 2: Cari Foto dari Robot di Mars (Mars Rover)
# ==========================================
@mcp.tool()
def cari_foto_mars(tanggal_bumi: str) -> str:
    """
    Mencari foto yang diambil oleh robot NASA (Curiosity Rover) di planet Mars.
    Parameter 'tanggal_bumi' wajib diisi dengan format YYYY-MM-DD (contoh: 2015-06-03).
    """
    url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos"
    params = {
        "earth_date": tanggal_bumi,
        "api_key": NASA_API_KEY
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        photos = data.get("photos", [])
        
        if not photos:
            return f"Tidak ada foto yang diambil oleh robot Mars pada tanggal {tanggal_bumi}. Coba tanggal lain!"
        
        # Ambil maksimal 3 foto pertama saja
        output = f"🚀 Ditemukan {len(photos)} foto di Mars pada {tanggal_bumi}. Ini 3 foto pertama:\n\n"
        for i, photo in enumerate(photos[:3], 1):
            camera = photo.get("camera", {}).get("full_name", "Kamera Tidak Diketahui")
            output += f"{i}. Kamera: {camera}\n"
            output += f"   Link Foto: {photo.get('img_src')}\n\n"
            
        return output

    except requests.exceptions.RequestException as e:
        return f"Error saat menghubungi NASA API: {str(e)}"

# 3. Jalankan Server
if __name__ == "__main__":
    # Dijalankan dengan mode STDIO agar bisa dibaca oleh Claude Desktop
    mcp.run(transport="stdio")