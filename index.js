const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const db = require('./db');

const app = express();
// const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());


const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, callback) => {
    callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});


// app.use('/profilePicture',express.static('uploads/'))
const upload = multer({ storage: storage });





///************IMAGE CODE FOR ADD AND GET*****************///
app.use('/', express.static('uploads/'))
app.post('/upload', upload.single('profile'), (req, res) => {
  console.log(req.file);
  res.json({
    success: 1,
    profile_url: `http://192.168.1.119:3000/${req.file.filename}`
  })
})


app.get('/get/images', upload.single('profile'), (req, res) => {
  const sql = 'SELECT name, image_path FROM profile_pictures';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching API URLs:', err);
      res.status(500).json({ message: 'Failed to fetch API URLs' });
    } else {
      const data = results.map((result) => {
        return {
          name: result.name,
          profile_image: `http://192.168.1.119:3000/${req.file.filename}`,
        };
      });
      res.json(data);
    }
  });
});
// app.post('/add/image', upload.single('image_path'), (req, res) => {
//   const { name , image_path } = req.body;

//   // const image_path = req.file ? req.file.path : null;

//   const sql = 'INSERT INTO profile_pictures (name, image_path) VALUES (?, ?)';
//   db.query(sql, [name, image_path], (err, result) => {
//     if (err) {
//       console.error('Error adding API URL:', err);
//       res.status(500).json({ message: 'Failed to add API URL' });
//     } else {
//       console.log(req.file);
//       res.json({ message: 'API URL added successfully' });
//     }
//   });
// });
///*******************************************************///


// API Routes
app.use('/', require('./login/login'))
app.use('/comitti', require('./working_comitti'))
app.use('/events', require('./events'))
app.use('/family', require('./family_member'))
app.use('/community/', require('./community_tree'))
app.use('/', require('./birthday_anniversary'))
app.use('/', require('./test_image'))
app.use('/', express.static('./uploads'))
app.use('/profilePicture', express.static('uploads/'))



app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

