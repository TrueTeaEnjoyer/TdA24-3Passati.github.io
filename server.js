const express = require('express');
const app = express();
const path = require('path');  // Přidáno pro manipulaci s cestami

const port = 8080;

// Nastavení veřejné složky pro statické soubory
app.use(express.static(path.join(__dirname, 'materials')));

app.use(express,express.json());

// Nastavení endpointu pro získání hlavní stránky
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// endpoint pro přidání učitele
app.post('/api/lectures', (req, res) => {
    
});

app.get('/lecturer', (req, res) => {
    res.sendFile(path.join(__dirname, 'Lecturer.html'));
});

// Startujte Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


