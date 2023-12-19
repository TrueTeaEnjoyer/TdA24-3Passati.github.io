const express = require('express');
const app = express();
const port = 8080;

// Nastavení endpointu pro získání hlavní stránky
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Použijte /API endpoint pro vracení dat
app.use('/API', (req, res) => {
    // Data, která budou vrácena jako JSON
    const data = {
        Secret: "The cake is a lie"
    };
    
    // Odeslání dat jako JSON
    res.json(data);
});

// Startujte Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


