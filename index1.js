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

db.users.find(1, function(err,res){
  console.log(res);
});

db.purchases.find(1, function(err,res){
  console.log(res);
});

db.products.find(1, function(err,res){
  console.log(res);
});

app.get('/', function(req, res) {
    res.send('Return JSON or HTML View');
});

app.get('/users', function(req, res) {
    db.users.find({}, function(err, result) {
		res.send(result);
	})
});

app.get('/users/:id', function(req, res) {
    console.log(req.params.id);
    db.users.find({ id: req.params.id }, function(err,result){
        res.send(result);
    })
});

app.get('/products', function (req, res) {
  db.products.find({}, function(err, result) {
    res.send(result);
  })
});

app.get('/products/:id', function(req, res) {
    db.products.find({ id: req.params.id }, function(err,result){
        res.send(result);
    })
});

app.get('/purchases', function (req, res) {
  db.purchases.find({}, function(err, result) {
    res.send(result);
  })
});

app.get('/purchases/:id', function(req, res) {
    db.purchases.find({ id: req.params.id }, function(err,result){
        res.send(result);
    })
});