const mysql = require('mysql2');

const database = mysql.createConnection({
     host: "sql.freedb.tech",
    user: "freedb_cidev",
    password: "$33Q!TpYfaSe9gz",
    database: "freedb_convergedinfra"
});

database.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database!');
});

module.exports = database;
