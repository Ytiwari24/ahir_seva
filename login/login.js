const express = require('express')
const jwt = require('jsonwebtoken');
const app = express.Router();
const bcrypt = require('bcrypt');
// const { verifyToken } = require('./middle_ware');
const db = require('../db');
// const routes=require('./')
const SECRET_KEY = 'your_secret_key';
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

// User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
      if (bcryptErr || !bcryptResult) {
        res.status(401).json({ message: 'Authentication failed' });
        return;
      }

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: '1h',
      });

      res.status(200).json({ token });
    });
  });
});

///*********************FAMILY MEMBER*************************///

// // Get Family Members (requires authentication)
// app.get('/family-members', (req, res) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     res.status(401).json({ message: 'Authentication required' });
//     return;
//   }

//   jwt.verify(token, SECRET_KEY, (err, decoded) => {
//     if (err) {
//       res.status(401).json({ message: 'Authentication failed' });
//       return;
//     }

//     const userId = decoded.userId;

//     db.query(
//       'SELECT * FROM family_member WHERE user_id = ?',
//       [userId],
//       (dbErr, results) => {
//         if (dbErr) {
//           console.error('Error querying the database:', dbErr);
//           res.status(500).json({ message: 'Internal server error' });
//           return;
//         }

//         res.status(200).json(results);
//       }
//     );
//   });
// });

// ///*******************ADD MEMBER API********************************///
// // Add Family Member
// app.post('/family-members', (req, res) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     res.status(401).json({ message: 'Authentication required' });
//     return;
//   }

//   jwt.verify(token, SECRET_KEY, (err, decoded) => {
//     if (err) {
//       res.status(401).json({ message: 'Authentication failed' });
//       return;
//     }

//     const userId = decoded.userId;

//     // Parse data from the request body
//     const { name, relationship } = req.body;

//     // Validate input data (ensure name and relationship are provided)
//     if (!name || !relationship) {
//       res.status(400).json({ message: 'Name and relationship are required' });
//       return;
//     }

//     // Insert the new family member into the database
//     db.query(
//       'INSERT INTO family_member (user_id, first_name, last_name) VALUES (?, ?, ?)',
//       [userId, name, relationship],
//       (dbErr, results) => {
//         if (dbErr) {
//           console.error('Error inserting family member:', dbErr);
//           res.status(500).json({ message: 'Internal server error' });
//           return;
//         }

//         res.status(201).json({ message: 'Family member added successfully' });
//       }
//     );
//   });
// });


///***********************************************************///
// 1. Implement Login API
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   const query = `SELECT * FROM users WHERE email = ?`;
//   db.query(query, [email], async (err, results) => {
//     if (err) {
//       console.error('Error logging in:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       if (results.length === 1) {
//         const user = results[0];


//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (isPasswordValid) {
//           const token = jwt.sign({ userId: user.id }, 'your_secret_key'); // Replace with a secret key
//           res.json({ token, user: { ...user, password: undefined }, });
//         } else {
//           res.status(401).json({ error: 'Invalid credentials' });
//         }
//       } else {
//         res.status(401).json({ error: 'Invalid credentials' });
//       }
//     }
//   });
// });






module.exports = app