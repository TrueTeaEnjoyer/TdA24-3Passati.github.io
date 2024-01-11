const express = require('express');
const app = express();
const path = require('path');  // Přidáno pro manipulaci s cestami
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const port = 8080;
const db = new sqlite3.Database('TdA_DB.db');
    

// Nastavení veřejné složky pro statické soubory
app.use(express.static(path.join(__dirname, 'materials')));


app.use(express,express.json());



// endpoint pro přidání učitele
app.post('/api/lectures', (req, res) => {
    response ("200");
});

app.get('/lecturer', (req, res) => {
    res.sendFile(path.join(__dirname, 'Lecturer.html'));
});

// Startujte Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
