const db = require('sqlite3').verbose();
const database = new db.Database('backend/database.sqlite');
database.all("SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='users'", (err, rows) => {
  console.log('Indexes:', rows);
  database.all("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'", (err, rows) => {
    console.log('Table:', rows);
    database.close();
  });
});