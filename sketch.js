var perlin = new toxi.math.noise.PerlinNoise();

var width = 300;
var height = 1000;
var x = width / 2;
var y = 0;
var strength = 4;
var fragmentMinScale = 1;
var fragmentMaxScale = 2;
var forkChance = 0.5;
var forkThreshold = 0.5;
var forkAngle = Math.PI / 8;
var strengthCutoffThreshold = 0.01;
var groundAttractionVector = new toxi.geom.Vec2D(0,1);
var counter = 0;
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
  var repulsionAmount = Math.min(0.1, 50/diffSize/diffSize);
  var repulsionVector = diff.scale(repulsionAmount / diffSize);
  return repulsionVector;
}

function draw() {
  counter++;
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
    bolt.strength -= 0.0001;
    
    var currPoint = bolt[bolt.length - 1];
    
    // generate a random angle based on perlin noise
    var noise = perlin.noise( currPoint.x, currPoint.y ) * 0.9 + Math.random() * 0.1;
    var angleNoise = noise - 0.5;
    var deviationAngle = angleNoise * strength;
    var angle = deviationAngle + bolt.angle;
    var dir = toxi.geom.Vec2D.fromTheta( angle );
    
    // scale the movement of the random noise
    var scale = noise * (fragmentMaxScale - fragmentMinScale) + fragmentMinScale;
    dir.scaleSelf(scale);
    
    // modify direction by attracting towards ground 
    dir.addSelf(groundAttractionVector);
    console.log(groundAttractionVector);
    
    var repulsion = new toxi.geom.Vec2D();
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
    
    stroke(0 + 200 * (1 - bolt.strength));
    var curr = bolt[bolt.length-1];
    var prev = bolt[bolt.length-2];
    line(curr.x, curr.y, prev.x, prev.y);
    if (counter % 10 === 0) {
//      stroke("red");
//      line(curr.x, curr.y, curr.x + repulsion.x * 100, curr.y + repulsion.y * 100);
    }
  });
}