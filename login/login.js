const express = require('express')
const jwt = require('jsonwebtoken');
const app = express.Router()
// const { verifyToken } = require('./middle_ware');
const db = require('../db');
// const routes=require('./')


// // Login Route
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

const secretKey = 'your_secret_key';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate username and password (you should hash passwords before storing)
    // Retrieve user data from the database
    const user = 'SELECT * FROM users'; // Replace with your database logic

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Example: Verify password (You should use bcrypt for password hashing)
    if (password !== 'password') {
        return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected route accessed' });
});



// Define a route to fetch data
app.get('/get/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});


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