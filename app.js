const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// MySQL Connection Setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ahir_seva'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to the database');
});

// API Routes

// User Registration
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// User Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }

    const token = jwt.sign({ username: user.username }, 'your_secret_key');
    res.json({ token });
  });
});

// Protected Route
app.get('/profile', (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    res.json({ message: 'Access granted to protected route', user: decoded.username });
  } catch (error) {
    res.status(401).json({ error: 'Access denied' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
