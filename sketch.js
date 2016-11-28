var perlin = new toxi.math.noise.PerlinNoise();

var width = 300;
var height = 1000;
var x = width / 2;
var y = 0;
var lightningBoltPoints = [{x: x, y: y}];
var strength = 5;
var fragmentMinScale = 1;
var fragmentMaxScale = 1.1;

function setup() {
  width = 640;
  height = 480;

  createCanvas(width, height);
  frameRate(60);
}

function draw() {

  var currPoint = lightningBoltPoints[lightningBoltPoints.length - 1];

  var noise = perlin.noise( currPoint.x, currPoint.y );
  var angleNoise = noise - 0.5;
  var angle = angleNoise * strength;
  angle += Math.PI / 2; // initial angle downwards
  var dir = toxi.geom.Vec2D.fromTheta( angle );
  var scale = noise * (fragmentMaxScale - fragmentMinScale) + fragmentMinScale;
  dir.scaleSelf(scale);

  var newPoint = {
    x: currPoint.x,
    y: currPoint.y
  };
  newPoint.x += dir.x;
  newPoint.y += dir.y;
  lightningBoltPoints.push(newPoint);
  
  stroke(0);
  var curr = lightningBoltPoints[lightningBoltPoints.length-1];
  var prev = lightningBoltPoints[lightningBoltPoints.length-2];
  line(curr.x, curr.y, prev.x, prev.y);
}