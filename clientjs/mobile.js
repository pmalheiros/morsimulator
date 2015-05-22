$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1">');
$('head').append('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootswatch/3.3.4/darkly/bootstrap.min.css">');
$('head').append('<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>');

$('body').load('mobile-body.html', function (){
  var socket = io();
  var connected = false;

  var curOrientation = {};
  var resetOrientation = {};
  
  $('#buttonMobileConnect').click(function() {
    if(!connected) {
      socket.emit('mobileConnectWithCode', $('#connectionID').val());
    } else {
      socket.emit('mobileDisconnect', '444');
      window.removeEventListener('deviceorientation', emitOrientation, false);
      $('#buttonMobileConnect').html('Connect');
      $('#mobileOrientation').val('');
      connected = false;
      $('#buttonResetOrientation').prop('disabled',!connected);
      resetOrientation = {};
    }
    return false;
  });
  
  $('#buttonResetOrientation').click(function() {
    resetOrientation = curOrientation;
    return false;
  });
  
  socket.on('error-msg', function(error) {
    window.removeEventListener('deviceorientation', emitOrientation, false);
    return alert(error);
    connected = false;
    $('#buttonResetOrientation').prop('disabled',!connected);
    $('#buttonMobileConnect').html('Connect');
    resetOrientation = {};
  });
  
  socket.on("serverAcceptedConnection", function(data) {
    $('#buttonMobileConnect').html('Disconnect');
    connected = true;
    window.addEventListener('deviceorientation', emitOrientation, false);
    $('#buttonResetOrientation').prop('disabled',!connected);
  });
  
  socket.on("lostConnection", function(data) {
    alert('sorry the connection was lost :-(');
    window.removeEventListener('deviceorientation', emitOrientation, false);
    $('#buttonMobileConnect').html('Connect');
    $('#connectionID').val('');
    $('#mobileOrientation').val('');
    connected = false;
    $('#buttonResetOrientation').prop('disabled',!connected);
    resetOrientation = {};
  });
  
  function emitOrientation(event) {
    $("#mobileOrientation").val(Math.round(event.alpha) + ", " + Math.round(event.beta) + ", " + Math.round(event.gamma));
    curOrientation = {
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma
    }
    if (typeof resetOrientation.alpha == 'undefined') {
      // First run
      resetOrientation = curOrientation;
    }
    var data = {
      alpha: curOrientation.alpha - resetOrientation.alpha,
      beta: curOrientation.beta - resetOrientation.beta,
      gamma: curOrientation.gamma - resetOrientation.gamma
    }
    //conn.send(data);
    socket.emit("ondeviceorientation", data);
  }
});
