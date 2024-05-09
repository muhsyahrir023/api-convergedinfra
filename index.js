const express = require('express')
const cors = require('cors');
const app = express()
const port = 3001
const bodyParser = require('body-parser')
const database = require('./connection')
const response = require('./response')
const bcrypt = require('bcrypt')

app.use(bodyParser.json())
app.use(cors());


// Endpoint untuk autentikasi login
app.post('/auth', (req, res) => {
  const { username, password } = req.body;

  // Query ke database untuk mencari pengguna berdasarkan username
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  database.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Cek apakah pengguna ditemukan
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ Status: 'Success' });
  });
});


app.get('/views', (req, res) => {
  database.query("SELECT * FROM problems", (error, result) =>{
    // hasil data dari mysql
    response(200, result, 'Get Data Successfully', res )
  })
  
})

app.get('/views/:id', (req, res) => {
  const { id } = req.params; // Ambil ID dari URL

  // Lakukan query untuk mengambil data berdasarkan ID yang diterima
  const sql = 'SELECT * FROM problems WHERE id = ?';
  database.query(sql, [id], (error, result) => {
    if (error) {
      console.error('Error fetching problem by ID:', error);
      response(500, {}, 'Internal Server Error', res);
      return;
    }

    // Periksa apakah data ditemukan
    if (result.length === 0) {
      // Tampilkan pesan bahwa data tidak ditemukan
      response(404, {}, 'Problem Not Found', res);
      return;
    }

    // Kirim data yang ditemukan sebagai respons
    response(200, result[0], 'Problem Found', res);
  });
});

app.put('/views/:id', (req, res) => {
  const { id } = req.params; // Ambil ID dari URL
  const { request, temporary, permanent, status, date } = req.body; // Ambil data yang akan diperbarui dari body permintaan

  // Lakukan query untuk mengambil data sebelumnya dari database
  const selectSQL = 'SELECT * FROM problems WHERE id = ?';
  database.query(selectSQL, [id], (error, rows) => {
    if (error) {
      console.error('Error fetching problem data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }

    // Periksa apakah data ditemukan di database
    if (rows.length === 0) {
      res.status(404).json({ message: 'Problem Not Found' });
      return;
    }

    const previousData = rows[0]; // Ambil data sebelumnya dari database

    // Lakukan query untuk memperbarui data di database berdasarkan ID yang diterima
    const updateSQL = 'UPDATE problems SET request = ?, temporary = ?, permanent = ?, status = ?, date = ? WHERE id = ?';
    database.query(updateSQL, [request || previousData.request, temporary || previousData.temporary, permanent || previousData.permanent, status || previousData.status, date || previousData.date, id], (error, result) => {
      if (error) {
        console.error('Error updating problem:', error);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }

      // Kirim respons bahwa data berhasil diperbarui
      res.status(200).json({ message: 'Problem Updated Successfully' });
    });
  });
});



app.delete('/delete-problems', (req, res) => {
  // Ambil array ID masuk dari body permintaan
  const { ids } = req.body;

  // Pastikan ids yang diterima adalah array
  if (!Array.isArray(ids)) {
    response(400, {}, 'Invalid ID format', res);
    return;
  }

  // Lakukan penghapusan data berdasarkan ID yang diterima
  const sql = 'DELETE FROM problems WHERE id IN (?)';
  database.query(sql, [ids], (err, result) => {
    if (err) {
      console.error('Error deleting problems:', err);
      response(500, {}, 'Internal Server Error', res);
      return;
    }
    response(200, result, 'Data Deleted Successfully', res);
  });
});


app.post('/add-problem', (req, res) => {
    const {request, temporary, permanent, status, date} = req.body;
    const sql = 'INSERT INTO problems (request, temporary, permanent, status, date) VALUES (?, ?, ?, ?, ?)';
    database.query(sql, [request, temporary, permanent, status, date], (err, result) => {
        if (err) {
          console.error('Error adding problem:', err);
          response(500, {}, 'Internal Server Error', res);
          return;
        }
        response(200, result, 'Data Added Successfully', res);
    });
});

app.put('/edit-problem/:id', (req, res) => {
  const { id } = req.params; // Ambil ID masuk dari URL
  const { request, temporary, permanent, status, date } = req.body; // Ambil nilai yang akan diubah dari body permintaan

  // Lakukan pembaruan data berdasarkan ID yang diterima
  const sql = 'UPDATE problems SET request = ?, temporary = ?, permanent = ?, status = ?, date = ? WHERE id = ?';
  database.query(sql, [request, temporary, permanent, status, date, id], (err, result) => {
    if (err) {
      console.error('Error updating problem:', err);
      response(500, {}, 'Internal Server Error', res);
      return;
    }
    response(200, result, 'Data Updated Successfully', res);
  });
});

app.get('/tableSizes', (req, res) => {
  database.query('SELECT TABLE_SCHEMA AS `Database`, TABLE_NAME AS `Table`, ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024) AS `Size (MB)` FROM information_schema.TABLES WHERE TABLE_NAME IN ("problems", "users") ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC', (error, result) =>{
    // hasil data dari mysql
    response(200, result, 'Get Data Successfully', res )
  })
});


app.listen(port, () => {
  console.log(`Converged Infra Dev app listening on port ${port}`)
})
