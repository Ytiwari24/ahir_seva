const express = require('express')
const app = express.Router()
const uuid = require('uuid')
const db = require('./db');

// Add a new route to handle POST requests for adding data
app.post('/add/visitor', (req, res) => {
    const { name, email } = req.body; // Assuming the request body contains 'na

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    const id = uuid.v4();
    const query = 'INSERT INTO expected_visitor (name, email) VALUES (?, ?)';
    db.query(query, [name, email], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // Return the newly inserted data
        const insertedData = { id: result.insertId, name, email };
        res.status(201).json(insertedData);
    });
});

///***********GET EXPECTED VISITORS**************///
app.get('/get/visitor', (req, res) => {
    const query = 'SELECT * FROM expected_visitor';
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