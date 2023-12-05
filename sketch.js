// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//making variables
let farmGrid = [];
let direction = [1,1];
let soil, wateredSoil, carrotSeeds ,carrot, grass, farmCellSize, player, merchant, farmer; 

const FARMCELLW = 40;
const FARMCELLH = 10;

//turning images and sounds into variabes
function preload(){
  farmer = loadImage("Farmer.png");
  merchant = loadImage("merchant.png");
  grass = loadImage("Grass.png");
  soil = loadImage("soil.png");
  wateredSoil = loadImage("watered-soil.png");
  carrotSeeds = loadImage("carrot-seeds.png");
  carrot =loadImage("carrot.png");
}

//creating cell sizes and grides for farming plots
function setup() {
  createCanvas(windowWidth, windowHeight);
  farmCellSize = width/FARMCELLW;
  createEmptyFarmGrid(farmGrid,FARMCELLH,FARMCELLW);
  player = new Player(width/2, height/2, farmer);
}


//main draw loop
function draw() {
  background(220);
  backdrop();
  displayFarmGrid(farmGrid,0,height - FARMCELLH * farmCellSize,farmCellSize);
  player.display();
  player.moveCharacter();
  rect(100,100,100,100);
  circle(player.x,player.y+player.height/2, 5);

  
}
function keyPressed(){
  interactionWithFarm();
}

//the player character object 
class Player{
  constructor(x,y,theImage){
    this.x = x;
    this.y = y;
    this.dx = 2;
    this.dy = 2;
    this.height = farmCellSize;
    this.width = farmCellSize;

    this.myImage = theImage;
  }

  display(){
    // looking to see if im moving left or right 
    if(direction[0] === 1){
      // if moving right draw image normally
      imageMode(CENTER);
      image(this.myImage,this.x, this.y, farmCellSize, farmCellSize);
    }
    else{
      // if walking left or just stopped walking left mirror the image so facing left
      push();
      imageMode(CENTER);
      scale(direction);
      image(this.myImage, -this.x, this.y, farmCellSize, farmCellSize);
      pop();
    }
    imageMode(CORNER);
  }

  moveCharacter(){
    //making it so the image will turn left if walking left and moving character when pressing wasd and checking to make sure 
    //that they dont walk off edge
    if (keyIsDown(65) && this.x - this.dx >= 0 + this.width /2) {  //left
      this.x -= this.dx;
      direction = [-1,1];
    }
  
    if (keyIsDown(68) && this.x + this.dx <= width - this.width /2) {//right
      this.x += this.dx;
      direction = [1,1];

    }
  
    if (keyIsDown(87) && this.y - this.dy >= 0 + this.height/ 2) { //up
      this.y -= this.dy;

    }
  
    if (keyIsDown(83) && this.y + this.dy <= height - this.height / 2) { //down
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
      else if (grid[y][x][0] === 1){ //one in the zero position means tilled
        image(soil,x*cellSize + theX,y*cellSize + theY,cellSize,cellSize);
      }
      else if(grid[y][x][0] === 2){ //two in the zero position means its watered
        image(wateredSoil,x*cellSize + theX,y*cellSize + theY,cellSize,cellSize);
      }
      if (grid[y][x][1] === 1){ //one in the one position means carrot seeds
        image(carrotSeeds,x*cellSize + theX,y*cellSize + theY,cellSize,cellSize);
      }
      if (grid[y][x][2] === 1){ // one in the two position means its a grown carrot carrot 
        image(carrot,x*cellSize + theX,y*cellSize + theY,cellSize,cellSize);
      }
    }
  }
}

function interactionWithFarm(){

  // turning player position into a grid position
  let offset;
  let y = Math.floor((player.y - (height - FARMCELLH * farmCellSize,farmCellSize)) / farmCellSize ) - floor(height/farmCellSize - farmGrid.length) + 1;
  if (direction[0] === -1){ // make sure your interaction with the plot your looking
    offset = -1;
  }
  else{
    offset = 1;
  }
  let x = Math.floor(player.x / farmCellSize + offset) - floor(width/farmCellSize - farmGrid[0].length);
  
  if (key === " "){
    //catching edge cases
    if (x >= 0 && x < 40 && (y >= 0 && y < 10)){
      farmGrid[y][x][0] = 1;
      
    }
  }
  
  // whats happeneing based on tool held
  
  console.log(y,x);
}