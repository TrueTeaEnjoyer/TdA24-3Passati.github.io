const express = require('express');
const app = express();
const path = require('path');  // Přidáno pro manipulaci s cestami
const sqlite3 = require('sqlite3').verbose();
const port = 8080;

// Nastavení veřejné složky pro statické soubory
app.use(express.static(path.join(__dirname, 'materials')));

// Připojení k db
const db = new sqlite3.Database('./TdA_DB.db', (err) => {
    if (err) {
        console.error('Chyba připojení k databázi:', err.message);
    } else {
        console.log('Připojeno k databázi.');    
    }
});
// endpoint hlavní stránky
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/lecturer', (req, res) => {
    res.sendFile(path.join(__dirname, 'Lecturer.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


