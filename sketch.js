// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//making variables
let merchantArray = [["hoe", "wateringCan", ["carrotSeeds", 1], 0]];
let items = [];
let openInventory = [false, true];
let inventoryGrid = [];
let hotBar = [];
let farmGrid = [];
let direction = [1,1];
let holding = 0;
let mouseHolding = "";
let shouldMove = true;
let buildingArray = [];
let theDay = 0;
let gold = 15;
let backgroundPlay = false;
let grassBackground, hoeSound, wateringSound, plantingSound, carrotSound, backgroundMusic, sellingSound, merchantInventory, theMerchant, theHouse, house, inventory, emptyInventory, theSelect, selected, hoe, wateringCan, soil, wateredSoil, carrotSeeds ,carrot, grass, hotBarSize, farmCellSize, player, merchant, farmer; 

const FARMCELLW = 40;
const FARMCELLH = 10;

//turning images and sounds into variabes
function preload(){
  hoeSound = loadSound("assets/stepstone_2.wav");
  plantingSound = loadSound("assets/stepdirt_1.wav");
  carrotSound = loadSound("assets/pop.ogg");
  backgroundMusic = loadSound("assets/TownTheme.mp3");
  sellingSound = loadSound("assets/1_Coins.ogg");
  wateringSound = loadSound("assets/splash2.wav");

  grassBackground = loadImage("assets/grassbackground.png");
  house = loadImage("assets/house.png");
  theSelect = loadImage("assets/select.png");
  emptyInventory = loadImage("assets/empty-inventory.png");
  selected = loadImage("assets/selected.png");
  wateringCan = loadImage("assets/watering-can.png");
  hoe = loadImage("assets/hoe.png");
  farmer = loadImage("assets/Farmer.png");
  merchant = loadImage("assets/merchant.png");
  grass = loadImage("assets/Grass.png");
  soil = loadImage("assets/soil.png");
  wateredSoil = loadImage("assets/watered-soil.png");
  carrotSeeds = loadImage("assets/carrot-seeds.png");
  carrot = loadImage("assets/carrot.png");
}

//creating cell sizes and grides for farming plots
function setup() {
  items = [["hoe", hoe],["carrotSeeds", carrotSeeds, 1], ["wateringCan", wateringCan], ["carrot", carrot, 1]];
  createEmptyGrid(inventoryGrid, 5,5,1);
  createCanvas(windowWidth, windowHeight);
  farmCellSize = width/FARMCELLW;
  createEmptyFarmGrid(farmGrid,FARMCELLH,FARMCELLW);
  player = new Player(width/2, height/2, farmer);
  createEmptyGrid(hotBar,4,1,2);
  hotBarSize = farmCellSize*2;
  inventory = new StorageGrid(width/2,height/2,farmCellSize*1.5,emptyInventory,inventoryGrid);
  merchantInventory = new Store(width/2,height/2,farmCellSize*1.5,emptyInventory,merchantArray);
  hotBar[0][1] = "select";
  hotBar[1][1] = "hoe";
  hotBar[2][1] = "wateringCan";
  theHouse = new Home(width/2 - 50,0,house, 100, 100);
  buildingArray.push(theHouse);
  theMerchant = new Shop(width - 200, 0,merchant, 100, 100);
  buildingArray.push(theMerchant);
}


//main draw loop
function draw() {
  if(backgroundPlay && !backgroundMusic.isPlaying()){
    backgroundMusic.loop();
  }
  background(220);
  backdrop();
  displayFarmGrid(farmGrid,0,height - FARMCELLH * farmCellSize,farmCellSize);
  toolBar();
  theMerchant.hitbox();
  theHouse.hitbox();
  player.moveCharacter();
  player.display();

  if(merchantInventory.toggle){
    merchantInventory.moving();
  }
  if(merchantInventory.shouldDisplay){
    merchantInventory.display();
    merchantInventory.itemDisplay();
  }
  //merchantInventory.mouseItemDisplay();

  if(inventory.toggle){
    inventory.moving();
  }
  if(inventory.shouldDisplay){
    inventory.display();
    inventory.itemDisplay();
  }
  inventory.mouseItemDisplay();
  

  theHouse.display();
  theMerchant.display();
  theHouse.showNextDayScreen();

  fill(0);
  rectMode(CORNER);
  text("you have " + gold + " gold", hotBarSize, 10);
  fill("white");
}  

