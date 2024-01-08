const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use(bodyParser.json());

// Připojení k databázi
const db = new sqlite3.Database('TdA_DB.db', (err) => {
    if (err) {
        console.error('Chyba při připojování k databázi:', err.message);
    } else {
        console.log('Připojení k databázi proběhlo úspěšně.');
    }
});

// Nastavení endpointu pro získání hlavní stránky
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Nastavení endpointu pro získání seznamu lektorů
app.get('/lecturers', (req, res) => {
    // Získání všech lektorů z databáze
    db.all('SELECT * FROM lecturers', (err, lecturers) => {
        if (err) {
            console.error('Chyba při čtení dat z databáze:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(lecturers);
        }
    });
});

// Nastavení endpointu pro získání detailů o konkrétním lektorovi
app.get('/lecturers/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    
    // Získání konkrétního lektora z databáze podle uuid
    db.get('SELECT * FROM lecturers WHERE uuid = ?', [uuid], (err, lecturer) => {
        if (err) {
            console.error('Chyba při čtení dat z databáze:', err.message);
            res.status(500).send('Internal Server Error');
        } else if (!lecturer) {
            res.status(404).send('Not Found');
        } else {
            res.json(lecturer);
        }
    });
});

// Nastavení endpointu pro vytvoření nového lektora
app.post('/lecturers', (req, res) => {
    const lecturerData = req.body;

    // Vložení nového lektora do databázr
    db.run('INSERT INTO lecturers (title_before, first_name, middle_name, last_name, title_after, picture_url, location, claim, bio, price_per_hour) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [lecturerData.title_before, lecturerData.first_name, lecturerData.middle_name, lecturerData.last_name, lecturerData.title_after, lecturerData.picture_url, lecturerData.location, lecturerData.claim, lecturerData.bio, lecturerData.price_per_hour],
        function(err) {
            if (err) {
                console.error('Chyba při vkládání dat do databáze:', err.message);
                res.status(500).send('Internal Server Error');
            } else {
                lecturerData.uuid = this.lastID; // Poslání nově vytvořeného ID zpět klientovi
                res.json(lecturerData);
            }
        });
});

// Nastavení endpointu pro úpravu existujícího lektora
app.put('/lecturers/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    const updatedData = req.body;

    // Aktualizace lektora v databázi
    // Předpokládám, že tabulka 'lecturers' má sloupce odpovídající vlastnostem updatedData
    db.run('UPDATE lecturers SET title_before = ?, first_name = ?, middle_name = ?, last_name = ?, title_after = ?, picture_url = ?, location = ?, claim = ?, bio = ?, price_per_hour = ? WHERE uuid = ?',
        [updatedData.title_before, updatedData.first_name, updatedData.middle_name, updatedData.last_name, updatedData.title_after, updatedData.picture_url, updatedData.location, updatedData.claim, updatedData.bio, updatedData.price_per_hour, uuid],
        function(err) {
            if (err) {
                console.error('Chyba při aktualizaci dat v databázi:', err.message);
                res.status(500).send('Internal Server Error');
            } else if (this.changes === 0) {
                res.status(404).send('Not Found');
            } else {
                res.json(updatedData);
            }
        });
});

// Nastavení endpointu pro smazání lektora
app.delete('/lecturers/:uuid', (req, res) => {
    const uuid = req.params.uuid;

    // Smazání lektora z databáze
    db.run('DELETE FROM lecturers WHERE uuid = ?', [uuid], function(err) {
        if (err) {
            console.error('Chyba při mazání dat z databáze:', err.message);
            res.status(500).send('Internal Server Error');
        } else if (this.changes === 0) {
            res.status(404).send('Not Found');
        } else {
            res.status(204).send(); // Úspěšně smazáno (204 No Content)
        }
    });
});

// Startujte Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


