var perlin = new toxi.math.noise.PerlinNoise();

var width = 300;
var height = 1000;
var x = width / 2;
var y = 0;
var lightningBoltPoints = [{x: x, y: y}];
var strength = 3;
var sum = toxi.geom.Vec2D.ZERO;
var avg;
var count = 1;

function setup() {
  width = 640;
  height = 480;

  createCanvas(width, height);
  frameRate(60);
}

function draw() {

  var currPoint = lightningBoltPoints[lightningBoltPoints.length - 1];

  var noise = perlin.noise( currPoint.x, currPoint.y ) - 0.5;
  var angle = strength * noise;
  
  angle += Math.PI / 2; // initial angle downwards

  var dir = toxi.geom.Vec2D.fromTheta( angle );
  sum.addSelf(dir);
  avg = sum.scale(1/count);
  count++;
  console.log(avg, count);
  var newPoint = {
    x: currPoint.x,
    y: currPoint.y
  };
  newPoint.x += dir.x;
  newPoint.y += dir.y;
  lightningBoltPoints.push(newPoint);
  
  stroke(0);
  lightningBoltPoints.slice(1).forEach(function(curr, i) {
    var prev = lightningBoltPoints[i];
    line(curr.x, curr.y, prev.x, prev.y);
  });
}