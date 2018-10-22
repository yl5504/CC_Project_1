var stars= []; var starstwo = []; var starsthree = [];
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

  for(var n = 0; n < 500; n++){   
    var col=n%250;    
    var r= sin(n) * 8;
    var x = random(-width/2,width/2); 
    var y = random(-height/2,height/2);
    starstwo[n] = new Star(x,y,col,r);
  }

  for(var n = 0; n < 500; n++){   
    var col=n%250;    
    var r= sin(n) * 8;
    var x = random(0,width); 
    var y = random(0,height);
    starsthree[n] = new Star(x,y,col,r);
  }
  
}

function draw(){
  background(0);
  var mouse = createVector(mouseX,mouseY)
  var flag = true;

  for(var n = 0; n<stars.length; n++){
    var s = stars[n];
    s.show();
    s.scatter(mouse);
    s.update();

    if (s.pos.x>0 && s.pos.y>0 && s.pos.x<width && s.pos.y<height){
      flag = false;
    }
  }



  if (flag == true){

    for(var n = 0; n<500; n++){
      push()
      translate(width/2,height/2);
      var rot = map(mouseX, 0, width,-1,1);
      rotate(rot * frameCount/200)        
      var t = starstwo[n];
      t.show();
      let target = createVector((n * sin(n) ), (n * cos(n) ));
      t.arrive(target);
      t.update();
      pop()

      if(mouseIsPressed){
        var mouse = createVector(mouseX,mouseY)
        var center = createVector(width/2,height/2)
        var tar = p5.Vector.sub(center,mouse)
        t.arrive(tar);
      }

     

    }
    planet();


  }


  if (keyIsPressed && key ==' '){
    for(var n = 0; n<starsthree.length;n++){
      var h = starsthree[n];
      h.show();
    }
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
    //this.acc.setMag(2.0);
  }
  
  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
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
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce); // Limit to maximum steering force
    this.applyForce(steer);
  }


  
  

  
}

