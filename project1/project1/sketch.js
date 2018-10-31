var stars= []; var starstwo = []; 
var z = 1;
var bg;

var paths= [];
var current; var previous;
var painting = false;


function setup(){
  createCanvas(windowWidth,windowHeight);
  background(0);
  colorMode(HSB);

  bg = loadImage('data/background.png')

  current = createVector(0,0);
  previous = createVector(0,0);

  //First screen full of balls needed to be wiped out
  for(var n = 0; n < 500; n++){   
    var col=n%250;    //color of each ball
    var r= sin(n) * 12;  //radius of each ball
    var x = random(0,width); //x position of each ball
    var y = random(0,height); //y position of each ball
    stars[n] = new Star(x,y,col,r);
  }

  //Second screen of spiraling balls
  for(var n = 0; n < 1000; n++){   
    var col=n%250;    
    var r= sin(n) * 12 / z;
    var x = random(-width/2,width/2); 
    var y = random(-height/2,height/2);
    starstwo[n] = new Star(x,y,col,r);
  }
  
}



function draw(){
  background(0);
  var mouse = createVector(mouseX,mouseY)
  var flag = true;


  for(var n = 0; n<stars.length; n++){
    var s = stars[n];
    s.col = n * frameCount /300  //color changes with time
    s.show();
    s.scatter(mouse);    //move your mouse to erase every dots!
    s.update();    

    if (s.pos.x>0 && s.pos.y>0 && s.pos.x<width && s.pos.y<height){
      flag = false;
    }
  }


  // erase every dots, and then new thing will show!!
  if (flag == true){

    image(bg,0,0,width,height)


    if (painting){
      current = mouse
      paths[paths.length-1].addnewline(current);
      previous = current
    }
    for(var i = 0; i<paths.length;i++){
      paths[i].show();
    }

    for(var n = 0; n<starstwo.length; n++){
      push()
      translate(width/2,height/2);
      var rot = map(mouseX, 0, width,-1,1);
      rotate(rot * frameCount/200)        
      var t = starstwo[n];
      t.show();
      let target = createVector(n/z*sin(n), n/z*cos(n))
      t.arrive(target);
      t.update();
      pop()

      //press mouse to attract the dots
      // if(mouseIsPressed){
      //   var mouse = createVector(mouseX,mouseY)
      //   var center = createVector(width/2,height/2)
      //   var tar = p5.Vector.sub(center,mouse)
      //   t.arrive(tar);
      // }

    

      // press key space to see random dots flying
      if(keyIsPressed && key ==' '){
        t.pos = createVector(random(-width/2,width/2),random(-height/2,height/2))
      }
     
    }

    if (keyIsPressed) {
        if (key == 'a') z -= 2;
        else if (key == 's') z += 2;
        else if (key == 'd') z *= -1;
        else if (key == 'r') z = 1;

        for (var n = 0;n<starstwo.length;n++){
          push()
          translate(width/2,height/2)
          var t = starstwo[n];
          var r= sin(n) * 12 ;
          var x = n*sin(n)/z; 
          var y = n*cos(n)/z;
          t.show();
          pop()
        }
    }

    //a pattern orbiting like planets
    planet();
  }


}



function planet(){
  var colorfrom = color(312,75,87,100);
  var colorto = color(55,75,87,100);
  var interval = map(mouseX/5,0,width,0,5);
  var lerpedcol = lerpColor(colorfrom,colorto,interval, .33);
  var x = 0.5;   
  while(x<30){
    fill(lerpedcol);
    noStroke();
    translate(width/2,height/2);
    var rot = map(mouseX, 0, width,1,-1);
    rotate(rot*frameCount/800);
    scale(x*0.1);
    ellipse (mouseX/60,x*3,20,20); 
    x = x +0.5;
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
    this.maxspeed = 10;
    this.maxforce = 7;
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
  }
  
  update(){
    this.vel.add(this.acc); // Update velocity
    this.pos.add(this.vel);
    this.acc.mult(0);   // Reset accelerationelertion to 0 each cycle
  }


  arrive(target){ 
    var desired = p5.Vector.sub(target, this.pos); // A vector pointing from the location to the target
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




class Path{
  constructor(){
    this.particles = []
  }
  show(){
    for(var i = 0; i<this.particles.length;i++){
      this.particles[i].show(this.particles[i+1])
      this.particles[i].update();
    }
  }
  addnewline(position){
    this.particles.push(new Particle(position))
  }
}

class Particle{
  constructor(position){
    this.position = createVector(position.x,position.y)
    this.lifespan = 200;
  }
  show(another){
    stroke(255,this.lifespan)
    fill(255,this.lifespan)
    ellipse(this.position.x,this.position.y,10,10)
    if (another){
      line(this.position.x,this.position.y,another.position.x,another.position.y)
    }
  }
  update(){
    this.lifespan = this.lifespan -1
  }
}

function mousePressed(){
  painting = true;
  paths.push(new Path());
}

function mouseReleased(){
  painting = false;
}

