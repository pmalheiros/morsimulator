var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/clientjs'));

// index page
app.get('/info', function(req, res) {
	res.render('pages/index');
});

// about page
app.get('/info/about', function(req, res) {
	res.render('pages/about');
});

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('App listening at http://%s:%s', host, port)
})
