var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

var Massive=require("massive");
var db = Massive.connectSync({db : 'pgguide'});

app.get('/products/unsafe', (req, res) => {
  const title = req.query.title;
  //Unsafe
  //Use ' ' 
  db.run(`select * from products where title = ${title};`, (err, result) => res.send(result));
});

app.get('/products/para', (req, res) => {
  const title = req.query.title;
  //Parameterised
  db.run('select * from products where title = $1;', [title], (err, result) => res.send(result));
});

app.get('/products/store', (req, res) => {
  const title = req.query.title;
  //Stored procedure
  db.run('select * from products where title = $1;', [title], (err, result) => res.send(result));
});

app.get('/purchases', function (req, res) {
  db.purchases.find({}, function(err, result) {
    res.send(result);
  })
});
