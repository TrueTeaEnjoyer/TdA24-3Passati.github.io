const express = require('express');
const app = express();
const port = 8080;

// Definujte proměnnou data s požadovaným textem
const data = {
    Secret: "The cake is a lie"
};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Použijte /API endpoint pro vracení dat
app.use('/API', (req, res) => {
    res.json(data);
});

// Startujte Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

