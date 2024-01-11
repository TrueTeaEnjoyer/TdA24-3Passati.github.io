const express = require('express');
const app = express();
const path = require('path');  // Přidáno pro manipulaci s cestami
const port = 8080;
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');



// Nastavení veřejné složky pro statické soubory
app.use(express.static(path.join(__dirname, 'materials')));

app.use(bodyParser.json());

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

//basic get all
app.get('/lecturers', (req, res) => {
  db.all('SELECT * FROM Lecturers', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

//basic post
app.post('/lecturers', (req, res) => {
  const novyLektor = [req.body.uuid, req.body.title_before, req.body.first_name, req.body.middle_name, req.body.last_name, req.body.title_after, req.body.picture_url, req.body.location, req.body.claim, req.body.bio, req.body.telephone_numbers, req.body.emails, req.body.price_per_hour];
 
  db.run('INSERT INTO Lecturers (uuid, title_before, first_name, middle_name, last_name, title_after, picture_url, location, claim, bio, telephone_numbers, emails, price_per_hour) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', novyLektor, function(err) {
     if (err) {
       return console.log(err.message);
     }
     if (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    } else {
      res.status(201).send('Lektor vytvořen');
    }
  });
 });

 //get_uuid
 app.get('/lecturers/:uuid', (req, res) => {
  const uuid = req.params.uuid;
 
  db.get('SELECT * FROM Lecturers WHERE uuid = ?', [uuid], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Server err');
    } else if (!row) {
      res.status(404).send('Lektor nebyl nalezen');
    } else {
      res.json(row);
    }
  });
 });

 //put_uuid
 app.put('/lecturers/:uuid', (req, res) => {
  const uuid = req.params.uuid;
  const newData = req.body;
 
  db.get('SELECT * FROM Lecturers WHERE uuid = ?', [uuid], (err, row) => {
     if (err) {
       throw err;
     }
     if (!row) {
       res.status(404).json({ error: 'Lektor nebyl nalezen' });
       return;
     }

     const mergedData = { ...row, ...newData };
     db.run('UPDATE Lecturers SET name = ?, department = ? WHERE uuid = ?', [
       mergedData.name,
       mergedData.department,
       uuid,
     ]);
     res.json(mergedData);
  });
 });
 

//delete_uuid
app.delete('/lecturers/:uuid', (req, res) => {
 const uuid = req.params.uuid;

 db.run('DELETE FROM Lecturers WHERE uuid = ?', [uuid], (err) => {
    if (err) {
      throw err;
    }
    res.json({ message: 'Lektor byl odebrán' });
 });
});

// Startujte Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

