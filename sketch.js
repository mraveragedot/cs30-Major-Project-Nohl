// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//making variables
let FarmGrid = [];
let direction = [1,1];
let farmCellH, grass, farmCellSize, player, merchant, farmer; 

const FARMCELLW = 40;
const FARMCELLH = 10;

//turning images and sounds into variabes
function preload(){
  farmer = loadImage("Farmer.png");
  merchant = loadImage("merchant.png");
  grass = loadImage("Grass.png");
}

//creating cell sizes and grides for farming plots
function setup() {
  createCanvas(windowWidth, windowHeight);
  farmCellSize = width/FARMCELLW;
  createEmptyFarmGrid(FarmGrid,FARMCELLH,FARMCELLW);
  player = new Player(width/2, height/2, farmer);
}


//main draw loop
function draw() {
  background(220);
  backdrop();
  displayFarmGrid(FarmGrid,0,height - FARMCELLH * farmCellSize,farmCellSize);
  player.display();
  player.moveCharacter();
  rect(100,100,100,100);
  
}

//the player character object 
class Player{
  constructor(x,y,theImage){
    this.x = x;
    this.y = y;
    this.dx = 5;
    this.dy = 5;

    this.myImage = theImage;
  }

  display(){
    // looking to see if im moving left or right 
    if(direction[0] === 1){
      // if moving right draw image normally
      imageMode(CENTER);
      image(this.myImage,this.x, this.y, 90, 90);
    }
    else{
      // if walking left or just stopped walking left mirror the image so facing left
      push();
      imageMode(CENTER);
      scale(direction);
      image(this.myImage, -this.x, this.y, 90, 90);
      pop();
    }
    imageMode(CORNER);
  }

  moveCharacter(){
    //making it so the image will turn left if walking left and moving character when pressing wasd and checking to make sure 
    //that they dont walk off edge
    if (keyIsDown(65) && this.x - this.dx >= 0 + farmer.width/8) { 
      this.x -= this.dx;
      direction = [-1,1];
    }
  
    if (keyIsDown(68) && this.x + this.dx <= width - farmer.width/8) {
      this.x += this.dx;
      direction = [1,1];

    }
  
    if (keyIsDown(87) && this.y - this.dy >= 0 + farmer.height/4) {
      this.y -= this.dy;

    }
  
    if (keyIsDown(83) && this.y + this.dy <= height - farmer.height/4) {
      this.y += this.dy;

    }

  }
}

// creating the background (everything besides the farm plot)
function backdrop(){
  imageMode(CORNER);
  image(merchant, width / 16*14,0, 100,100);
}

//creating any empty grid by putting in the grid im changing and how many squares left and right
function createEmptyGrid(grid,cols,rows){
  for (let y = 0; y < cols; y++){
    grid.push([]);
    for (let x = 0; x < rows; x++){
      grid[y].push(0);
    }
  }
}

function createEmptyFarmGrid(grid,cols,rows){
  for (let y = 0; y < cols; y++){
    grid.push([]);
    for (let x = 0; x < rows; x++){
      grid[y].push([0,0,0]);
    }
  }
}




//displaying the farm plots 
function displayFarmGrid(grid,theX,theY,cellSize){
  for(let y = 0; y < grid.length; y++){
    for (let x = 0; x < grid[y].length; x++){
      //normal grass
      if (grid[y][x][0] === 0){ //zero in zero position means its just normal grass
        image(grass,x*cellSize + theX,y*cellSize + theY,cellSize,cellSize);
      }
      if (grid[y][x][0] === 1){ //one in the first position means tilled
        image(grass,x*cellSize + theX,y*cellSize + theY,cellSize,cellSize);
      }
      if (grid[y][x][1] === 1){ //one in the 1 position means its watered
        image(grass,x*cellSize + theX,y*cellSize + theY,cellSize,cellSize);
      }
      if (grid[y][x][2] === 1){ //one in the 2 position means seeded
        image(grass,x*cellSize + theX,y*cellSize + theY,cellSize,cellSize);
      }
    }
  }
}