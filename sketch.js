// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let FarmGrid = [];
let direction = [1,1];
let grass, farmCellSize, player, merchant, farmer; 

const FARMCELLW = 40;
const FARMCELLH = 20;

function preload(){
  farmer = loadImage("Farmer.png");
  merchant = loadImage("merchant.png");
  grass = loadImage("Grass.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  farmCellSize = width/FARMCELLW;
  createEmptyGrid(FarmGrid,FARMCELLH,FARMCELLW);
  player = new Player(width/2, height/2, farmer);
}

function draw() {
  background(220);
  backdrop();
  displayFarmGrid(FarmGrid,0,height/2,"red",grass,farmCellSize);
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

function displayFarmGrid(grid,theX,theY,color,theImage,cellSize){
  for(let y = 0; y < grid.length; y++){
    for (let x = 0; x < grid[y].length; x++){
      //if thing isnt an image display it with color and rect
      if(theImage === false){
        fill(color);
        rect(x*cellSize + theX,y*cellSize + theY,cellSize,cellSize);
      }
      else{
        image(theImage,x*cellSize + theX,y*cellSize + theY,cellSize,cellSize);
        
      }
    }
  }
}