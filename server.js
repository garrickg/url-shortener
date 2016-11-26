var express = require('express')
var app = express()
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.set('views', (__dirname + '/public'))
app.set('view engine', 'pug')

app.get('/', function(req, res) { // Serves up homepage
    var url = req.protocol + "://" + req.get('host')
    res.render('index', {url: url})
});

app.get('/new/:id', function(req, res) { // Creates new DB entry, and serves JSON result.  Error if no arg, or invalid url
    var id = req.params.id
    res.end("Creating new DB entry for " + id)
});

app.get('/:id', function(req, res) {  // Looks up DB entry and redirects.  Error if invalid id
    var id = req.params.id
    res.end("Redirecting to " + id)
});

app.get("*", function(req, res) { // 404
  res.end("404!"); // 404
});

app.listen(port, function () {
  console.log('Whoami app listening on port ' + port + '!')
})