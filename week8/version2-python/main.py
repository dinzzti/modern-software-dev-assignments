from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
import sqlite3

app = FastAPI()
templates = Jinja2Templates(directory="templates")

# Bikin database otomatis
def init_db():
    conn = sqlite3.connect("cuti.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS requests
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  name TEXT, type TEXT, reason TEXT, status TEXT)''')
    conn.commit()
    conn.close()

init_db()

def get_db_connection():
    conn = sqlite3.connect("cuti.db")
    conn.row_factory = sqlite3.Row
    return conn

# READ: Tampilkan halaman utama & data
@app.get("/")
async def read_requests(request: Request):
    conn = get_db_connection()
    requests = conn.execute("SELECT * FROM requests").fetchall()
    conn.close()
    return templates.TemplateResponse("index.html", {"request": request, "requests": requests})

# CREATE: Tambah data cuti baru
@app.post("/add")
async def add_request(name: str = Form(...), type: str = Form(...), reason: str = Form(...)):
    conn = get_db_connection()
    conn.execute("INSERT INTO requests (name, type, reason, status) VALUES (?, ?, ?, ?)",
                 (name, type, reason, "Pending"))
    conn.commit()
    conn.close()
    return RedirectResponse(url="/", status_code=303)

# UPDATE: Ubah status jadi Approved
@app.post("/approve/{req_id}")
async def approve_request(req_id: int):
    conn = get_db_connection()
    conn.execute("UPDATE requests SET status = 'Approved' WHERE id = ?", (req_id,))
    conn.commit()
    conn.close()
    return RedirectResponse(url="/", status_code=303)

# DELETE: Hapus data
@app.post("/delete/{req_id}")
async def delete_request(req_id: int):
    conn = get_db_connection()
    conn.execute("DELETE FROM requests WHERE id = ?", (req_id,))
    conn.commit()
    conn.close()
    return RedirectResponse(url="/", status_code=303)