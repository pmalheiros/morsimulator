var socket = io();

socket.on('connectionID', function(data) {
  return $('#connectionID').val(data);
});

socket.on("mobileDevicePing", function(data) {
  $("#infoBox").dialog("close");
});

socket.on("mobileDeviceDisconnect", function(data) {
  var brakeForce = 100000;
  vehicle.setBrake(brakeForce, 0);
  vehicle.setBrake(brakeForce, 1);
  vehicle.setBrake(brakeForce, 2);
  vehicle.setBrake(brakeForce, 3);
});

socket.on("receiveOrientation", function(data) {
  vehicle.setBrake(0, 0);
  vehicle.setBrake(0, 1);
  vehicle.setBrake(0, 2);
  vehicle.setBrake(0, 3);
  
  var maxForce = -data.gamma*20;
  vehicle.applyEngineForce(maxForce, 2);
  vehicle.applyEngineForce(maxForce, 3);
  
  var maxSteerVal = -data.beta/100;
  vehicle.setSteeringValue(maxSteerVal, 0);
  vehicle.setSteeringValue(maxSteerVal, 1);  
});
