const mysql = require('mysql2');

const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "convergedinfra"
});

database.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database!');
});

module.exports = database;
