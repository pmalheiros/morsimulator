//
// # MORSimulator showcase
//
// A simple showcase for testing webGL, cannon.js and socket.io
//
var http = require('http');
var path = require('path');

var socketio = require('socket.io');
var express = require('express');
var config = require('./serverjs/config');

var app = express();
var server = http.createServer(app);

var ExpressPeerServer = require('peer').ExpressPeerServer;

var io = socketio.listen(server);

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/js', express.static(path.join(__dirname, 'clientjs')));
app.use('/', express.static(path.join(__dirname, 'public')));

// index page
app.get('/', function(req, res) {
	res.render('pages/index', {
		config: config.client
	});
});

// index page only in desktop mode
app.get('/desktop.html', function(req, res) {
	res.render('pages/desktop', {
		config: config.client
	});
});

// index page in peer server mode
app.get('/multiplayer/peerServer.html', function(req, res) {
	res.render('pages/peerServer', {
		config: config.client,
		serverPort: config.web.port,
		serverHost: config.web.host
	});
});

// index page in peer client mode
app.get('/multiplayer/peerClient.html', function(req, res) {
	res.render('pages/peerClient', {
		config: config.client,
		serverPort: config.web.port,
		serverHost: config.web.host
	});
});

// info page
app.get('/info', function(req, res) {
	res.render('pages/info', {
		config: config.client
	});
});

// info page
app.get('/multiplayer', function(req, res) {
	res.render('pages/multiplayer', {
		config: config.client
	});
});

// about page
app.get('/about', function(req, res) {
	res.render('pages/about', {
		config: config.client
	});
});

var sockets = [];
var connections = [];
var socketConnect;

io.on('connection', function(socket){
  console.log('a user connected');
  var connectionID = socketConnect(socket);
  var peerID;
  var sentBrokeConnection = false;

  socket.on("mobileConnectWithCode", function (data) {
    if (sockets[data] != null) {
      if (connections[data] == null) { // no connection yet established
        console.log('p2p successfull');
        peerID = data;
        connections[data] = socket;
        socket.emit("serverAcceptedConnection", 200);
        sockets[data].emit('mobileDevicePing', data);
        sentBrokeConnection = false;
      } else {
        // desktop already in a p2p connection
        console.log('attempted duplicate connection');
        socket.emit('error-msg', "Sorry... destination already connected to a device");
      }
    } else {
      console.log('attempted connection missing');
      socket.emit('error-msg', "Sorry... I couldn't find that connection");
    }
  });

  socket.on("mobileDisconnect", function (data) {
    console.log('releasing desktop server connection on request- ' + peerID);
    sockets[peerID].emit('mobileDeviceDisconnect', '444');
    if (connections[peerID] != null) {
      connections[peerID] = null;
    }
    peerID = null;
  });

  socket.on("ondeviceorientation", function(data) {
    if (sockets[peerID]) {
      sockets[peerID].emit("receiveOrientation", data);
    } else {
      if (sentBrokeConnection !== true) {
        console.log('someone broke the connection');
        socket.emit('lostConnection', '444');
        sentBrokeConnection = true;
      }
    }
  });
  socket.on("disconnect", function() {
    console.log("Server: End Connection - " + socket.id);
    if((peerID != null) && (sockets[peerID])) {
      // this device is connected to a desktop
      console.log('releasing desktop server connection - ' + peerID);
      sockets[peerID].emit('mobileDeviceDisconnect', '444');
      if (connections[peerID] != null) {
        connections[peerID] = null;
      }
      peerID = null;
    }
    sockets[connectionID] = null;
    if (connections[connectionID] != null) {
      connections[connectionID] = null;
    }
    connectionID = null;
  });
});

function socketConnect(socket) {
  var id;
  for(var i = 0; i < 10; i++) {
    // ten attempts to find a valid id
    id = Math.floor(Math.random() * 90000) + 10000;
    if(sockets[id] == null) {
      sockets[id] = socket;
      break;
    }
  }
  //socket.set('connectionID', id);
  socket.emit('connectionID', id);
  console.log("Server: New connection - " + socket.id + " - " + id);
  return id;
};

var options = {
  debug: true
};

app.use('/api', ExpressPeerServer(server, options));

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
})
