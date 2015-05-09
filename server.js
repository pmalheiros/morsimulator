var express = require('express');
var config = require('./serverjs/config');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/', express.static(__dirname + '/clientjs'));
app.use('/', express.static(__dirname + '/public'));

// index page
app.get('/', function(req, res) {
	res.render('pages/index', {
		config: config
	});
});

// info page
app.get('/info', function(req, res) {
	res.render('pages/info', {
		config: config
	});
});

// about page
app.get('/info/about', function(req, res) {
	res.render('pages/about', {
		config: config
	});
});

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
})
