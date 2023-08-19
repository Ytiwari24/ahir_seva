const express = require('express')
const jwt = require('jsonwebtoken');
const app = express.Router()
const multer = require('multer');
// const { verifyToken } = require('./middle_ware');
const db = require('./db');



const upload = multer({ dest: 'uploads/' });
// ***********GET FAMILY MEMBERS ********** //
app.get('/members', (req, res) => {
    const query = 'SELECT * FROM family_member';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

// *************ADD FAMILY MEMBER**************** //
app.post('/add',upload.single('image'), (req, res) => {
    const { first_name, last_name, mobile_no, dob, gender, relation, profession} = req.body;
    const imageData = req.file.buffer;

    const query = 'INSERT INTO family_member (first_name, last_name, mobile_no, dob, gender, relation, profession, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [first_name, last_name, mobile_no, dob, gender, relation, profession,imageData];

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

// Update a family member
app.put('/update/:id', (req, res) => {
    const memberId = req.params.id;
    const updatedData = req.body;

    const sql = 'UPDATE family_member SET ? WHERE id = ?';
    db.query(sql, [updatedData, memberId], (err, result) => {
        if (err) {
            console.error('Error updating family member:', err);
            res.status(500).json({ error: 'Error updating family member' });
        } else {
            res.json({ message: 'Family member updated successfully' });
        }
    });
});

///**************DELETE*****************///
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const deleteQuery = `DELETE FROM family_member WHERE id = ?`;

    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error deleting data from database' });
        } else {
            res.status(200).json({ message: 'Data deleted successfully' });
        }
    });
});

module.exports = app
