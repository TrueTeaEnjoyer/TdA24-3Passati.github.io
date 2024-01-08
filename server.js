const express = require('express');
const app = express();
const port = 8080;

// Nastavení endpointu pro získání hlavní stránky
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Použijte /API endpoint pro vracení dat
app.use('/API', (req, res) => {
  res.sendFile(__dirname + '/api_v1.json');
});
app.use('/lecturer', (req, res) => {
    res.sendFile(__dirname + '/Lecturer.html');
});
// Startujte Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


