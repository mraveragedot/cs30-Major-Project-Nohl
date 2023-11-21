// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let direction = [1,1];
let player, merchant, farmer;

function preload(){
  farmer = loadImage("Farmer.png");
  merchant = loadImage("merchant.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(width/2, height/2, farmer);
}

function draw() {
  background(220);
  backdrop();
  player.display();
  player.moveCharacter();
  rect(100,100,100,100);
  
}

class Player{
  constructor(x,y,theImage){
    this.x = x;
    this.y = y;
    this.dx = 5;
    this.dy = 5;

    this.myImage = theImage;
  }

  display(){
    if(direction[0] === 1){
      imageMode(CENTER);
      image(this.myImage,this.x, this.y, 90, 90);
    }
    else{
      push();
      imageMode(CENTER);
      scale(direction);
      image(this.myImage, -this.x, this.y, 90, 90);
      pop();
    }
    imageMode(CORNER);
  }

  moveCharacter(){
    if (keyIsDown(65)) {
      this.x -= this.dx;
      direction = [-1,1];
    }
  
    if (keyIsDown(68)) {
      this.x += this.dx;
      direction = [1,1];

    }
  
    if (keyIsDown(87)) {
      this.y -= this.dy;

    }
  
    if (keyIsDown(83)) {
      this.y += this.dy;

    }

  }
}

function backdrop(){
  imageMode(TOP);
  image(merchant, width / 16*14,0, 100,100);
}
 