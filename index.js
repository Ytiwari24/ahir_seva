const express = require('express');
const mysql = require('mysql');
const cors=require('cors');
const app=express();


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:false}))
const port = 4000;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'sicurezza_user_app'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');
});

// Define a route to fetch data
app.get('/api/data', (req, res) => {
  const query = 'SELECT * FROM Persons';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Add a new route to handle POST requests for adding data
app.post('/api/add', (req, res) => {
    const { name, email } = req.body; // Assuming the request body contains 'name' and 'email' fields
  
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
  
    const query = 'INSERT INTO expected_visitor (name, email) VALUES (?, ?)';
    connection.query(query, [name, email], (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      // Return the newly inserted data
      const insertedData = { id: result.insertId, name, email };
      res.status(201).json(insertedData);
    });
  });
  
///***********GET EXPECTED VISITORS**************///
  app.get('/api/add', (req, res) => {
    const query = 'SELECT * FROM expected_visitor';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
    });
  });

// Start the server
app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
