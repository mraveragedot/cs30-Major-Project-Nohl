// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let farmer;

function preload(){
  farmer = loadImage("Farmer.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  Player.display();
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
    image(this.myImage,this.x, this.y);
  }

  moveCharacter(){
    if (keyIsDown(65)) {
      this.x -= 5;
    }
  
    if (keyIsDown(68)) {
      this.x += 5;
    }
  
    if (keyIsDown(87)) {
      this.y -= 5;
    }
  
    if (keyIsDown(83)) {
      this.y += 5;
    }

  }
}

