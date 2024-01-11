const express = require('express');
const app = express();
const path = require('path');  // Přidáno pro manipulaci s cestami
const port = 8080;

// Nastavení veřejné složky pro statické soubory
app.use(express.static(path.join(__dirname, 'materials')));

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
app.get('/lecturers',(req, res) => {
    
});   
// Startujte Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