function keyPressed(){
  interactionWithFarm();

  if (key === "i"){
    inventory.shouldDisplay = !inventory.shouldDisplay;
    if(!inventory.shouldDisplay){
      inventory.x = width/2;
      inventory.y = height/2;
    }
  }
}

class Building{
  constructor(x, y, theImage, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.theImage = theImage;
    this.nextDayScreen = false;

    this.playerUp = [false, true];
    this.playerLeft = [false, true];
    this.playerRight  = [false, true];
    this.playerDown = [false, true];
  }

  display(){ // displays the image
    image(this.theImage,this.x, this.y, this.width, this.width);
  }

  hitbox(){ // the code here doesnt work that well just based on the questions im asking in my if statements if i have time i will come back to fix it
    //dont have a down questions because the only buildings will be on the top of the screen

    //checking to see if you hit wall (right side)
    if (this.playerRight[0] && player.x < this.x && player.dx * 2 + player.x > this.x && player.y < this.y + this.height){
      this.playerRight[1] = false;
    }
    //checking to see if you hit wall (left side)
    else if (this.playerLeft[0] && player.x > this.x + this.width && player.x - player.dx *2 < this.x + this.width && player.y < this.y + this.height){
      this.playerLeft[1] = false;
    }
    //checking to see if you hit wall (top side)
    else if (this.playerUp[0] && player.y > this.y + this.height && player.x > this.x && player.x < this.x + this.width && player.y - player.height/2 - player.dy * 2 < this.y + this.height){
      this.playerUp[1] = false;
    }
    
    // makes it if you move out of the check range that you dont run into invisible wall
    if (!this.playerRight[1] && !(player.y < this.y + this.height)){
      this.playerRight[1] = true;
    }
    if(!this.playerLeft[1] && !(player.y < this.y + this.height)){
      this.playerLeft[1] = true;
    }
    if (!this.playerUp[1] && !(player.x > this.x && player.x < this.x + this.width )){
      this.playerUp[1] = true;
    }
  }
}

class Home extends Building{
  nextDay(){

    let x = (this.x - mouseX)/this.width;
    let y = (this.y - mouseY) / this.height;

    if (x < 0 && y < 0 && x > -1 && y > -1){//click house make screen pop up
      this.nextDayScreen = true;
    }

    if(this.nextDayScreen){

      //looking if your in the yes box
      x = (width/2 - 50 - mouseX)/50;
      y = (height/2 - mouseY)/50;
      if(x > -0.5 && x < 0.5 && y > -0.5 && y < 0.5){
        theDay ++; 
        this.nextDayScreen = false;
        growCrops();
      }

      //looking if your in the no box
      x = (width/2 + 50 - mouseX)/50;
      y = (height/2 - mouseY)/50;
      if(x > -0.5 && x < 0.5 && y > -0.5 && y < 0.5){
        this.nextDayScreen = false;
      }

    }
  }

  
  showNextDayScreen(){ 
    if(this.nextDayScreen){
      rectMode(CENTER);
      fill(0);
      rect(width/2,height/2,200,100);
      fill("white");
      text("would you like to go to sleep?", width/2 - 75, height/2 - 30);
      fill("green");
      rect(width/2 - 50, height/2, 50,50);
      fill(0);
      text("yes",width/2 - 50, height/2, 50,50);
      fill("red");
      rect(width/2 + 50, height/2 , 50,50);
      fill(0);
      text("no", width/2 + 50, height/2 , 50,50);
      rectMode(CORNER);
      fill("white");
    
    }
  }
}

