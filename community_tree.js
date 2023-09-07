const express = require('express')
const app = express.Router()
const db = require('./db');

// const list = 
//     '['
//     '{"id":"A","next":[{"outcome":"B"},{"outcome":"Z"}]},'
//     '{"id":"B","next":[{"outcome":"C"},{"outcome":"D"},{"outcome":"E"}]},'
//     '{"id":"C","next":[{"outcome":"F"}]},'
//     '{"id":"D","next":[{"outcome":"J"}]},{"id":"E","next":[{"outcome":"J"}]},'
//     '{"id":"J","next":[{"outcome":"I"}]},'
//     '{"id":"I","next":[{"outcome":"H"}]},{"id":"F","next":[{"outcome":"K"}]},'
//     '{"id":"K","next":[{"outcome":"L"}]},'
//     '{"id":"H","next":[{"outcome":"L"}]},{"id":"L","next":[{"outcome":"P"}]},'
//     '{"id":"P","next":[{"outcome":"M"},{"outcome":"N"}]},'
//     '{"id":"M","next":[]},{"id":"N","next":[]},{"id":"Z","next":[]}'
//     ']';

// Provided JSON response (escaped string)
const jsonResponse = '[' +
    '{"id":"A","next":[{"outcome":"B"},{"outcome":"Z"}]},' +
    '{"id":"B","next":[{"outcome":"C"},{"outcome":"D"},{"outcome":"E"}]},' +
    '{"id":"Z","next":[{"outcome":"PR"},{"outcome":"AV"},{"outcome":"IND"}]},' +

    '{"id":"C","next":[{"outcome":"F"}]},' +
    '{"id":"D","next":[{"outcome":"J"}]},{"id":"E","next":[{"outcome":"J"}]},' +
    '{"id":"J","next":[{"outcome":"I"}]},' +
    '{"id":"I","next":[{"outcome":"H"}]},{"id":"F","next":[{"outcome":"K"}]},' +
    '{"id":"K","next":[{"outcome":"L"}]},' +
    '{"id":"H","next":[{"outcome":"L"}]},{"id":"L","next":[{"outcome":"P"}]},' +
    '{"id":"P","next":[{"outcome":"M"},{"outcome":"N"}]},' +
    '{"id":"M","next":[]},{"id":"N","next":[]},{"id":"PR","next":[]},{"id":"AV","next":[]},{"id":"IND","next":[]}' +
    ']';

// Parse the JSON string into a JavaScript object
const jsonData = JSON.parse(jsonResponse);

// Define a GET route
app.get('/tree', (req, res) => {
    res.json(jsonData);
});

// Add a family member API
app.post('/addFamilyMember', (req, res) => {
    const { name, relation } = req.body;
  
    // Insert the family member into the database
    const sql = 'INSERT INTO family_members (name, relation) VALUES (?, ?)';
    db.query(sql, [name, relation], (err, result) => {
      if (err) throw err;
      console.log('Family member added:', result);
      res.send('Family member added successfully.');
    });
  });
  
  // Get all family members API
  app.get('/getFamilyMembers', (req, res) => {
    // Retrieve all family members from the database
    const sql = 'SELECT * FROM family_members';
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });


///***************************************************************///

  // Get all family members API
  app.get('/get', (req, res) => {
    // Retrieve all family members from the database
    const sql = 'SELECT * FROM family_tree';
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  
   // Get all Parents members API
   app.get('/parents', (req, res) => {
    // Retrieve all family members from the database
    const sql = 'SELECT id, name FROM family_tree';
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
 // *************ADD FAMILY MEMBER**************** //
app.post('/add', (req, res) => {
  const {name,parent_id} = req.body;
  // const imageData = req.file.buffer;

  const query = 'INSERT INTO family_tree (name,parent_id) VALUES (?, ?)';
  const values = [name,parent_id];

  db.query(query, values, (err, result) => {
      if (err) {
          console.error('Error adding family member:', err);
          res.status(500).json({ error: 'Failed to add family member' });
      } else {
          console.log('Family member added:', result);
          res.json({ message: 'Family member added successfully' });
      }
  });
}); 

module.exports = app;