const express = require('express')
const jwt = require('jsonwebtoken');
const app = express.Router()
// const { verifyToken } = require('./middle_ware');
const db = require('./db');


// Define a route to fetch data
app.get('/get', (req, res) => {
    const query = 'SELECT * FROM upcoming_events';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});


app.post('/add', (req, res) => {
    const { event_name, description, date, time, location } = req.body;

    const insertQuery = `
      INSERT INTO upcoming_events (event_name, description, date, time, location)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        insertQuery,
        [event_name, description, date, time, location],
        (error, results) => {
            if (error) {
                console.error('Error adding event:', error.message);
                res.status(500).json({ error: 'Failed to add event' });
            } else {
                console.log('Event added successfully:', results);
                res.status(200).json({ message: 'Event added successfully' });
            }
        }
    );
});


app.delete('/delete/:eventId', (req, res) => {
    const eventId = req.params.eventId;
  
    const deleteQuery = 'DELETE FROM upcoming_events WHERE id = ?';
  
    db.query(deleteQuery, [eventId], (error, results) => {
      if (error) {
        console.error('Error deleting event:', error.message);
        res.status(500).json({ error: 'Failed to delete event' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Event not found' });
        } else {
          console.log('Event deleted successfully');
          res.status(200).json({ message: 'Event deleted successfully' });
        }
      }
    });
  });

module.exports = app