class Shop extends Building{
  shopClicked(){

    let x = (this.x - mouseX)/this.width;
    let y = (this.y - mouseY) / this.height;

    if (x < 0 && y < 0 && x > -1 && y > -1){
      merchantInventory.shouldDisplay = !merchantInventory.shouldDisplay;
      if(!merchantInventory.shouldDisplay){
        merchantInventory.x = width/2;
        merchantInventory.y = width/4;
      }
    }

  }
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
    
    if (keyIsDown(65) && this.x - this.dx >= 0 + this.width /2 && buildingArray[0].playerLeft[1] && buildingArray[1].playerLeft[1]) {  //left
      this.x -= this.dx;
      direction = [-1,1];
      for(let i = 0;i < buildingArray.length; i++){
        buildingArray[i].playerLeft[0] = true;
        buildingArray[i].playerRight[1] = true;

      }
    }
    else{
      for(let i = 0;i < buildingArray.length; i++){
        buildingArray[i].playerLeft[0] = false;
      }
    }
  
    if (keyIsDown(68) && this.x + this.dx <= width - this.width /2 && buildingArray[0].playerRight[1] && buildingArray[1].playerRight[1]) {//right
      this.x += this.dx;
      direction = [1,1];
      for(let i = 0;i < buildingArray.length; i++){
        buildingArray[i].playerRight[0] = true;
        buildingArray[i].playerLeft[1] = true;
      }
    }
    else{
      for(let i = 0;i < buildingArray.length; i++){
        buildingArray[i].playerRight[0] = false;
      }
    }

  
    if (keyIsDown(87) && this.y - this.dy >= 0 + this.height/ 2 && buildingArray[0].playerUp[1] && buildingArray[1].playerUp[1]) { //up
      this.y -= this.dy;
      for(let i = 0;i < buildingArray.length; i++){
        buildingArray[i].playerUp[0] = true;
        buildingArray[i].playerDown[1] = true;
      }
    }
    else{
      for(let i = 0;i < buildingArray.length; i++){
        buildingArray[i].playerUp[0] = false;
      }
    }

    if (keyIsDown(83) && this.y + this.dy <= height - this.height / 2 && buildingArray[0].playerDown[1]) { //down
      this.y += this.dy;
      for(let i = 0;i < buildingArray.length; i++){
        buildingArray[i].playerDown[0] = true;
        buildingArray[i].playerUp[1] = true;
      }
    }
    else{
      for(let i = 0;i < buildingArray.length; i++){
        buildingArray[i].playerDown[0] = false;
      }
    }

  }
}

// creating the background (everything besides the farm plot)
function backdrop(){
  imageMode(CORNER);
  image(grassBackground,0,0,width,height);
}

//creating any empty grid by putting in the grid im changing and how many squares left and right
function createEmptyGrid(grid,cols,rows,zeros){
  for (let y = 0; y < cols; y++){
    grid.push([]);
    for (let x = 0; x < rows; x++){
      for (let z = 0; z < zeros; z++){
        grid[y].push(0);
      }
    }
  }
}

function createEmptyFarmGrid(grid,cols,rows){
  for (let y = 0; y < cols; y++){
    grid.push([]);
    for (let x = 0; x < rows; x++){
      grid[y].push([0,0]);
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
      if (grid[y][x][1] === 2){ // two in the one position means its a grown carrot  
        image(carrot,x*cellSize + theX,y*cellSize + theY,cellSize,cellSize);
      }
    }
  }
}

