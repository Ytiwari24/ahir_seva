const express = require('express')
const jwt = require('jsonwebtoken');
const app = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');
// const { verifyToken } = require('./middle_ware');
const db = require('./db');

app.use(bodyParser.json());
// const upload = multer({ storage: storage });


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

// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: (req, file, callback) => {
//     callback(null, Date.now() + '-' + file.originalname);
//   },
// });

// Multer configuration
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// Create an API endpoint to add committee members with profile pictures.
app.post('/add-member', upload.single('profilePicture'), (req, res) => {
  const { name, position } = req.body;
  const profilePicture = req.file.filename;

  const sql = 'INSERT INTO working_comitti (name, designation, profile_picture) VALUES (?, ?, ?)';
  db.query(sql, [name, position, profilePicture], (err, result) => {
    if (err) {
      console.error('Error adding member:', err);
      res.status(500).json({ error: 'Failed to add member' });
    } else {
      res.json({ message: 'Member added successfully' });
    }
  });
});



// Define the POST route for adding a working committee
app.post('/add',upload.single('profilePicture'), (req, res) => {
    const { name, designation } = req.body;
    const profilePicture = req.file.filename;
  
    // if (!name || !designation) {
    //   return res.status(400).json({ message: 'Name and designation are required fields' });
    // }
  
    // Insert the data into the database
    const query = 'INSERT INTO working_comitti (name, designation, profile_picture) VALUES (?, ?, ?)';
    db.query(query, [name, designation, profilePicture], (err, results) => {
      if (err) {
        console.error('Database error: ' + err.message);
        return res.status(500).json({ message: 'Database error' });
      }
  
      res.status(201).json({ message: 'Working committee added successfully' });
    });
  });

module.exports = app
