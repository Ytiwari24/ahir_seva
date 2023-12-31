const express = require('express')
const app = express.Router()
const uuid = require('uuid')
const db = require('./db');

// Add a new route to handle POST requests for adding data
app.post('/add', (req, res) => {
    const { name, mobile_no, place, date, time, type } = req.body; // Assuming the request body contains  'email' fields

    if (!name || !mobile_no) {
        return res.status(400).json({ error: 'Name and Number are required' });
    }
    const id = uuid.v4();
    const query = 'INSERT INTO frequent_visitor (name,mobile_no,place,date,time,type) VALUES (?, ?,?,?,?,?)';
    db.query(query, [name, mobile_no, place, date, time, type], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // Return the newly inserted data
        const insertedData = { id: result.insertId, name, mobile_no, place, date, time, type };
        res.status(201).json(insertedData);
    });
});

///***********GET EXPECTED VISITORS**************///
app.get('/get', (req, res) => {
    const query = 'SELECT * FROM frequent_visitor';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

///**************DELETE*****************///
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const deleteQuery = `DELETE FROM expected_visitor WHERE id = ?`;

    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error deleting data from database' });
        } else {
            res.status(200).json({ message: 'Data deleted successfully' });
        }
    });
});

module.exports = app