function interactionWithFarm(){

  // turning player position into a grid position
  let offset;
  let y = Math.floor((player.y - (height - FARMCELLH * farmCellSize,farmCellSize)) / farmCellSize ) - floor(height/farmCellSize - farmGrid.length - 1); 
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
      // whats happeneing based on tool held
      if (hotBar[holding][1] === "hoe" && farmGrid[y][x][0] === 0){ // tills the ground
        farmGrid[y][x][0] = 1;
        hoeSound.play();
      }
      if (hotBar[holding][1] === "wateringCan" && farmGrid[y][x][0] === 1){ // waters tilled soil
        farmGrid[y][x][0] = 2;
        wateringSound.play();
      }
      if (hotBar[holding][1][0] === "carrotSeeds" && (farmGrid[y][x][0] === 1 || farmGrid[y][x][0] === 2) && farmGrid[y][x][1] === 0){ // plants seeds on tilled spoil
        farmGrid[y][x][1] = 1;
        plantingSound.play();
        hotBar[holding] = [1, ["carrotSeeds", hotBar[holding][1][1] - 1]]; // decreases number of carrots held and if its zero makes hotbar clear the carrots
        if (hotBar[holding][1][1]  < 1){
          hotBar[holding] = [1, 0];
        }
      }
      if (hotBar[holding][1] === "select" && farmGrid[y][x][1] === 2){ //picks up carrots
        farmGrid[y][x][1] = 0;
        moveCarrotToInventory(x,y); //puts carrots in inventory
        carrotSound.play();
      }


    }
  }
}

function toolBar(){
  for (let i = 0; i < hotBar.length; i ++){ //displaying what hotbar you are using
    if(hotBar[i][0] === 0){
      image(emptyInventory,0,0 + hotBarSize * i ,hotBarSize,hotBarSize);
    }
    else if(hotBar[i][0] === 1){
      image(selected,0,0 + hotBarSize * i,hotBarSize,hotBarSize);
    }
    if(hotBar[i][1] === "hoe"){
      image(hoe,0,0 + hotBarSize * i,hotBarSize,hotBarSize);
    }
    if(hotBar[i][1] === "select"){
      image(theSelect,0,0 + hotBarSize * i,hotBarSize,hotBarSize);
    }
    if(hotBar[i][1] === "wateringCan"){
      image(wateringCan,0,0 + hotBarSize * i,hotBarSize,hotBarSize);
    }
    if(hotBar[i][1][0] === "carrotSeeds"){
      image(carrotSeeds,0,0 + hotBarSize * i,hotBarSize,hotBarSize);
      text(hotBar[i][1][1],0,0 + hotBarSize * i + 10 );
    }
    if(hotBar[i][1][0] === "carrot"){
      image(carrot,0,0 + hotBarSize * i,hotBarSize,hotBarSize);
      text(hotBar[i][1][1],0,0 + hotBarSize * i - 10 );
    }

  }

}

function movingToolBarItems(){
  let x = floor(mouseX / hotBarSize);
  let y = floor(mouseY / hotBarSize);
  if(x >= 0 && x < 1 && y >= 0 && y < hotBar.length && mouseHolding[0] === "carrotSeeds" && hotBar[y][1][0] === "carrotSeeds"){
    hotBar[y] = [ hotBar[y][0],["carrotSeeds", hotBar[y][1][1] + mouseHolding[1]]];
    mouseHolding = "";
  }
  else if(x >= 0 && x < 1 && y >= 0 && y < hotBar.length && mouseHolding === "" && hotBar[y][1] !== 0 && hotBar[y][1] !== "select"){ // picking up something from hotBar
    mouseHolding = hotBar[y][1];
    hotBar[y][1] = 0;

  }
  else if (x >= 0 && x < 1 && y >= 0 && y < hotBar.length && (hotBar[y][1] === 0 || hotBar[y][1] === "")){// putting something down into hotbar
    hotBar[y][1] = mouseHolding;
    mouseHolding = "";
  }
  else{
    merchantInventory.movingItems();
  }
}


function mouseWheel(event) {
  if(event.delta < 0){ //scroll wheel go up so does holding
    holding --;
  }
  else{
    holding ++;
  }
  if(holding > hotBar.length - 1){ //wrapping from top to bottom
    holding = 0;
  }
  else if (holding < 0){ //wrapping bottom to top
    holding = 3;
  }

  for(let i = 0;i < hotBar.length; i ++){//unselecting all
    hotBar[i][0] = 0;
  }
  hotBar[holding][0] = 1; // selecting the right box
}

