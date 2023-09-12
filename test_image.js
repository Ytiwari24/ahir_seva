const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post('/upload-profile-picture', upload.single('profilePicture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const { name } = req.body;
  const image_path = req.file ? `http://192.168.1.119:3000/${req.file.path}`:null;

  const sql = 'INSERT INTO profile_pictures (name, image_path) VALUES (?, ?)';
  db.query(sql, [name, image_path], (err, result) => {
    if (err) {
      console.error('Error uploading profile picture:', err);
      res.status(500).json({ message: 'Failed to upload profile picture' });
    } else {
      res.json({ message: 'Profile picture uploaded successfully' });
    }
  });
});





















///********************ADD NEW FORMAT*********************///
app.post('/api/add-api-url', upload.single('profileImage'), (req, res) => {
    const { name } = req.body;
  
    const image_path = req.file ? req.file.path : null;
  
    const sql = 'INSERT INTO profile_pictures (name, image_path) VALUES (?, ?)';
    db.query(sql, [name, image_path], (err, result) => {
      if (err) {
        console.error('Error adding API URL:', err);
        res.status(500).json({ message: 'Failed to add API URL' });
      } else {
        res.json({ message: 'API URL added successfully' });
      }
    });
  });


  app.get('/api/get-api-urls', (req, res) => {
    const sql = 'SELECT name, image_path FROM profile_pictures';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching API URLs:', err);
        res.status(500).json({ message: 'Failed to fetch API URLs' });
      } else {
        const data = results.map((result) => {
          return {
            name: result.name,
            profile_image: result.image_path ? `http://192.168.1.119:3600/${result.image_path}` : null,
          };
        });
        res.json(data);
      }
    });
  });
  
  

///*****************GET API*********************///
// app.get('/api/get', (req, res) => {
//     const sql = 'SELECT name, image_path FROM profile_pictures';
//     db.query(sql, (err, results) => {
//       if (err) {
//         console.error('Error fetching API URLs:', err);
//         res.status(500).json({ message: 'Failed to fetch API URLs' });
//       } else {
//         const data = results.map((result) => {
//           return {
//             name: result.name,
        
        
//             profile_image: result.profile_image ? `http://192.168.1.119:3000/${result.profile_image}` : null,
//           };
//         });
//         res.json(data);
//       }
//     });
//   });
  



///*************************************///

///***********************ADD NEW CODE **********************////
// app.post('/api/add-api-url', upload.single('profileImage'), (req, res) => {
//     const { name, mail, url } = req.body;
  
//     const profileImageUrl = req.file ? `http://your-node-js-api-url/${req.file.path}` : null;
  
//     const sql = 'INSERT INTO api_urls (name, mail, url, profile_image) VALUES (?, ?, ?, ?)';
//     db.query(sql, [name, mail, url, profileImageUrl], (err, result) => {
//       if (err) {
//         console.error('Error adding API URL:', err);
//         res.status(500).json({ message: 'Failed to add API URL' });
//       } else {
//         res.json({ message: 'API URL added successfully' });
//       }
//     });
//   });
  
///************************* END *********************///


// GET request to retrieve all image URLs
app.get('/get-images', (req, res) => {
    const sql = 'SELECT * FROM profile_pictures';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching image URLs:', err);
        res.status(500).json({ message: 'Failed to fetch image URLs' });
      } else {
        const imageUrls = results.map((result) => result.image_path);
        res.json(imageUrls);
      }
    });
  });


// app.get('/profiles', (req, res) => {
//     const query = 'SELECT * FROM profile_pictures';
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error executing SQL query:', err);
//             res.status(500).json({ error: 'Internal server error' });
//             return;
//         }
//         res.json(results);
//     });
// });


// const PORT = process.env.PORT || 3600;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
module.exports = app