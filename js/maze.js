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
let startXCoor;
let startYCoor;
let endXCoor;
let endYCoor;
let isMouseDown = false;
let activePlayId = null;
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
    // drawMaze(maze,nodes);
}
function clearPop(node){
    // nodes
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
    let dijkstra = new Dijkstra(nodes, graph);
    dijkstra.initiate();
    // activePlayId = setInterval(loop, 300);
}



function pause(){
    clearInterval(activePlayId);
}

function loop(){
    console.log('looping');
    drawMaze(maze, nodes);
}