class StorageGrid{
  constructor(x, y, size, theImage, grid){
    this.x = x;
    this.y = y;
    this.size = size;
    this.theImage = theImage;
    this.grid = grid;
    this.shouldDisplay = false;

    this.width = size * grid.length;
    this.height = -size/5;
    this.xOffset = 0;
    this.yOffset = 0;
    this.toggle = false;
  }

  display(){
    for(let y = 0; y < this.grid.length; y++){
      for (let x = 0; x < this.grid[y].length; x++){
        image(this.theImage, this.x + this.size * x ,this.y + this.size * y,this.size,this.size);//drawing the empty squares
        rect(this.x,this.y,this.width,this.height); //drawing the white rectangle ontop
      }
    }
  }

  moving(){//making it so you can move inventory 
    if (mouseIsPressed){
      this.x = mouseX - this.xOffset;
      this.y = mouseY - this.yOffset;

    }
    if(!mouseIsPressed){
      this.toggle = false;
    }
  }

  itemDisplay(){ // displaying items in the grid 
    for(let y = 0; y < this.grid.length; y ++){
      for (let x = 0; x < this.grid[y].length; x++){
        for(let thing of items){
          // if(this.grid[y][x].length === 2){
          //   image(thing[1], this.x + this.size * x, this.y + this.size * y, this.size, this.size);
          //   text(thing[2], this.x + this.size * x,(this.y + this.size * y) + 10,);
          // }
          if(this.grid[y][x] === thing[0] || this.grid[y][x][0] === thing[0]){
            image(thing[1], this.x + this.size * x, this.y + this.size * y, this.size, this.size);
            if (Number.isInteger(this.grid[y][x][1])){
              text(this.grid[y][x][1],this.x + this.size * x, this.y + this.size * y + 10 );
            }

          }
        }
      }
    }
  }

  mouseItemDisplay(){ //if holding item print it at the mouse location
    imageMode(CENTER);
    if (mouseHolding !== ""){
      for(let thing of items){
        if(mouseHolding === thing[0] || mouseHolding[0] === thing[0]){
          image(thing[1],mouseX,mouseY, this.size, this.size);
        }
        if (Number.isInteger(mouseHolding[1])){
          text(mouseHolding[1],mouseX-this.size/2,mouseY-this.size/2 + 10);
        }
      }
    }

    imageMode(CORNER);
  }

  movingItems(){
    let x = floor((mouseX - this.x) / this.size);
    let y = floor((mouseY - this.y) / this.size);

    //if holding carrot seed and clicking another carrot seed stack them
    if(this.shouldDisplay && x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length && mouseHolding[0] === "carrotSeeds" && this.grid[y][x][0] === "carrotSeeds"){
      this.grid[y][x] = ["carrotSeeds", this.grid[y][x][1] + mouseHolding[1]];
      mouseHolding = "";
    }

    //if not holding somthing after clicked mouse pick it up 
    else if(this.shouldDisplay && x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length && mouseHolding === "" && this.grid[y][x] !== 0){
      mouseHolding = this.grid[y][x];
      this.grid[y][x] = 0;
    }
    //if holding something put it down
    else if (this.shouldDisplay && x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length && (this.grid[y][x] === 0 || this.grid[y][x] === "")){
      this.grid[y][x] = mouseHolding;
      mouseHolding = "";
    }
    else{
      movingToolBarItems();
    }
  }
}

class Store extends StorageGrid{

