const express = require('express');
const app = express();
const port = 8080;

// Nastavení endpointu pro získání hlavní stránky
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Použijte /API endpoint pro vracení dat
app.use('/API', (req, res) => {
  
});
app.get('/lecturer', (req, res) => {
    res.sendFile(__dirname + '/Lecturer.html');
     res.sendFile(__dirname + 'TeacherDigitalAgency_LOGO_white.png');
});
// Startujte Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

