const express = require('express');
const page = express();
const ejs = require('ejs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require("path");
const session = require('express-session');
//Exporting the page variable so it can be used for testing
module.exports = page;

//Navigate to localhost:3000 so you can view the start up page of my inventory management system 
const port = 3000;

page.set('views', path.join(__dirname, 'views'));
page.set('view engine', 'ejs');
page.use(express.static(path.join(__dirname, 'public')))
page.use(bodyParser.urlencoded({ extended: true }));
page.use(bodyParser.json());

const Productsconnection = mysql.createConnection({
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

  Productsconnection.connect((err) => {
    if (err) throw err;
    console.log('Product table Connected!');
});

Userconnection.connect((err) => {
    if (err) throw err;
    console.log('User table Connected!');
});

page.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true
}));

//Routes I created which allow the user to navigate to all the pages I made, Also makes sure the user is logged in before they can access the page 
page.get('/', (req, res) => {
    res.render('index');
});

page.get('/register', (req, res) => {
    if (req.session.loggedin) {
    res.render('register', {req: req});
    }
    else{
        res.render("/login")
    }
});

page.get('index', (req, res) => {
    res.render('index');
});

page.get('/orderInput', (req, res) => {
    if (req.session.loggedin) {
    res.render('orderInput', {req: req});
    }
    else{
        res.render("/login")
    }
});

//Selecting the top 3 products that are low on quantity and provide current value of stock within the warehouse
page.get('/home', (req, res) => {
    if (req.session.loggedin) {
        Productsconnection.query('SELECT * FROM productstable ORDER BY Quantity ASC LIMIT 3 OFFSET 0', function(error, results, fields) {
        if (error) throw error;
        Productsconnection.query('SELECT SUM(Quantity * Price) AS total FROM productstable', function(error, price, fields) {
            if (error) throw error;
            res.render('home', { products: results, total: price[0].total, req: req });
        });
    });
}
    else{res.render("login")}
});


page.get('/productList', (req, res) => {
    if (req.session.loggedin) {
        Productsconnection.query('SELECT * FROM productstable ORDER BY productName', function(error, results, fields) {
        if (error) throw error;
        res.render('productList', { products: results, req: req });
    });
}
    else{
        res.render("login")
    }
});

page.get('/addProducts', (req, res) => {
    if (req.session.loggedin) {
    res.render('addProducts', {req: req});
    }
    else{
        res.redirect("login")
    }
});

page.get('/deleteProducts', (req, res) => {
    if (req.session.loggedin) {
        res.render('deleteProducts', {req: req});
        }
        else{
            res.render("login")
        }
});

page.get('/search', (req, res) => {
    if (req.session.loggedin) {
        res.render('search', {req: req});
        }
        else{
            res.render("login")
        }
});

page.get('/searchResults', (req, res) => {
    if (req.session.loggedin) {
    res.render('searchResults', {req: req});
    }
    else{
        res.render("login")
    }
});

page.get('/login', (req, res) => {
    res.render('login', {req: req});
});

page.get('/incomingModify', (req, res) => {
    if (req.session.loggedin) {
    res.render('incomingModify', {req: req});
    }
    else{
        res.render("login")
    }
});

page.get('/signOut', (req, res) => {
    req.session.loggedin = false;
    req.session.admin= false;
    res.render('login');
});

//Makes sure the website is being hosted locally on port 3000
page.listen(port, () => {
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
//All of my post methods are used from here on out, they are used to add, delete, modify, and search for products within the database and any other interaction that are needed
//Modifying the quantity of a product by ID (Subtracting)
page.post('/outgoingModify', (req, res) => {
    const ID = req.body.ID;
    const Quantity = req.body.Quantity;
    const username = usernamesave;
    const sql = `UPDATE productstable SET Quantity = Quantity - ?, username = ?, dateadded = CURRENT_TIMESTAMP WHERE ID = ?`;
    const values = [Quantity, username, ID];
    Productsconnection.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log(`${result.affectedRows} row(s) updated`);
      res.redirect('/orderInput');
      console.log('Order updated');
    });
  });

  //Modifying the quantity of a product by ID (Adding)
page.post('/incomingModify', (req, res) => {
    const ID = req.body.ID;
    const Quantity = req.body.Quantity;
    const username = usernamesave;
    const sql = `UPDATE productstable SET Quantity = Quantity + ?, username = ?, dateadded = CURRENT_TIMESTAMP WHERE ID = ?`;
    const values = [Quantity, username, ID];
    Productsconnection.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log(`${result.affectedRows} row(s) updated`);
      res.redirect('/incomingModify');
      console.log('Order updated');
    });
  });
  

//Adds products to the database using the form I created in addProducts.ejs
page.post('/submit-form', (req, res) => {
    const {productName, Description, Quantity, Location, Price } = req.body;
    const username = usernamesave;
    createPool.query('INSERT INTO productstable (productName, Description, Quantity, Location, Price, username) VALUES (?, ?, ?, ?, ?, ?)', [productName, Description, Quantity, Location, Price || 1, username], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error inserting Product');
        } else {
            console.log(results);
            res.redirect('/addProducts');
        }
    });
});

//Deletes the product from my database by using the ID entered on the form in deleteProducts.ejs, only accessible by admin
page.post('/delete-ID', function(req, res) {
    const id = req.body.searchTerm;
    Productsconnection.query('DELETE FROM productstable WHERE ID = ?', [id], function(error, results, fields) {
      if (error) {
        console.error(err)
        res.status(500).send('Error deleting Product');
      }
      res.redirect('/deleteProducts');
    });
  });

//Registers a new user to the database using the form I created in registerform.ejs
page.post('/registerform', (req, res) => {
    const { username, password } = req.body;
    Userconnection.query('INSERT INTO userpass (username, password) VALUES (?, ?)', [username, password], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Username is in use');
        } else {
            console.log(results);
            res.redirect('/home');
        }
    });
});

//Searches for a product by ID from the form in search.ejs
page.post('/search', (req, res) => {
    const searchTerm = req.body.searchTerm;
    const searchQuery = 'SELECT * FROM productstable WHERE ID = ?';
    Productsconnection.query(searchQuery, [searchTerm], (error, results, fields) => {
      if (error) throw error;
      console.log('Rendering searchResults.ejs file');
      res.render('searchResults', { results, req });

    });
  });


//Searches for a product by name from the form in search.ejs
page.post('/searchName', (req, res) => {
    const searchTerm = req.body.searchTerm;
    const searchQuery = 'SELECT * FROM productstable WHERE productName = ?';
    Productsconnection.query(searchQuery, [searchTerm], (error, results, fields) => {
      if (error) throw error;
      console.log('Rendering searchResults.ejs file');
      res.render('searchResults', { results, req });
    });
  });


//Variable used to save the username of the user that is logged in
var usernamesave;
//Searches the users table I created to see if the username and password entered match any in the database
page.post('/loginform', (req, res) => {
    const { username, password } = req.body;
    usernamesave = username;
    Userconnection.query('SELECT * FROM userpass WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
            req.session.loggedin = true;
            if (username == 'admin'){
                req.session.admin= true;
                console.log("Admin working")
            }
            res.redirect('/home');
        } else {
            res.send("Username and/or password incorrect")
        }
    });
});

