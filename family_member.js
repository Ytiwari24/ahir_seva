const express = require('express')
const jwt = require('jsonwebtoken');
const app = express.Router()
const multer = require('multer');
const db = require('./db');

const SECRET_KEY = 'your_secret_key';

const upload = multer({ dest: 'uploads/' });
// ***********GET FAMILY MEMBERS ********** //



// Get Family Members (requires authentication)
app.get('/members', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Authentication failed' });
            return;
        }
        const userId = decoded.userId;
        db.query(
            'SELECT * FROM family_member WHERE user_id = ?',
            [userId],
            (dbErr, results) => {
                if (dbErr) {
                    console.error('Error querying the database:', dbErr);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
                res.status(200).json(results);
            }
        );
    });
});

// Get all Parents members API
app.get('/parents', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Authentication failed' });
            return;
        }
        const userId = decoded.userId;
        db.query(
            'SELECT id, first_name, last_name FROM family_member WHERE user_id = ?',
            [userId],
            (dbErr, results) => {
                if (dbErr) {
                    console.error('Error querying the database:', dbErr);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
                res.status(200).json(results);
            }
        );
    });
});
app.get('/all', (req, res) => {

    // Retrieve all family members from the database
    const sql = 'SELECT * FROM family_member';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get family members for a specific user by user ID
// app.get('/members', (req, res) => {
//     const userId = req.params.userId;
//     const sql = 'SELECT * FROM family_member WHERE user_id = ?';

//     db.query(sql, [userId], (err, results) => {
//       if (err) {
//         console.error('Error fetching family members:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//         return;
//       }

//       res.json(results);
//     });
//   });
// app.get('/members/:userId', (req, res) => {
//     userID = req.params.id;
//     const query = 'SELECT * FROM family_member WHERE user_id= ?';
//     db.query(query, [userID],(err, results) => {
//         if (err) {
//             console.error('Error executing SQL query:', err);
//             res.status(500).json({ error: 'Internal server error' });
//             return;
//         }
//         res.json(results);
//     });
// });


///*******************ADD MEMBER WITH AUTHORIZATION********************************///
// Add Family Member
app.post('/add', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Authentication failed' });
            return;
        }

        const userId = decoded.userId;

        // Parse data from the request body
        const { parent_id, first_name, last_name, mobile_no, dob, gender, relation, profession, image } = req.body;

        // Validate input data (ensure name and relationship are provided)
        //   if (!name || !relationship) {
        // res.status(400).json({ message: 'Name and relationship are required' });
        // return;
        //   }

        // Insert the new family member into the database
        const query = 'INSERT INTO family_member (user_id,parent_id,first_name, last_name, mobile_no, dob, gender, relation, profession, image) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [userId, parent_id, first_name, last_name, mobile_no, dob, gender, relation, profession, image];
        db.query(query, values,
            (dbErr, results) => {
                if (dbErr) {
                    console.error('Error inserting family member:', dbErr);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }

                res.status(201).json({ message: 'Family member added successfully' });
            }
        );
    });
});

// // *************ADD FAMILY MEMBER**************** //
// app.post('/add', (req, res) => {
//     const { parent_id, first_name, last_name, mobile_no, dob, gender, relation, profession } = req.body;
//     // const imageData = req.file.buffer;

//     const query = 'INSERT INTO family_member (parent_id,first_name, last_name, mobile_no, dob, gender, relation, profession) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
//     const values = [parent_id, first_name, last_name, mobile_no, dob, gender, relation, profession];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error('Error adding family member:', err);
//             res.status(500).json({ error: 'Failed to add family member' });
//         } else {
//             console.log('Family member added:', result);
//             res.json({ message: 'Family member added successfully' });
//         }
//     });
// });

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

///***************UPDATE MEMBER WITH AUTHORIZATION //IMPLEMENTATION IS PENDING//**********************///
// Update Family Member
app.put('/family-members/:id', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Authentication failed' });
            return;
        }

        const userId = decoded.userId;
        const memberId = req.params.id; // Extract member ID from the URL parameter

        // Parse data from the request body
        const { name, relationship } = req.body;

        // Validate input data (ensure name and relationship are provided)
        if (!name || !relationship) {
            res.status(400).json({ message: 'Name and relationship are required' });
            return;
        }

        // Update the family member in the database
        db.query(
            'UPDATE family_members SET name = ?, relationship = ? WHERE id = ? AND user_id = ?',
            [name, relationship, memberId, userId],
            (dbErr, results) => {
                if (dbErr) {
                    console.error('Error updating family member:', dbErr);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }

                if (results.affectedRows === 0) {
                    res.status(404).json({ message: 'Family member not found' });
                    return;
                }

                res.status(200).json({ message: 'Family member updated successfully' });
            }
        );
    });
});




///********************DELETE MEMBER WITH AUTHORIZATION //IMPLEMENTATION IS PENDING//*********************************///
// Delete Family Member
app.delete('/family-members/:id', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Authentication failed' });
            return;
        }

        const userId = decoded.userId;
        const memberId = req.params.id; // Extract member ID from the URL parameter

        // Delete the family member from the database
        db.query(
            'DELETE FROM family_members WHERE id = ? AND user_id = ?',
            [memberId, userId],
            (dbErr, results) => {
                if (dbErr) {
                    console.error('Error deleting family member:', dbErr);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }

                if (results.affectedRows === 0) {
                    res.status(404).json({ message: 'Family member not found' });
                    return;
                }

                res.status(200).json({ message: 'Family member deleted successfully' });
            }
        );
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
