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


//Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('index', (req, res) => {
    res.render('index');
});


app.get('/home', (req, res) => {
    res.render('home');
});

app.listen(port, () => {
  console.log('server running on port 3000');
});

//Creating a pool
const createPool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'products'
});


//form submission to add products
app.post('/submit-form', (req, res) => {
    const { ID, productName, Description, Quantity, Location, Price } = req.body;

    createPool.query('INSERT INTO productstable (ID, productName, Description, Quantity, Location, Price) VALUES (?, ?, ?, ?, ?, ?)', [ID, productName, Description, Quantity, Location, Price || 1], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Product ID in use');
        } else {
            console.log(results);
            res.send('Product added successfully');
        }
    });
});


