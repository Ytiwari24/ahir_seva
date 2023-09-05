const express = require('express')
const jwt = require('jsonwebtoken');
const app = express.Router();
const bcrypt = require('bcrypt');
// const { verifyToken } = require('./middle_ware');
const db = require('../db');
// const routes=require('./')

///********************TRY NEW LOGIN USERS AND GET DATA******************///

///************FOR CREATING NEW USERS**************///
app.post('/signup', async (req, res) => {
  const { firstname, lastname, mobile_no, dob, email, profession, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const query = `INSERT INTO users (firstname, lastname, mobile_no, dob, email, profession, password) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [firstname, lastname, mobile_no, dob, email, profession, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error signing up:', err);
        res.status(500).json({ error: 'Error signing up' });
      } else {
        res.status(201).json({ message: 'Signup successful' });
      }
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Error hashing password' });
  }
});

///**************GET ALL USERS*******************///
// Define a route to fetch data
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  // const familyData= 'SELECT * FROM family_member';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});


///***************LOGIN USERS********************///
// 5. Implement Login API

// 1. Implement Login API
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).json({ error: 'Error logging in' });
    } else {
      if (results.length === 1) {
        const user = results[0];


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          const token = jwt.sign({ userId: user.id }, 'your_secret_key'); // Replace with a secret key
          res.json({ token, user: { ...user, password: undefined }, });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});






module.exports = app