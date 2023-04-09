const express = require('express');
const app = express();
const ejs = require('ejs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require("path");
const session = require('express-session');

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

const Userconnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'users'
  });

connection.connect((err) => {
    if (err) throw err;
    console.log('Product table Connected!');
});

Userconnection.connect((err) => {
    if (err) throw err;
    console.log('User table Connected!');
});

app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true
}));

//Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('index', (req, res) => {
    res.render('index');
});

app.get('/orderInput', (req, res) => {
    res.render('orderInput');
});

//Selecting the top 3 products that are low on quantity and provide current value of stock within the warehouse
app.get('/home', (req, res) => {
    connection.query('SELECT * FROM productstable ORDER BY Quantity ASC LIMIT 3 OFFSET 0', function(error, results, fields) {
        if (error) throw error;
        connection.query('SELECT SUM(Quantity * Price) AS total FROM productstable', function(error, price, fields) {
            if (error) throw error;
            res.render('home', { products: results, total: price[0].total });
        });
    });
});


app.get('/productList', (req, res) => {
    connection.query('SELECT * FROM productstable ORDER BY productName', function(error, results, fields) {
        if (error) throw error;
        res.render('productList', { products: results });
    });
});

app.get('/addProducts', (req, res) => {
    res.render('addProducts');
});

app.get('/deleteProducts', (req, res) => {
    res.render('deleteProducts');
});

app.get('/search', (req, res) => {
    res.render('search');
});

app.get('/searchResults', (req, res) => {
    res.render('searchResults');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/incomingModify', (req, res) => {
    res.render('incomingModify');
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

//Login form submission
//app.post('/loginform', (req, res) => {

//Modifying the quantity of a product by ID (Subtracting)
app.post('/outgoingModify', (req, res) => {
    const ID = req.body.ID;
    const Quantity = req.body.Quantity;
  
    // update the quantity column for the given ID
    const sql = `UPDATE productstable SET Quantity = Quantity - ${Quantity} WHERE ID = ${ID}`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log(`${result.affectedRows} row(s) updated`);
      res.redirect('/orderInput');
      console.log('Order updated');
    });
  });

  //Modifying the quantity of a product by ID (Adding)
app.post('/incomingModify', (req, res) => {
    const ID = req.body.ID;
    const Quantity = req.body.Quantity;
  
    // update the quantity column for the given ID
    const sql = `UPDATE productstable SET Quantity = Quantity + ${Quantity} WHERE ID = ${ID}`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log(`${result.affectedRows} row(s) updated`);
      res.redirect('/orderInput');
      console.log('Order updated');
    });
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
            res.redirect('/addProducts');
        }
    });
});

//Searching for a product by ID, contains parameterized query to prevent SQL injection
app.post('/search', (req, res) => {
    const searchTerm = req.body.searchTerm;
    const searchQuery = 'SELECT * FROM productstable WHERE ID = ?';
    connection.query(searchQuery, [searchTerm], (error, results, fields) => {
      if (error) throw error;
      console.log('Rendering searchResults.ejs file');
      res.render('searchResults', { results });

    });
  });


//Deleting a product by ID, contains parameterized query to prevent SQL injection
app.post('/delete-ID', function(req, res) {
    var id = req.body.searchTerm;
    connection.query('DELETE FROM productstable WHERE ID = ?', [id], function(error, results, fields) {
      if (error) throw error;
      res.redirect('/deleteProducts');
    });
  });

//Login form submission
app.post('/loginform', (req, res) => {
    const { username, password } = req.body;
    Userconnection.query('SELECT * FROM userpass WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/home');
        } else {
            res.send('Incorrect username or password.');
        }
    });
});

  


