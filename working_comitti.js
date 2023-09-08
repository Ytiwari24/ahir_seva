const express = require('express')
const jwt = require('jsonwebtoken');
const app = express.Router()
// const { verifyToken } = require('./middle_ware');
const db = require('./db');




// Define a route to fetch data
app.get('/members', (req, res) => {
    const query = 'SELECT * FROM working_comitti';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});



// Define the POST route for adding a working committee
app.post('/add', (req, res) => {
    const { name, designation } = req.body;
  
    // if (!name || !designation) {
    //   return res.status(400).json({ message: 'Name and designation are required fields' });
    // }
  
    // Insert the data into the database
    const query = 'INSERT INTO working_comitti (name, designation) VALUES (?, ?)';
    db.query(query, [name, designation], (err, results) => {
      if (err) {
        console.error('Database error: ' + err.message);
        return res.status(500).json({ message: 'Database error' });
      }
  
      res.status(201).json({ message: 'Working committee added successfully' });
    });
  });

module.exports = app
