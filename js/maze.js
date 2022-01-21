// import Graph from "./graph";
// const Graph = require('./graph') 
const NodeValue = {
    START: 'start',
    END: 'end',
    UNVISITED: 'unvisited',
    VISITED: 'visited',
    WALL: 'wall',
    PATH: 'path'
}
class Node{

    constructor(row, col, nodeValue, id) {
        this.row = row;
        this.col = col;
        this.value = nodeValue;
        this.id = id;
    }

}

let graph;
let nodes = [];
let startNode;
let endNode;
let startXCoor;
let startYCoor;
let endXCoor;
let endYCoor;
let isMouseDown = false;
let activePlayId = 69;
let algorithm; // holds the algorithm and iterations
const maze = document.querySelector('.maze');
window.onload = () => {
    generateMaze();
}
function mouseUp(){
    isMouseDown = false;
}
function mouseDown(){
    isMouseDown = true;
}
window.addEventListener('mousedown', mouseDown);
window.addEventListener('mouseup', mouseUp);
window.addEventListener('keypress', (e)=>{
    console.log(e);
    if(e.code === 'KeyS'){
        document.getElementById('radStart').setAttribute('checked', true);
    }
    else if(e.code === 'KeyE'){
        document.getElementById('radEnd').setAttribute('checked', true);
    }
    else if(e.code === 'KeyW'){
        document.getElementById('radWall').setAttribute('checked', true);
    }
    else if(e.code === 'KeyC'){
        document.getElementById('radNone').setAttribute('checked', true);
    }

});

//function to initialize maze and nodes
function generateMaze(){
    nodes = [];
    console.log('Generating maze...')
    let rowCount = document.getElementById("txtRow").value;
    let colCount = document.getElementById("txtCol").value;
    // let rowCount = 2; //25
    // let colCount = 3; //60
    let id = 0;
    //initialize nodes and push them to nodes array
    for(let i = 0 ; i < rowCount ; i++){
        let nodeRow = [];
        for(let j = 0; j < colCount ; j++){
            nodeRow.push(new Node(i,j,NodeValue.UNVISITED, id));
            id++;
        }
        nodes.push(nodeRow);
    }
    // draw maze after initialization
    drawMaze(maze,nodes);
    console.log('Maze done!');
}

//function to draw the maze based from nodes array
function drawMaze(mazeContainer, nodes){
    //reset maze
    mazeContainer.innerHTML = '';
    for(let i = 0; i < nodes.length; i++){
        for(let j = 0; j < nodes[i].length; j++){
            mazeContainer.append(drawNode(nodes[i][j]));
        }
        mazeContainer.append(document.createElement('br'));
    }
}

//function to draw each node
function drawNode(node){
    let newElement = document.createElement('span');
    newElement.className = `node ${node.value}`;
    
    newElement.setAttribute('onclick', `changeNode(this,${node.row}, ${node.col})`);
    newElement.setAttribute('onmouseenter', `changeNodeOnHover(this,${node.row}, ${node.col})`);
    newElement.setAttribute('id', node.id);
    // newElement.setAttribute('onmouseup', 'mouseUp');
    // newElement.addEventListener('mouseenter', changeNodeOnHover(node.row, node.col))
    return newElement;
}

