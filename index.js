const express = require('express');
const app = express();

const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'products'
});

app.listen(3001, () => {
  console.log('server running on port 3001');
});