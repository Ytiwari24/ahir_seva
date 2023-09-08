const express = require('express')
const jwt = require('jsonwebtoken');
const app = express.Router()
// const { verifyToken } = require('./middle_ware');
const db = require('./db');




// // Define a route to fetch data
// app.get('/birthdays', (req, res) => {
//     const query = 'SELECT * FROM family_member ORDER BY dob ASC';
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error executing SQL query:', err);
//             res.status(500).json({ error: 'Internal server error' });
//             return;
//         }
//         res.json(results);
//     });
// });

// Define an API endpoint to retrieve upcoming events
app.get('/birthdays', (req, res) => {
    const today = new Date();
    const sql = 'SELECT * FROM family_member WHERE dob >= ? ORDER BY dob';

    db.query(sql, [today], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No upcoming events found' });
        }
        res.json(results);
    });

    // Define an API endpoint to retrieve upcoming events

});

app.get('/upcoming/ann', (req, res) => {
    const today = new Date();

    // Modify the SQL query to handle events that have already passed
    const sql = `
  SELECT *,
         CASE
           WHEN dob < ? THEN DATE_ADD(dob, INTERVAL 1 YEAR)
           ELSE dob
         END AS adjusted_event_date
  FROM family_member
  WHERE adjusted_event_date >= ?
  ORDER BY adjusted_event_date
`;

    db.query(sql, [today, today], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});


// Define an API endpoint to retrieve upcoming events
app.get('/upcoming-events', (req, res) => {
    const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
  
    const sql = 'SELECT * FROM family_member WHERE dob >= ? ORDER BY dob';
  
    db.query(sql, [today], (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results);
    });
  });
// Define the POST route for adding a working committee
// app.post('/add', (req, res) => {
//     const { name, designation } = req.body;

//     // if (!name || !designation) {
//     //   return res.status(400).json({ message: 'Name and designation are required fields' });
//     // }

//     // Insert the data into the database
//     const query = 'INSERT INTO working_comitti (name, designation) VALUES (?, ?)';
//     db.query(query, [name, designation], (err, results) => {
//       if (err) {
//         console.error('Database error: ' + err.message);
//         return res.status(500).json({ message: 'Database error' });
//       }

//       res.status(201).json({ message: 'Working committee added successfully' });
//     });
//   });

   // Define an API endpoint to retrieve upcoming events
//    app.get('/anniversary', (req, res) => {
//     const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

//     const sql = 'SELECT * FROM family_member WHERE dob >= ? ORDER BY dob';

//     db.query(sql, [today], (err, results) => {
//         if (err) {
//             console.error('Error querying the database:', err);
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }
//         res.json(results);
//     });
// });

module.exports = app
