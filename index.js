const express = require('express');
const app = express();
const ejs = require('ejs');
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'products'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
  console.log('server running on port 3000');
});
