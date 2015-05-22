var demo = new CANNON.Demo();
var mass = 150;
var vehicle1;

demo.addScene("car",function(){
    var world = demo.getWorld();
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.gravity.set(0, 0, -10);
    world.defaultContactMaterial.friction = 0;

    var groundMaterial = new CANNON.Material("groundMaterial");
    var wheelMaterial = new CANNON.Material("wheelMaterial");
    var wheelGroundContactMaterial = window.wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
        friction: 0.3,
        restitution: 0,
        contactEquationStiffness: 1000
    });

    // We must add the contact materials to the world
    world.addContactMaterial(wheelGroundContactMaterial);

    // ==== VEHICLE 1 ====
    var chassisShape;
    chassisShape = new CANNON.Box(new CANNON.Vec3(2, 1,0.5));
    var chassisBody1 = new CANNON.Body({ mass: mass });
    chassisBody1.addShape(chassisShape);
    chassisBody1.position.set(6, 0, 4);
    chassisBody1.angularVelocity.set(0, 0, 0.5);
    demo.addVisual(chassisBody1);
    
    var options = {
        radius: 0.5,
        directionLocal: new CANNON.Vec3(0, 0, -1),
        suspensionStiffness: 30,
        suspensionRestLength: 0.3,
        frictionSlip: 5,
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence:  0.01,
        axleLocal: new CANNON.Vec3(0, 1, 0),
        chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
        maxSuspensionTravel: 0.3,
        customSlidingRotationalSpeed: -30,
        useCustomSlidingRotationalSpeed: true
    };

    // Create the vehicle
    vehicle1 = new CANNON.RaycastVehicle({
        chassisBody: chassisBody1,
    });

    options.chassisConnectionPointLocal.set(1, 1, 0);
    vehicle1.addWheel(options);

    options.chassisConnectionPointLocal.set(1, -1, 0);
    vehicle1.addWheel(options);

    options.chassisConnectionPointLocal.set(-1, 1, 0);
    vehicle1.addWheel(options);

    options.chassisConnectionPointLocal.set(-1, -1, 0);
    vehicle1.addWheel(options);

    vehicle1.addToWorld(world);

    var wheelBodies1 = [];
    for(var i=0; i<vehicle1.wheelInfos.length; i++){
        var wheel = vehicle1.wheelInfos[i];
        var cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
        var wheelBody = new CANNON.Body({
            mass: 0
        });
        wheelBody.type = CANNON.Body.KINEMATIC;
        wheelBody.collisionFilterGroup = 0; // turn off collisions
        var q = new CANNON.Quaternion();
        q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
        wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
        wheelBodies1.push(wheelBody);
        demo.addVisual(wheelBody);
        world.addBody(wheelBody);
    }

    // Update wheels
    world.addEventListener('postStep', function(){
        for (var i = 0; i < vehicle1.wheelInfos.length; i++) {
            vehicle1.updateWheelTransform(i);
            var t = vehicle1.wheelInfos[i].worldTransform;
            var wheelBody = wheelBodies1[i];
            wheelBody.position.copy(t.position);
            wheelBody.quaternion.copy(t.quaternion);
        }
    });
    
    // ===== VEHICLE 2 =====
    
    var chassisBody2 = new CANNON.Body({ mass: mass });
    chassisBody2.addShape(chassisShape);
    chassisBody2.position.set(-3, 3, 4);
    chassisBody2.angularVelocity.set(0, 0, 0.5);
    demo.addVisual(chassisBody2);
    
    // Create the vehicle
    vehicle2 = new CANNON.RaycastVehicle({
        chassisBody: chassisBody2,
    });

    options.chassisConnectionPointLocal.set(1, 1, 0);
    vehicle2.addWheel(options);

    options.chassisConnectionPointLocal.set(1, -1, 0);
    vehicle2.addWheel(options);

    options.chassisConnectionPointLocal.set(-1, 1, 0);
    vehicle2.addWheel(options);

    options.chassisConnectionPointLocal.set(-1, -1, 0);
    vehicle2.addWheel(options);

    vehicle2.addToWorld(world);

    var wheelBodies2 = [];
    for(var i=0; i<vehicle2.wheelInfos.length; i++){
        var wheel = vehicle2.wheelInfos[i];
        var cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
        var wheelBody = new CANNON.Body({
            mass: 0
        });
        wheelBody.type = CANNON.Body.KINEMATIC;
        wheelBody.collisionFilterGroup = 0; // turn off collisions
        var q = new CANNON.Quaternion();
        q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
        wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
        wheelBodies2.push(wheelBody);
        demo.addVisual(wheelBody);
        world.addBody(wheelBody);
    }

    // Update wheels
    world.addEventListener('postStep', function(){
        for (var i = 0; i < vehicle2.wheelInfos.length; i++) {
            vehicle2.updateWheelTransform(i);
            var t = vehicle2.wheelInfos[i].worldTransform;
            var wheelBody = wheelBodies2[i];
            wheelBody.position.copy(t.position);
            wheelBody.quaternion.copy(t.quaternion);
        }
    });

    var matrix = [];
    var sizeX = 64,
        sizeY = 64;

    for (var i = 0; i < sizeX; i++) {
        matrix.push([]);
        for (var j = 0; j < sizeY; j++) {
            var height = Math.cos(i / sizeX * Math.PI * 5) * Math.cos(j/sizeY * Math.PI * 5) * 2 + 2;
            if(i===0 || i === sizeX-1 || j===0 || j === sizeY-1)
                height = 3;
            matrix[i].push(height);
        }
    }

    var hfShape = new CANNON.Heightfield(matrix, {
        elementSize: 100 / sizeX
    });
    var hfBody = new CANNON.Body({ mass: 0 });
    hfBody.addShape(hfShape);
    hfBody.position.set(-sizeX * hfShape.elementSize / 2, -sizeY * hfShape.elementSize / 2, -1);
    world.addBody(hfBody);
    demo.addVisual(hfBody);
});

demo.start();

document.onkeydown = handler;
document.onkeyup = handler;

var maxSteerVal = 0.5;
var maxForce = 1000;
var brakeForce = 1000000;
function handler(event){
    var up = (event.type == 'keyup');

    if(!up && event.type !== 'keydown'){
        return;
    }

    vehicle1.setBrake(0, 0);
    vehicle1.setBrake(0, 1);
    vehicle1.setBrake(0, 2);
    vehicle1.setBrake(0, 3);

    switch(event.keyCode){

    case 38: // forward
        vehicle1.applyEngineForce(up ? 0 : -maxForce, 2);
        vehicle1.applyEngineForce(up ? 0 : -maxForce, 3);
        break;

    case 40: // backward
        vehicle1.applyEngineForce(up ? 0 : maxForce, 2);
        vehicle1.applyEngineForce(up ? 0 : maxForce, 3);
        break;

    case 66: // b
        vehicle1.setBrake(brakeForce, 0);
        vehicle1.setBrake(brakeForce, 1);
        vehicle1.setBrake(brakeForce, 2);
        vehicle1.setBrake(brakeForce, 3);
        break;

    case 39: // right
        vehicle1.setSteeringValue(up ? 0 : -maxSteerVal, 0);
        vehicle1.setSteeringValue(up ? 0 : -maxSteerVal, 1);
        break;

    case 37: // left
        vehicle1.setSteeringValue(up ? 0 : maxSteerVal, 0);
        vehicle1.setSteeringValue(up ? 0 : maxSteerVal, 1);
        break;

    }
}
