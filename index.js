const express = require('express');
const app = express();
const ejs = require('ejs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require("path");

const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
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

app.listen(port, () => {
  console.log('server running on port 3000');
});
