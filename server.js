const express = require('express');
const app = express();
const path = require('path');  // Přidáno pro manipulaci s cestami
const port = 8080;
const sqlite3 = require('sqlite3').verbose();
// Nastavení veřejné složky pro statické soubory
app.use(express.static(path.join(__dirname, 'materials')));

const db = new sqlite3.Database('TdA_DB.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the TdA_DB database.');
});
// Nastavení endpointu pro získání hlavní stránky
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Použijte /API endpoint pro vracení dat
app.use('/API', (req, res) => {
    // Vložte obsah pro /API, pokud je potřeba
});

app.get('/lecturer', (req, res) => {
    res.sendFile(path.join(__dirname, 'Lecturer.html'));
});
app.get('/lecturers', (req, res) => {
  db.all('SELECT * FROM Lecturers', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});


// Startujte Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

