var socket = io();
var socketDataReceived;
var socketWatchdog;

socket.on('connectionID', function(data) {
  return $('#connectionID').val(data);
});

socket.on("mobileDevicePing", function(data) {
  $("#infoBox").dialog("close");
  socketWatchdog = setInterval(function(){
    if (socketDataReceived) {
      socketDataReceived = false;
    } else {
      stopVehicle();
    }
  },1000);
});

function stopVehicle() {
  vehicle.applyEngineForce(0, 2);
  vehicle.applyEngineForce(0, 3);
  vehicle.setSteeringValue(0, 0);
  vehicle.setSteeringValue(0, 1);  
  var brakeForce = 100000;
  vehicle.setBrake(brakeForce, 0);
  vehicle.setBrake(brakeForce, 1);
  vehicle.setBrake(brakeForce, 2);
  vehicle.setBrake(brakeForce, 3);
  
  clearInterval(socketWatchdog);
}

socket.on("mobileDeviceDisconnect", function(data) {
  stopVehicle();
});

socket.on("receiveOrientation", function(data) {
  socketDataReceived = true;
  vehicle.setBrake(0, 0);
  vehicle.setBrake(0, 1);
  vehicle.setBrake(0, 2);
  vehicle.setBrake(0, 3);
  
  var maxForce = Math.min(Math.max(-data.gamma*20,-1000),1000);
  vehicle.applyEngineForce(maxForce, 2);
  vehicle.applyEngineForce(maxForce, 3);
  
  var maxSteerVal = Math.min(Math.max(-data.beta/80,-0.5),0.5);
  vehicle.setSteeringValue(maxSteerVal, 0);
  vehicle.setSteeringValue(maxSteerVal, 1);  
});
