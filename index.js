const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
// const db = require('./db');
const app = express();


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());
const port = 4000;

///*********ROUTING API PAGES*************///
app.use('/', require('./expected_visitor'))
app.use('/frequent/visitor/',require('./frequent_visitor'))
app.use('/member/',require('./family_member'))
app.use('/login',require('./login'))
app.use('/users/',require('./users'))


// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
