const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Simpan data sementara di memori
let requests = [];
let idCounter = 1;

// READ: Halaman Utama
app.get('/', (req, res) => {
    res.render('index', { requests });
});

// CREATE: Tambah Cuti
app.post('/add', (req, res) => {
    requests.push({ 
        id: idCounter++, 
        name: req.body.name, 
        type: req.body.type, 
        reason: req.body.reason, 
        status: 'Pending' 
    });
    res.redirect('/');
});

// UPDATE: Approve Cuti
app.post('/approve/:id', (req, res) => {
    const reqItem = requests.find(r => r.id == req.params.id);
    if (reqItem) reqItem.status = 'Approved';
    res.redirect('/');
});

// DELETE: Hapus Cuti
app.post('/delete/:id', (req, res) => {
    requests = requests.filter(r => r.id != req.params.id);
    res.redirect('/');
});

// Jalankan Server
app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});