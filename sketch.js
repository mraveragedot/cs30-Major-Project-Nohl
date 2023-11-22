// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let grid = [];
let direction = [1,1];
let farmCellSize, player, merchant, farmer; 

const FARMCELLW = 50;
const FARMCELLH = 40;

function preload(){
  farmer = loadImage("Farmer.png");
  merchant = loadImage("merchant.png");
}

function setup() {
  farmCellSize = width/FARMCELLW;
  createEmptyGrid(grid,FARMCELLH,FARMCELLW);
  createCanvas(windowWidth, windowHeight);
  player = new Player(width/2, height/2, farmer);
}

function draw() {
  background(220);
  backdrop();
  player.display();
  player.moveCharacter();
  rect(100,100,100,100);
  displayGrid()
  
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
  imageMode(CORNER);
  image(merchant, width / 16*14,0, 100,100);
}

function createEmptyGrid(grid,cols, rows){
  for (let y = 0; y < cols; y++){
    grid.push([]);
    for (let x = 0; x < rows; x++){
      grid[y].push(0);
    }
  }
}

function displayGrid(grid,x,y,color,theImage,cellSize){
  for(y = 0; y < grid.length; y++){
    for (x = 0 < grid[y].length; x++){
      //if thing isnt an image display it with color and rect
      if(theImage = false){
        fill(color);
        rect(x*cellSize,y*cellSize,cellSize,cellSize);
      }
      else{
        image(theImage,x*cellSize,y*cellSize,cellSize,cellSize);
      }
    }
  }
}