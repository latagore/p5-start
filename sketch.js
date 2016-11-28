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
var bolts = [];

function setup() {
  width = 640;
  height = 480;
  // start first bolt
  var bolt = [{x: x, y: y}];
  bolt.angle = Math.PI / 2; // initial angle down
  bolts.push(bolt);

  createCanvas(width, height);
  frameRate(60);
}

function draw() {
  console.log(bolts.length)
  bolts.forEach(function (bolt) {
    var currPoint = bolt[bolt.length - 1];
    var noise = perlin.noise( currPoint.x, currPoint.y );
    var angleNoise = noise - 0.5;
    var angle = angleNoise * strength;
    angle += bolt.angle;
    var dir = toxi.geom.Vec2D.fromTheta( angle );
    var scale = noise * (fragmentMaxScale - fragmentMinScale) + fragmentMinScale;
    dir.scaleSelf(scale);
    // decide whether to add a new bolt
    console.log(angle > strength / 2 * (1 - forkThreshold));
    console.log(noise > (1 - forkChance));
    if (Math.abs(angle) > strength / 2 * (1 - forkThreshold) && Math.random() > (1 - forkChance)) {
      
      var newBolt = [currPoint];
      newBolt.angle = (Math.random() - 0.5) * forkAngle + angle;
      bolts.push(newBolt);
    }
    
    var newPoint = {
      x: currPoint.x,
      y: currPoint.y
    };
    newPoint.x += dir.x;
    newPoint.y += dir.y;
    bolt.push(newPoint);
    
    stroke(0);
    var curr = bolt[bolt.length-1];
    var prev = bolt[bolt.length-2];
    line(curr.x, curr.y, prev.x, prev.y);
  });
}