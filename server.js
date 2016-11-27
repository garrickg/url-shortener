var express = require('express')
var MongoClient = require('mongodb').MongoClient
var validator = require('validator');
var app = express()
var port = process.env.PORT || 3000
var options = {
  mongos: {
    ssl: false,
    sslValidate: false,
  }
}

var mongo = {
  db: null
}

var addUrl = function(req, res, next) {
  if (validator.isURL(req.params.id,{ require_protocol: true })) {
      mongo.db.collection('urls')
      .count({}, function(err, num){ // Counts documents in collection
        if(err) {
            return console.error
        }
        var json = {
            "count": (num + 1000),
            "original_url": req.params.id,
            "short_url":"http://camper-api-project-garrickg.c9users.io/" + (num + 1000)
        }
        mongo.db.collection('urls')
            .insert(json, 
            function(err, data){
                if (err) {
                    return console.error
                }
                data
            })
        res.json({
            "original_url": json.original_url,
            "short_url": json.short_url
        })
      })
  }
  else {
      res.json({
          "error": "Invalid URL Format!"
      })
  }
}

var findUrl = function (req, res, next) {
    if (req.params.id == 'new') {
      res.json({
          "error": "No URL Submitted!"
      })
    }
    else {
        mongo.db.collection('urls')
        .find(
        { 
            "count": Number(req.params.id)
        }, {
            "original_url": 1
        })
        .toArray(function(err, result) {
            if (err) {
                return console.error
            }
            else if (result.length == 0) {
                res.json({
                    "error": "Short URL not found!"
                })
            }
            else {
                res.redirect(result[0].original_url)
            }
        })
    }
}

MongoClient.connect(process.env.MONGOLAB_URI, options, function(err, db) {  //  Start DB connection
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
  mongo.db = db;
})

app.use(express.static(__dirname + '/public'));
app.set('views', (__dirname + '/public'))
app.set('view engine', 'pug')

app.get('/', function(req, res) { // Serves up homepage
    var url = req.protocol + "://" + req.get('host')
    res.render('index', {url: url})
})

app.get("/new/:id(*)", addUrl, function(req,res){ // Validates input, and adds to DB
	res.end()
})

app.get('/:id', findUrl, function(req, res) {  // Looks up DB entry and redirects.  Error if invalid id
    res.end()
})

app.get("*", function(req, res) { // 404
  res.end("404!"); // 404
})

app.listen(port, function () {
  console.log('Whoami app listening on port ' + port + '!')
})