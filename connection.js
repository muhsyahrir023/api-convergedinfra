const mysql = require('mysql2');

const database = mysql.createPool({
    host: "sql.freedb.tech",
    user: "freedb_cidev",
    password: "$33Q!TpYfaSe9gz",
    database: "freedb_convergedinfra",
    acquireTimeout: 10000 // Menetapkan batas waktu akuisisi koneksi menjadi 10 detik (opsional, bisa disesuaikan)
});

database.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database!');
});

module.exports = database;
