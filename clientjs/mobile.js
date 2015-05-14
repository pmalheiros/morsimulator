$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1">');
$('head').append('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootswatch/3.3.4/spacelab/bootstrap.min.css">');
$('head').append('<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>');

$('body').load('mobile-body.html', function (){
  var socket = io();
  var connected = false;
  
  $('#buttonMobileConnect').click(function() {
    if(!connected) {
      socket.emit('mobileConnectWithCode', $('#connectionID').val());
    } else {
      socket.emit('mobileDisconnect', '444');
      window.removeEventListener('deviceorientation', emitOrientation, false);
      $('#buttonMobileConnect').html('Connect');
      $('#mobileOrientation').val('');
      connected = false;
    }
    return false;
  });
  
  socket.on('error-msg', function(error) {
    return alert(error);
  });
  
  socket.on("serverAcceptedConnection", function(data) {
    $('#buttonMobileConnect').html('Disconnect');
    connected = true;
    window.addEventListener('deviceorientation', emitOrientation, false);
  });
  
  socket.on("lostConnection", function(data) {
    alert('sorry the connection was lost :-(');
    window.removeEventListener('deviceorientation', emitOrientation, false);
    $('#buttonMobileConnect').html('Connect');
    $('#connectionID').val('');
    $('#mobileOrientation').val('');
    connected = false;
  });
  
  function emitOrientation(event) {
    $("#mobileOrientation").val(Math.round(event.alpha) + ", " + Math.round(event.beta) + ", " + Math.round(event.gamma));
    socket.emit("ondeviceorientation", {
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma
    });
  }
});
