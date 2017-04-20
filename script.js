var canvas = document.getElementById('demo');
var ctx = canvas.getContext('2d');

var MAZE_HEIGHT = 25;
var MAZE_WIDTH = 25;
var grid = [];
var BLOCK_SIZE = 20;

var visited = [];
var traceback = [];
var altTraceback = [];
var neighbors = [];

var nextNode = [];
var prevNode = [];
var startNode = [];
var currentNode = [];
var wallNode = [];

var startX;
var startY;


function Coordinate(x, y) {
    this.x = x;
    this.y = y;
}

//push to visited, traceback, & altTraceback
function pushToArrays(node){
    visited.push(node);
    traceback.push(node);
    altTraceback.push(node);
}

function drawSquare(x, y, r, g, b){
    ctx.fillStyle = "rgb(" + r + ", " + g + " , " + b + ")";
    ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE); 
}

function newMaze(MAZE_WIDTH, MAZE_HEIGHT){
    for (var i = 0; i < MAZE_WIDTH; i++){
        grid[i] = [];
        for(var j = 0; j < MAZE_HEIGHT; j++){
            grid[i][j] = 1;
            if(i % 2 && j % 2){
               grid[i][j] = 0;
            }
        }
    }
}

function colorMaze(MAZE_WIDTH, MAZE_HEIGHT, startNode){
    newMaze(MAZE_WIDTH, MAZE_HEIGHT);
    grid[startNode.x][startNode.y] = 2;
    
     for(var y = 0; y < MAZE_HEIGHT; y++){
        for(var x = 0; x < MAZE_WIDTH; x++){
            if(grid[x][y] == 1){
                drawSquare(x * BLOCK_SIZE, y * BLOCK_SIZE, x * 10, 255, y * 10); 
            }
            if(grid[x][y] == 2){
                drawSquare(x * BLOCK_SIZE, y * BLOCK_SIZE, 50, 219, 121);
            }
        }
    }
}

//find start
function findStart(){
    startX = (Math.floor(Math.random() * (MAZE_HEIGHT - 1)/2)*2) + 1; 
    startY= (Math.floor(Math.random() * (MAZE_WIDTH - 1)/2)*2) + 1;     
    
    startNode = new Coordinate(startX, startY);
    currentNode = startNode;

    //console.log(currentNode);
    
    pushToArrays(currentNode);
    colorMaze(MAZE_WIDTH, MAZE_HEIGHT, startNode);

}

//find valid neighbors
function findNeighbors(){
    var above = new Coordinate(currentNode.x, currentNode.y - 2);
    var right = new Coordinate(currentNode.x + 2, currentNode.y);
    var below = new Coordinate(currentNode.x, currentNode.y + 2);
    var left = new Coordinate(currentNode.x - 2, currentNode.y);

    //console.log(above, right, below, left);
   
    //check if within bounds and if in traceback
    if(above.x > 0 && above.x < MAZE_WIDTH && above.y > 0 && above.y < MAZE_HEIGHT){
        neighbors.push(above);
        if(isInVisited(above)){
            neighbors.pop();
        }
        traceback.push(above);
        altTraceback.push(above);

       // console.log("above");
        //console.log(neighbors);
    }
    if(right.x > 0 && right.x < MAZE_WIDTH - 1 && right.y > 0 && right.y < MAZE_HEIGHT){
        neighbors.push(right);
        if(isInVisited(below)){
            neighbors.pop();
        }

        traceback.push(right);
        altTraceback.push(right);
        
      //console.log("right");
        //console.log(neighbors);
    }
    if(below.x > 0 && below.x < MAZE_WIDTH && below.y > 0 && below.y < MAZE_HEIGHT - 1){
        neighbors.push(below);
        if(isInVisited(below)){
            neighbors.pop();
        }
        traceback.push(below);
        altTraceback.push(below);

        //console.log("below");
        //console.log(neighbors);
    }
    if(left.x > 0 && left.x < MAZE_WIDTH && left.y > 0 && left.y < MAZE_HEIGHT){
        neighbors.push(left);
         if(isInVisited(left)){
            neighbors.pop();
        }
        traceback.push(left);
        altTraceback.push(left);

        //console.log("left");
        //console.log(neighbors);
    }

    //console.log("neighbors: ");
    //console.log(neighbors);
    return neighbors;
}

//check if in traceback
function isInTraceback(node){
    for(var i = 0; i < traceback.length; i++){
        if(traceback[i] == node){
            return true;
        }
        else{
            return false;
        }
    }
}

//check if inVisited
function isInVisited(node){
     for(var i = 0; i < visited.length; i++){
        if(visited[i] == node){
            return true;
        }
        else{
            return false;
        }
    }
}

//randomize direction to move in
function randomizeDirection(){
    neighbors = findNeighbors();

    if(neighbors.length > 0){
        nextNode = neighbors[Math.floor(Math.random() * neighbors.length)];
        if(isInVisited(nextNode)){
            randomizeDirection();
        } else{
            prevNode = currentNode;
            currentNode = nextNode;

            pushToArrays(prevNode);
            pushToArrays(nextNode);
        
            //console.log(prevNode);
            //console.log(nextNode);
        }
    }
}

function findWallNode(){
    var tempX = (nextNode.x - prevNode.x)/2;
    var tempY = (nextNode.y - prevNode.y)/2;

    var wallX = prevNode.x + tempX;
    var wallY = prevNode.y + tempY;

    wallNode = new Coordinate(wallX, wallY);
    pushToArrays(wallNode);

    drawSquare(wallNode.x * BLOCK_SIZE, wallNode.y * BLOCK_SIZE, 0, 0, 0);
}

//move in random direction
function drawNextNode(){
    randomizeDirection();
    findWallNode();
    console.log(wallNode);
    console.log(currentNode);
    console.log(nextNode);
    drawSquare(currentNode.x * BLOCK_SIZE, currentNode.y * BLOCK_SIZE, 0, 0, 0);

    neighbors = [];
    console.log(neighbors);
    //console.log("draw next nodes");
    //console.log(prevNode);
    //console.log(nextNode);
}

//call drawPath in loop
function createMaze(){
    findStart();
    for(var i = 0; i < 10; i++){
        drawNextNode();
    }
    //drawNextNode();
}

//findStart();
//randomizeDirection();
//drawNextNode();

createMaze();