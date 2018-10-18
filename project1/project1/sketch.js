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
  var flag = true;
  for(var n = 0; n<500; n++){
    var s = stars[n];
    s.show();
    s.behaviors();
    s.update();

    if (s.pos.x>0 && s.pos.y>0 && s.pos.x<width && s.pos.y<height){
      flag = false;
    }
  }

  console.log(flag);

  if (flag == true){
    for(var n = 0; n<500; n++){
      var s = stars[n];
      s.vel = createVector(0,0);
      s.acc = createVector(0,0);
      s.show();


     //Problem!!!! when all the little balls are outside window I want them to move back on window, to new specific position, but failed. It shows static, without moving from outside to the specific position

      var targetposition = createVector(n * sin(n) + width/2, n * cos(n) + height/2);
      s.attractbehavior(targetposition);

      s.update();

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
  }
  
  show(){
  fill(this.col,100,100);
  noStroke();
  ellipse(this.pos.x,this.pos.y,this.r,this.r)
  }
  
  behaviors(){
    var mouse =  createVector(mouseX,mouseY);
    var scattervector= this.scatter(mouse);
    this.applyForce(scattervector);
  }
  
  scatter(target){
  var distvect = p5.Vector.sub(this.pos,target);
  if(distvect.mag()<200){
    return distvect;
    }
  }
  
  applyForce(f){
    this.acc.add(f);
  }
  
  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }


  attractbehavior(target){ 
    var attractforce = p5.Vector.sub(target,this.pos);
    this.applyForce(attractforce);
  }

  // arrive(target){
  //   var distvect = p5.Vector.sub(this.pos,target);
  //   if (distvect.mag()<50){
  //     return distvect;
  //   }
  // }
  
  

  
}