  movingItems(){
    let x = floor((mouseX - this.x) / this.size);
    let y = floor((mouseY - this.y) / this.size);
    // if holding carrot seeds and picking up more carrot seeds
    if(gold >= 5 && this.shouldDisplay && x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length && mouseHolding[0] === "carrotSeeds" && this.grid[y][x][0] === "carrotSeeds"){
      mouseHolding = ["carrotSeeds", mouseHolding[1] + 1];
      gold -= 5;
    }

    //if not holding somthing after clicked mouse pick it up 
    if(this.shouldDisplay && x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length && mouseHolding === "" && this.grid[y][x] !== 0){
      if(this.grid[y][x][0] === "carrotSeeds" && gold >= 5){
        mouseHolding = this.grid[y][x];
        gold -= 5;
      }
      else if (this.grid[y][x][0] !== "carrotSeeds"){
        mouseHolding = this.grid[y][x];
      }

      //this.grid[y][x] = 0;
    }
    //if holding something sell it 
    else if (this.shouldDisplay && x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length && (this.grid[y][x] === 0 || this.grid[y][x] === "")){
      if(mouseHolding[0] === "carrotSeeds"){
        gold += 5 * mouseHolding[1];
        sellingSound.play();
      }
      if (mouseHolding[0] === "carrot"){
        gold += 7 * mouseHolding[1];
        sellingSound.play();
      }
      mouseHolding = "";
    }
  }

}

function mousePressed(){
  if (inventory.shouldDisplay && (mouseX - inventory.x > 0 && mouseX - inventory.x < inventory.width) && (mouseY - inventory.y < 0 && mouseY - inventory.y > inventory.height)){//makes offset only once
    inventory.xOffset = mouseX - inventory.x; //if mouse is pressed in the inventory box set offset and toggle the movement on 
    inventory.yOffset = mouseY - inventory.y;  

    inventory.toggle = true;
  }

  if (merchantInventory.shouldDisplay && (mouseX - merchantInventory.x > 0 && mouseX - merchantInventory.x < merchantInventory.width) && (mouseY - merchantInventory.y < 0 && mouseY - merchantInventory.y > merchantInventory.height)){//makes offset only once
    merchantInventory.xOffset = mouseX - merchantInventory.x; //if mouse is pressed in the merchantInventory box set offset and toggle the movement on 
    merchantInventory.yOffset = mouseY - merchantInventory.y;  

    merchantInventory.toggle = true;
  }

  inventory.movingItems();

  theHouse.nextDay();
  theMerchant.shopClicked();

  backgroundPlay = true;
}

function growCrops(){ // goes through the farm grid and changes all watered and seeded tiles to carrots
  for(let y = 0; y < farmGrid.length;y++){
    for(let x = 0; x < farmGrid[y].length;x++){
      if (farmGrid[y][x][0] === 2 && farmGrid[y][x][1] === 1){
        farmGrid[y][x][0] = 1; //changing watered to dry
        farmGrid[y][x][1] = 2; // changing seeds to carrots
      }
      else if(farmGrid[y][x][0] === 1 && farmGrid[y][x][1] === 1){
        farmGrid[y][x][1] = 0; // change to untilled
      }
      else if(farmGrid[y][x][0] === 2){
        farmGrid[y][x][0] = 1; // change to dry
      }
      else if(farmGrid[y][x][0] === 1){
        farmGrid[y][x][0] = 0; // change to untilled
      }
      else if(farmGrid[y][x][1] === 2){
        farmGrid[y][x][0] = 1; // change to dry
      }

    }
  }

}

function moveCarrotToInventory(farmX, farmY){
  let placed = false;

  //checks if there are any carrots already in inventory
  for(let y = 0; y < inventoryGrid.length;y++){
    for(let x = 0; x < inventoryGrid[y].length;x++){
      if (inventoryGrid[y][x][0] === "carrot" && !placed){
        inventoryGrid[y][x] = ["carrot", inventoryGrid[y][x][1] + 1];
        farmGrid[farmY][farmX][1] = 0;
        placed = true;
        
      }
    }
  }
  //no previous carrots so puts it in first possible spot
  for(let y = 0; y < inventoryGrid.length;y++){
    for(let x = 0; x < inventoryGrid[y].length;x++){
      if (inventoryGrid[y][x] === "" || inventoryGrid[y][x] === 0 && !placed){
        inventoryGrid[y][x] = ["carrot", 1];
        farmGrid[farmY][farmX][1] = 0;
        placed = true;

      }
    }
  }
  //else do nothing
}