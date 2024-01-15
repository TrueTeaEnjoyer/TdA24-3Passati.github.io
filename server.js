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
    res.sendFile(path.join(__dirname, 'Hlavni.html'));
});
app.get('/Luk4s', (req, res) => {
    res.sendFile(path.join(__dirname, 'Lukáš.html'));
});
app.get('/Mate0', (req, res) => {
    res.sendFile(path.join(__dirname, 'Mateo.html'));
});
app.get('/samikm', (req, res) => {
    res.sendFile(path.join(__dirname, 'Michal.html'));
});

// Použijte /API endpoint pro vracení dat
app.use('/API', (req, res) => {
    // Vložte obsah pro /API, pokud je potřeba
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
app.post('/lecturers', async (req, res) => {
  let novyLektor = [req.body.uuid, req.body.title_before, req.body.first_name, req.body.middle_name, req.body.last_name, req.body.title_after, req.body.picture_url, req.body.location, req.body.claim, req.body.bio, req.body.price_per_hour];
  let lecturerId;
  const tags = req.body.tags;
  const contact = req.body.contact;

  try {
    // Begin transaction
    await db.run('BEGIN TRANSACTION;');

    // Insert lecturer
    const lecturerRow = await new Promise((resolve, reject) => {
      db.run('INSERT INTO Lecturers (uuid, title_before, first_name, middle_name, last_name, title_after, picture_url, location, claim, bio, price_per_hour) VALUES (?,?,?,?,?,?,?,?,?,?,?)', novyLektor, function(err, row) {
        if (err) {
          db.run('ROLLBACK;');
          console.error(err.message);
          reject(new Error('Server error2'));
        } else {
          lecturerId = req.body.uuid;
          resolve(row);
        }
      });
    });

    if (contact) {
      const telephoneNumbers = contact.telephone_numbers || [];
      const emails = contact.emails || [];

      await db.run('INSERT INTO Contact (LecUUID) VALUES (?)', [req.body.uuid]);

      await Promise.all(
        telephoneNumbers.map(number =>
          new Promise((resolve, reject) => {
            db.run('INSERT INTO Contact (LecUUID, typ, value) VALUES (?,?,?)', [req.body.uuid, 'telephone_number', number], function(err) {
              if (err) {
                db.run('ROLLBACK;');
                console.error(err.message);
                reject(new Error('Server error9'));
              } else {
                resolve();
              }
            });
          })
        )
      );

      await Promise.all(
        emails.map(email =>
          new Promise((resolve, reject) => {
            db.run('INSERT INTO Contact (LecUUID, typ, value) VALUES (?,?,?)', [req.body.uuid, 'email', email], function(err) {
              if (err) {
                db.run('ROLLBACK;');
                console.error(err.message);
                reject(new Error('Server error10'));
              } else {
                resolve();
              }
            });
          })
        )
      );
    }

    // Insert lecturer-tag relationships
    if (tags) {
      for (const tag of tags) {
        // Check if the tag already exists
        const tagRow = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM Tags WHERE uuid = ?', [tag], function(err, row) {
            if (err) {
              db.run('ROLLBACK;');
              console.error(err.message);
              reject(new Error('Server error3'));
            } else {
              resolve(row);
            }
          });
        });

        if (tagRow) {
          // If the tag exists, insert the relationship
          await db.run('INSERT INTO LecturerTags (lecturer_uuid, tag_uuid) VALUES (?,?)', [lecturerId, tagRow.id]);
        } else {
          // If the tag doesn't exist, insert the tag and the relationship
          const newTagRow = await new Promise((resolve, reject) => {
            db.run('INSERT INTO Tags (tag) VALUES (?)', [tag], function(err, row) {
              if (err) {
                db.run('ROLLBACK;');
                console.error(err.message);
                reject(new Error('Server error5'));
              } else {
                resolve(row);
              }
            });
          });

          await db.run('INSERT INTO LecturerTags (lecturer_uuid, tag_uuid) VALUES (?,?)', [lecturerId, newTagRow.lastID]);
          
        }
      }
    }

    // Commit transaction
    await db.run('COMMIT;');

    res.status(200).send('Lektor vytvořen');
  } catch (err) {
    try {
      // Rollback transaction
      await db.run('ROLLBACK;');
    } catch (rollbackErr) {
      console.error(rollbackErr.message);
    }
    console.error(err.message);
    res.status(500).send('Server error111');
  }
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

