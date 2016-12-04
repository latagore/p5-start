var perlin = new toxi.math.noise.PerlinNoise();

var width = 300;
var height = 1000;
var x = width / 2;
var y = 0;
var strength = 5;
var fragmentMinScale = 1;
var fragmentMaxScale = 1.5;
var forkChance = 0.1;
var forkThreshold = 0.1;
var forkAngle = Math.PI / 4;
var strengthCutoffThreshold = 0.01;
var groundAttractionVector = new toxi.geom.Vec2D(0,0.1);

var bolts = [];

function setup() {
  width = 640;
  height = 480;
  // start first bolt
  var bolt = [];
  bolt.push(new toxi.geom.Vec2D(x, y));
  bolt.angle = Math.PI / 2; // initial angle down
  bolt.strength = 1;
  bolts.push(bolt);

  createCanvas(width, height);
  frameRate(60);
}

// calculates the repulsion vector on v1
function calculateV1Repulsion(v1, v2) {
  var diff = v1.sub(v2);
  var diffSize = diff.magnitude();
  var repulsionAmount = Math.min(0.01, 1/diffSize/diffSize);
  var repulsionVector = diff.scale(repulsionAmount / diffSize);
  return repulsionVector;
}

function draw() {
  console.log(bolts.length)
  if (bolts.length === 0) {
    noLoop();
  }
  bolts.forEach(function (bolt, i) {
    if (bolt.strength < strengthCutoffThreshold) {
      // make sure we don't have unlimited bolts
      // remove bolt when the strength is too low
      bolts.splice(i, 1);
    }
    var currPoint = bolt[bolt.length - 1];
    
    // generate a random angle based on perlin noise
    var noise = perlin.noise( currPoint.x, currPoint.y ) * 0.9 + Math.random() * 0.1;
    var angleNoise = noise - 0.5;
    var angle = angleNoise * strength;
    angle += bolt.angle;
    var dir = toxi.geom.Vec2D.fromTheta( angle );
    
    // scale the movement of the random noise
    var scale = noise * (fragmentMaxScale - fragmentMinScale) + fragmentMinScale;
    dir.scaleSelf(scale);
    
    // modify direction by attracting towards ground 
    dir.addSelf(groundAttractionVector);
    console.log(groundAttractionVector);
    
    var repulsion = toxi.geom.Vec2D.ZERO;
    // modify the direction by repulsing away from existing bolt heads
    bolts.forEach(function (otherBolt, j) {
      // don't include the current bolt
      if (i !== j) {
        var otherHead = otherBolt[otherBolt.length - 1];
        repulsion.addSelf(calculateV1Repulsion(currPoint, otherHead));
      }
    });
    
    dir.addSelf(repulsion);
    // decide whether to add a new bolt
    if (Math.abs(angle) > strength / 2 * (1 - forkThreshold) && Math.random() > (1 - forkChance)) {
      
      var newBolt = [currPoint];
      newBolt.angle = (Math.random() - 0.5) * forkAngle + angle;
      
      var strengthFactor = Math.random(); // the factor of how much lightning branches off
      newBolt.strength = bolt.strength * strengthFactor;
      bolt.strength = bolt.strength * (1 - strengthFactor);
      
      bolts.push(newBolt);
      
    }
    
    var newPoint = new toxi.geom.Vec2D(currPoint.x, currPoint.y);
    newPoint.x += dir.x;
    newPoint.y += dir.y;
    bolt.push(newPoint);
    
    stroke(0 + 135 * (1 - bolt.strength));
    var curr = bolt[bolt.length-1];
    var prev = bolt[bolt.length-2];
    line(curr.x, curr.y, prev.x, prev.y);
  });
}