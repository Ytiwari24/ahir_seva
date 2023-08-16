const express = require('express')
const jwt = require('jsonwebtoken');
const app = express.Router()

const db = require('./db');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'your_secret_key';
// API Endpoints

// User Login

app.post('/', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  
    db.query(query, [username, password], (err, result) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      
  
      if (result.length === 1) {
        res.json({ message: 'Login successful' });

        // const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        // res.json({ token });
      } else {
        res.status(401).json({ message: 'Login failed' });
      }
    });
  });




// app.post('/', (req, res) => {
//     const { username, password } = req.body;
  
//     if (!username || !password) {
//       return res.status(400).json({ message: 'Username and password are required.' });
//     }
  
//     db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
//       if (err) throw err;
  
//       if (results.length === 0) {
//         return res.status(401).json({ message: 'Invalid credentials.' });
//       }
  
//       const user = results[0];
//       bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
//         if (bcryptErr) throw bcryptErr;
  
//         if (!bcryptResult) {
//           return res.status(401).json({ message: 'Invalid credentials.' });
//         }
  
//         // Passwords match, user is authenticated
//         return res.status(200).json({ message: 'Login successful.' });
//       });
//     });
//   });

  module.exports = app