// const express = require('express');
// const mysql = require('mysql');
// const cors=require('cors');
// const app=express();


// app.use(cors());
// app.use(express.json())
// app.use(express.urlencoded({extended:false}))
// const port = 5000;




// app.use('/login',require('./login/login'))


// // // Create a MySQL connection
// // const connection = mysql.createConnection({
// //   host: 'localhost',
// //   user: 'root',
// //   password: '',
// //   database: 'ahir_seva'
// // });

// // connection.connect(err => {
// //   if (err) {
// //     console.error('Error connecting to MySQL:', err);
// //     return;
// //   }
// //   console.log('Connected to MySQL server');
// // });


// // Add a new route to handle POST requests for adding data
// // app.post('/api/add', (req, res) => {
// //     const { name, email } = req.body; // Assuming the request body contains 'name' and 'email' fields
  
// //     if (!name || !email) {
// //       return res.status(400).json({ error: 'Name and email are required' });
// //     }
  
// //     const query = 'INSERT INTO expected_visitor (name, email) VALUES (?, ?)';
// //     connection.query(query, [name, email], (err, result) => {
// //       if (err) {
// //         console.error('Error executing SQL query:', err);
// //         res.status(500).json({ error: 'Internal server error' });
// //         return;
// //       }
  
// //       // Return the newly inserted data
// //       const insertedData = { id: result.insertId, name, email };
// //       res.status(201).json(insertedData);
// //     });
// //   });
  
// // ///***********GET EXPECTED VISITORS**************///
// //   app.get('/api/add', (req, res) => {
// //     const query = 'SELECT * FROM expected_visitor';
// //     connection.query(query, (err, results) => {
// //       if (err) {
// //         console.error('Error executing SQL query:', err);
// //         res.status(500).json({ error: 'Internal server error' });
// //         return;
// //       }
// //       res.json(results);
// //     });
// //   });

// // Start the server
// app.listen(port,'0.0.0.0', () => {
//   console.log(`Server is running on port ${port}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cors=require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// // MySQL Connection Setup
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'ahir_seva'
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log('Connected to the database');
// });

// API Routes
app.use('/',require('./login/login'))
app.use('/comitti',require('./working_comitti'))
app.use('/events',require('./events'))
app.use('/family',require('./family_member'))
app.use('/community/',require('./community_tree'))
app.use('/',require('./birthday_anniversary'))
// User Registration
// app.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
//     db.query(query, [username, hashedPassword], (err, result) => {
//       if (err) throw err;
//       res.status(201).json({ message: 'User registered successfully' });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

// User Login
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   const query = 'SELECT * FROM users WHERE username = ?';
//   db.query(query, [username], async (err, results) => {
//     if (err) throw err;

//     if (results.length === 0) {
//       res.status(401).json({ error: 'Authentication failed' });
//       return;
//     }

//     const user = results[0];
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       res.status(401).json({ error: 'Authentication failed' });
//       return;
//     }

//     const token = jwt.sign({ username: user.username }, 'your_secret_key');
//     res.json({ token });
//   });
// });

// Protected Route
// app.get('/profile', (req, res) => {
//   const token = req.header('Authorization').replace('Bearer ', '');

//   try {
//     const decoded = jwt.verify(token, 'your_secret_key');
//     res.json({ message: 'Access granted to protected route', user: decoded.username });
//   } catch (error) {
//     res.status(401).json({ error: 'Access denied' });
//   }
// });

// console.log('Current Date:', today);
// console.log('SQL Query:', sql);
// console.log('Results:', results);


app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

