const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cors=require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());


// API Routes
app.use('/',require('./login/login'))
app.use('/comitti',require('./working_comitti'))
app.use('/events',require('./events'))
app.use('/family',require('./family_member'))
app.use('/community/',require('./community_tree'))
app.use('/',require('./birthday_anniversary'))



app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

