const express = require('express');
const app = express();
const path = require('path');  // Přidáno pro manipulaci s cestami
const sqlite3 = require('sqlite3').verbose();
const port = 8080;

// Middleware pro zpracování JSON dat v POST požadavcích
app.use(bodyParser.json());
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


// Endpoint přidat učitele
app.post('/api/lecturers', (req, res) => {
    const newLecturer = req.body;

    // DB dotaz
    db.run(`INSERT INTO Lectures (uuid, title_before, first_name, middle_name, last_name, title_after, picture_url, location, claim, bio, telephone_numbers, emails, price_per_hour)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            newLecturer.uuid,
            newLecturer.title_before,
            newLecturer.first_name,
            newLecturer.middle_name,
            newLecturer.last_name,
            newLecturer.title_after,
            newLecturer.picture_url,
            newLecturer.location,
            newLecturer.claim,
            newLecturer.bio,
            newLecturer.telephone_numbers,
            newLecturer.emails,
            newLecturer.price_per_hour
        ],
        function (err) {
            if (err) {
                console.error('Chyba při vkládání do databáze:', err.message);
                res.status(500).json({ error: 'Chyba při vkládání do databáze' });
            } else {
                res.json({ message: 'Učitel byl úspěšně přidán do databáze' });
            }
        }
    );
});

app.get('/lecturer', (req, res) => {
    res.sendFile(path.join(__dirname, 'Lecturer.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


