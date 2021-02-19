var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE columns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            label text
            )`,
        (err) => {
            if (err) {
                // columns table already created
                console.log('Columns')
            } else {
                // try to create the cards table
                db.run(`CREATE TABLE cards (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    description text,
                    columnid INTEGER,
                    FOREIGN KEY(columnid) REFERENCES columns(id)
                    )`,
                (err) => {
                    if (err) {
                        // Table already created
                        console.log('Cards')
                    }
                });
            }
        });  
    }
});


module.exports = db