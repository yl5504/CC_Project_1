var stars= [];
var starX= []; var starY= [];
var x,y; var i=0;

function setup(){
  createCanvas(windowWidth,windowHeight);
  background(0);
  colorMode(HSB);

  for(var n = 0; n < 500; n++){   
    var col=n%250;    
    var r= sin(n) * 8;
    var x = random(0,width); 
    var y = random(0,height);
    stars[n] = new Star(x,y,col,r);
  }
  
}

function draw(){
  background(0);
  var mouse = createVector(mouseX,mouseY)
  var flag = true;
  for(var n = 0; n<500; n++){
    var s = stars[n];
    s.show();
    s.scatter(mouse);
    s.update();

    if (s.pos.x>0 && s.pos.y>0 && s.pos.x<width && s.pos.y<height){
      flag = false;
    }
  }

  console.log(flag);

  if (flag == true){
    for(var n = 0; n<500; n++){
      var s = stars[n];
      //s.vel = createVector(0,0);
      //s.acc = createVector(0,0);

      s.show();


     //Problem!!!! when all the little balls are outside window I want them to move back on window, to new specific position, but failed. It won't stop moving!!

      var targetposition = createVector(n * sin(n) + width/2, n * cos(n) + height/2);
      s.arrive(targetposition);

      s.update();
      //s.pos = createVector(n * sin(n) + width/2, n * cos(n) + height/2)
    }
  }

}

class Star{
  constructor(x,y,col,r){
    this.pos= createVector(x, y);
    this.col=col;
    this.r=r;
    this.vel= createVector();
    this.acc= createVector();
    this.target = createVector();
    this.maxspeed = 30;
    this.maxforce = 10;
  }
  
  show(){
  fill(this.col,100,100);
  noStroke();
  ellipse(this.pos.x,this.pos.y,this.r,this.r)
  }
  
  
  scatter(target){
  var desired = p5.Vector.sub(this.pos,target);
  var d = desired.mag();
  if(d<200){
      var m = map(d, 0, 100, 0, this.maxspeed);
      desired.setMag(m);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce); // Limit to maximum steering force
    this.applyForce(steer);
  }
  }
  
  applyForce(f){
    this.acc.add(f);
    this.acc.setMag(1.0);
  }
  
  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }


  arrive(target){ 

    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    var d = desired.mag();
    // Scale with arbitrary damping within 100 pixels
    if (d < 100) {
      var m = map(d, 0, 100, 0, this.maxspeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxspeed);
    }

    // Steering = Desired minus Velocity
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce); // Limit to maximum steering force
    this.applyForce(steer);
  }


  
  

  
}

