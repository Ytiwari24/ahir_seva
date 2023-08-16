const express = require('express')
const jwt = require('jsonwebtoken');
const app = express.Router()
// const { verifyToken } = require('./middle_ware');
const db = require('./db');




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

module.exports = app