//function for editing maze on click event
function changeNode(node,row,col){
    let nodeValue = nodes[row][col].value;
    let isStart = document.getElementById('radStart').checked
    let isEnd = document.getElementById('radEnd').checked
    let isWall = document.getElementById('radWall').checked
    let isNone = document.getElementById('radNone').checked
    node.classList.add('popup');
    
    if(isStart){
        //check if a start node is already placed
        if(startXCoor != null && startYCoor != null){
            //if placed, reset current start node
            swapNodeClass(document.querySelector('.start'), NodeValue.START, NodeValue.UNVISITED);
            nodes[startYCoor][startXCoor].value = NodeValue.UNVISITED;
            
        }
        //place coordinates of start node
        startYCoor = row;
        startXCoor = col; 
        swapNodeClass(node, nodes[row][col].value, NodeValue.START);
        nodes[row][col].value = NodeValue.START;
        startNode = node.getAttribute('id');
        // node.classList.add('start');

    }else if(isEnd){
        //check if an end node is already placed
        if(endXCoor != null && endYCoor != null){
            //if placed, reset current end node
            swapNodeClass(document.querySelector('.end'), NodeValue.END, NodeValue.UNVISITED);
            nodes[endYCoor][endXCoor].value = NodeValue.UNVISITED;
        }
        endYCoor = row;
        endXCoor = col;
        swapNodeClass(node, nodes[row][col].value, NodeValue.END);
        nodes[row][col].value = NodeValue.END;
        endNode = node.getAttribute('id');
    }else if(isWall){
        //check if clicked node is start or end node
        if(startYCoor == row && startXCoor == col){
            startYCoor = null;
            startXCoor = null;
            startNode = null;
        }
        if(endYCoor == row && endXCoor == col){
            endYCoor = null;
            endXCoor = null;
            endNode = null;
        }
        swapNodeClass(node, nodes[row][col].value, NodeValue.WALL);
        nodes[row][col].value = NodeValue.WALL;
    }else if(isNone){
        if(startYCoor == row && startXCoor == col){
            startYCoor = null;
            startXCoor = null;
            startNode = null;
        }
        if(endYCoor == row && endXCoor == col){
            endYCoor = null;
            endXCoor = null;
            endNode = null;
        }
        swapNodeClass(node, nodes[row][col].value, NodeValue.UNVISITED);
        nodes[row][col].value = 'unvisited';
    }
    setTimeout(clearPop, 500, node)
    // drawMaze(maze,nodes);
}
//used for animation. removing popup class to avoid redrawing of popup effect
function clearPop(node){
    node.classList.remove('popup');
}
function swapNodeClass(node, current, newClass){
    node.classList.remove(current);
    node.classList.add(newClass);
}
//function for editing maze on hold mouse event
function changeNodeOnHover(node, row, col){
    if(!isMouseDown){
        return;
    }
    let nodeValue = nodes[row][col].value;
    let isStart = document.getElementById('radStart').checked
    let isEnd = document.getElementById('radEnd').checked
    let isWall = document.getElementById('radWall').checked
    let isNone = document.getElementById('radNone').checked
    node.classList.add('popup');
    
    if(isStart){
        //check if a start node is already placed
        if(startXCoor != null && startYCoor != null){
            //if placed, reset current start node
            swapNodeClass(document.querySelector('.start'), NodeValue.START, NodeValue.UNVISITED);
            nodes[startYCoor][startXCoor].value = NodeValue.UNVISITED;
            
        }
        //place coordinates of start node
        startYCoor = row;
        startXCoor = col; 
        swapNodeClass(node, nodes[row][col].value, NodeValue.START);
        nodes[row][col].value = NodeValue.START;
        // node.classList.add('start');

    }else if(isEnd){
        //check if an end node is already placed
        if(endXCoor != null && endYCoor != null){
            //if placed, reset current end node
            swapNodeClass(document.querySelector('.end'), NodeValue.END, NodeValue.UNVISITED);
            nodes[endYCoor][endXCoor].value = NodeValue.UNVISITED;
        }
        endYCoor = row;
        endXCoor = col;
        swapNodeClass(node, nodes[row][col].value, NodeValue.END);
        nodes[row][col].value = NodeValue.END;
    }else if(isWall){
        //check if clicked node is start or end node
        if(startYCoor == row && startXCoor == col){
            startYCoor = null;
            startXCoor = null;
        }
        if(endYCoor == row && endXCoor == col){
            endYCoor = null;
            endXCoor = null;
        }
        swapNodeClass(node, nodes[row][col].value, NodeValue.WALL);
        nodes[row][col].value = NodeValue.WALL;
    }else if(isNone){
        if(startYCoor == row && startXCoor == col){
            startYCoor = null;
            startXCoor = null;
        }
        if(endYCoor == row && endXCoor == col){
            endYCoor = null;
            endXCoor = null;
        }
        swapNodeClass(node, nodes[row][col].value, NodeValue.UNVISITED);
        nodes[row][col].value = 'unvisited';
    }
    setTimeout(clearPop, 500, node)
}

function play(){
    
    graph = new Graph(nodes);
    console.log(graph);
    console.table(graph.edges);
    algorithm = new Dijkstra(nodes, graph, startNode, endNode);
    algorithm.initiate();
    // setTimeout(1000);
    activePlayId = setInterval(next,10);
    console.log(activePlayId)
    
}

// function play(){
//     activePlayId = algorithm.play();

// }
function next(){
    algorithm.next();
}


function pause(){
    clearInterval(activePlayId);
}

function loop(){
    // console.log('looping');
    drawMaze(maze, nodes);
}