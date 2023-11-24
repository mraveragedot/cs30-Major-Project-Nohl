// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//making variables
let FarmGrid = [];
let direction = [1,1];
let grass, farmCellSize, player, merchant, farmer; 

const FARMCELLW = 40;
const FARMCELLH = 20;

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
  createEmptyGrid(FarmGrid,FARMCELLH,FARMCELLW);
  player = new Player(width/2, height/2, farmer);
}


//main draw loop
function draw() {
  background(220);
  backdrop();
  displayFarmGrid(FarmGrid,0,height/2,"red",grass,farmCellSize);
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
function createEmptyGrid(grid,cols, rows){
  for (let y = 0; y < cols; y++){
    grid.push([]);
    for (let x = 0; x < rows; x++){
      grid[y].push(0);
    }
  }
}

//displaying the farm plots 
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