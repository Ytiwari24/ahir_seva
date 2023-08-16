// db.js

const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
<<<<<<< HEAD
  password: '',
  database: 'ahir_seva',
  // port:3308
=======
  password: 'password',
  database: 'sicurezza_user_app',
>>>>>>> 42ab776016f8bfac06d897a703bbc5ad988b5762
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = db;
