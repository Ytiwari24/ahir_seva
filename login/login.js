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
          res.json({ token, user: { ...user, password: undefined } });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   const query = `SELECT * FROM users WHERE email = ?`;
//   db.query(query, [email], async (err, results) => {
//     if (err) {
//       console.error('Error logging in:', err);
//       res.status(500).json({ error: 'Error logging in' });
//     } else {
//       if (results.length === 1) {
//         const user = results[0];

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (isPasswordValid) {
//           // Create and send a JWT token
//           const token = jwt.sign({ userId: user.id }, 'your_secret_key'); // Replace with a secret key
          
//           // Send user information and token in the response
//           res.json({ user, token });
//         } else {
//           res.status(401).json({ error: 'Invalid credentials' });
//         }
//       } else {
//         res.status(401).json({ error: 'Invalid credentials' });
//       }
//     }
//   });
// });



// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   const query = `SELECT * FROM users WHERE email = ?`;
//   db.query(query, [email], async (err, results) => {
//     if (err) {
//       console.error('Error logging in:', err);
//       res.status(500).json({ error: 'Error logging in' });
//     } else {
//       if (results.length === 1) {
//         const user = results[0];

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (isPasswordValid) {
//           // Create and send a JWT token
//           const token = jwt.sign({ userId: user.id }, 'your_secret_key'); // Replace with a secret key
//           res.json({ token });
//         } else {
//           res.status(401).json({ error: 'Invalid credentials' });
//         }
//       } else {
//         res.status(401).json({ error: 'Invalid credentials' });
//       }
//     }
//   });
// });


// app.post('/api/register', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     //  db =  pool.getConnection();
//     const [result] =  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
//     db.release();

//     res.json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Database error' });
//   }
// });







// ...

// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
//     connection.release();

//     if (rows.length === 0) {
//       return res.status(401).json({ error: 'Authentication failed' });
//     }

//     const user = rows[0];
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ error: 'Authentication failed' });
//     }

//     const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ error: 'Database error' });
//   }
// });


// function authenticateToken(req, res, next) {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(401).json({ error: 'Authentication token missing' });
//   }

//   jwt.verify(token, 'your-secret-key', (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid token' });
//     }
//     req.userId = decoded.userId;
//     next();
//   });
// }

// app.get('/api/data', authenticateToken, async (req, res) => {
//   const userId = req.userId;

//   try {
//     const connection = await pool.getConnection();
//     const [userData] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
//     const [familyMembers] = await connection.query('SELECT * FROM family_member WHERE user_id = ?', [userId]);
//     connection.release();

//     res.json({ userData, familyMembers });
//   } catch (error) {
//     res.status(500).json({ error: 'Database error' });
//   }
// });


///*****************************END TRY************************************///


// Login Route
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;

//     // Fetch user from the database and compare passwords
//     db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
//       if (err) {
//         res.status(500).json({ error: 'Database error' });
//       } else if (results.length === 0 || results[0].password !== password) {
//         res.status(401).json({ error: 'Invalid credentials' });
//       } else {
//         const user = results[0];

//         // Create JWT token
//         const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });

//         res.json({ token });
//       }
//     });
//   });

// const secretKey = 'your_secret_key';

// Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ message: 'Access denied' });

//     try {
//         const decoded = jwt.verify(token, secretKey);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(400).json({ message: 'Invalid token' });
//     }
// };

// app.post('/login', (req, res) => {
//     const { username, password } = req.body;

//     // Validate username and password (you should hash passwords before storing)
//     // Retrieve user data from the database
//     const user = 'SELECT * FROM users'; // Replace with your database logic

//     if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//     }

//     // Example: Verify password (You should use bcrypt for password hashing)
//     if (password !== 'password') {
//         return res.status(401).json({ message: 'Invalid password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
//     res.json({ token });
// });

// app.get('/protected', verifyToken, (req, res) => {
//     res.json({ message: 'Protected route accessed' });
// });



// Define a route to fetch data
// app.get('/users', (req, res) => {
//     const query = 'SELECT * FROM users';
//     // const familyData= 'SELECT * FROM family_member';
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error executing SQL query:', err);
//             res.status(500).json({ error: 'Internal server error' });
//             return;
//         }
//         res.json(results);
//     });
// });


// Routes
// app.post('/', (req, res) => {
//     const { username, password } = req.body;

//     db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
//         if (err) throw err;

//         if (results.length === 0) {
//             res.status(401).json({ message: 'Authentication failed' });
//         } else {
//             const user = results[0];
//             bcrypt.compare(password, user.password, (bcryptErr, bcryptRes) => {
//                 if (bcryptErr) throw bcryptErr;

//                 if (bcryptRes) {
//                     const token = jwt.sign({ id: user.id, username: user.username }, 'secret_key', { expiresIn: '1h' });
//                     res.json({ token });
//                 } else {
//                     res.status(401).json({ message: 'Authentication failed' });
//                 }
//             });
//         }
//     });
// });


module.exports = app