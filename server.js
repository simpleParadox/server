const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
var app = express(); // Getting an instance of request.
//Express middleware.I'd like 'express'to work differently.

// Setting up partials.
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('currYear', () => {
  return new Date().getFullYear();
});

// Functions that take arguments.
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});
// Setting view engines for templates.
app.set("view engine", 'hbs');

app.use(express.static(__dirname + '/public')); // We can directly point a reference to the directory. Registering middleware.

app.use((req, res, next) => {
  // A middlewareto process some data.
  var date = new Date().toString();

  var log = `${date}: ${req.method} ${req.url}`;

  fs.appendFile('server.txt', log + '\n', (err) => {
    if(err){
      console.log("Unable to write to file.");
    }
  });

  console.log(log);
  next(); // Do not forget to call this.
});

app.use((req, res, next) => {
  res.render('maintenance.hbs', {
    title: req.url
  });  
});


// Setting up request handlers.
app.get('/', (req, res) => {
  // res.send("Hello, World !")
  res.render('home.hbs', {
    title: 'Home Page',
    welcome:'Welcome to the Radox Inc.'
  });
});
app.get('/about', (req, res) => {
  res.render("about.hbs", {
    title: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    error: "Unable to process request!"
  });
});

app.listen(1997, () =>{
  console.log("Server is up and running.");
});
