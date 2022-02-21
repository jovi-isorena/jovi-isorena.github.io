// import Graph from "./graph";
// const Graph = require('./graph') 
const Algorithm = {
    DIJKSTRA: 1,
    DFS: 2,
    ASTAR: 3
}
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
let endFound = false;
let endPathFound = false;
let recursive;
let path = [];
//
let toVisit = [];
let visited = [];
let playSpeed;
let playing = false;
//
let algorithm; // holds the algorithm and iterations
const maze = document.querySelector('.maze');
const speedRange = document.querySelector('#playSpeed');

speedRange.addEventListener('change', (e) => {
    playSpeed = 10 / (e.target.value/100)
    console.log(e.target.value, playSpeed);

})
window.onload = () => {
    generateBlankMaze();
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
function generateBlankMaze(){
    resetAll();
    showControls();
    nodes = [];
    console.log('Generating blank maze...')
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

function generateMaze(){
    resetAll();
    showControls();
    nodes = [];
    maze.innerHTML = '';
    console.log('Generating maze...')
    let rowCount = parseInt(document.getElementById("txtRow").value);
    let colCount = parseInt(document.getElementById("txtCol").value);
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
    recursive = new RecursiveBacktracking(nodes);
    let adjacencyList = recursive.createMaze();
    // console.log("Generated Adjacency List:");
    // console.table(adjacencyList);
    // console.log(nodes)
    
    drawMaze(maze,nodes);
    // if(document.querySelector("#showMazeAnimation").checked){
        id = 0;
        for(let i = 0 ; i < rowCount ; i++){
            for(let j = 0; j < colCount ; j++){
                swapNodeClass(document.getElementById(`${id}`), NodeValue.UNVISITED, NodeValue.WALL);
                nodes[i][j].value = NodeValue.WALL;
                id++;
            }
        }
        toVisit.push(0);
        caveIn(adjacencyList, colCount);
    // }
    // else{

    // }

    // while(toVisit.length > 0){
    //     visiting = toVisit.pop();
    //     visited.push(visiting);
    //     // console.log('Visiting: ' + visiting);
    //     toVisit.push(...(adjacencyList[visiting]).filter(edge => visited.indexOf(edge) === -1));
    //     // console.log('Update toVisit list: ');
    //     // console.log(toVisit);
    //     swapNodeClass(document.getElementById(visiting), NodeValue.WALL, NodeValue.UNVISITED);
    //     let r = Math.floor(visiting / rowCount); 
    //     let c = visiting % rowCount;
    //     nodes[r][c].value = NodeValue.UNVISITED;
    // }
    
}


function caveIn(adjacencyList, colCount){
    if(toVisit.length === 0){
        pause();
    }
    let visiting = toVisit.pop();
    visited.push(visiting);
    toVisit.push(...(adjacencyList[visiting]).filter(edge => visited.indexOf(edge) === -1));
    swapNodeClass(document.getElementById(visiting), NodeValue.WALL, NodeValue.UNVISITED);
    let r = Math.floor(visiting / colCount); 
    let c = visiting % colCount;
    nodes[r][c].value = NodeValue.UNVISITED;
    setTimeout(clearPop, 500, document.getElementById(`${visiting}`));
    setTimeout(caveIn, playSpeed, adjacencyList, colCount);

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
    newElement.setAttribute('onmouseover', `changeNodeOnHover(this,${node.row}, ${node.col})`);
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
    setTimeout(clearPop, 500, node);
    // drawMaze(maze,nodes);
}
//used for animation. removing popup class to avoid redrawing of popup effect
function clearPop(node){
    node.classList.remove('popup');
}
function swapNodeClass(node, current, newClass){
    node.classList.remove(current);
    node.classList.add(newClass);
    node.classList.remove('popup');
    node.classList.add('popup');
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
    document.querySelector("#play-btn").style.display = "none";
    document.querySelector("#pause-btn").style.display = "inline-block";

    if(graph === null){
        graph = new Graph(nodes);
        // console.log(graph);
        // console.table(graph.edges);
        // algorithm = new Dijkstra(nodes, graph, startNode, endNode);
        switch (parseInt(document.querySelector('#algorithmMenu').value)) {
            case Algorithm.DIJKSTRA:
                algorithm = new Dijkstra(nodes, graph, startNode, endNode);
                break;
            case Algorithm.DFS:
                algorithm = new DFS(nodes, graph, startNode, endNode);
                break;
            case Algorithm.ASTAR:
                algorithm = new AStar(nodes, graph, startNode, endNode);
                break;
            
        }
        algorithm.initiate();
    }

    playing = true;
    // setTimeout(1000);
    // activePlayId = setInterval(next,playSpeed);
    // if(!endFound){
        loop();
    // }
    // else{
    //     displayPath();
    // }
    // console.log(activePlayId)
    
}

function loop(){
    if(!endFound){
        algorithm.next();
        if(playing) setTimeout(loop, playSpeed);
    }else{
        displayPath();
    }
    
}

function next(){
    // if(!playing) return;

    if(!endFound){
        algorithm.next();
    }else{
        displayPath();
    }
    
}




function pause(){
    // clearInterval(activePlayId);
    document.querySelector("#pause-btn").style.display = "none";
    document.querySelector("#play-btn").style.display = "inline-block";
    playing = false;
}

function displayPath(){
    if(path.length == 0){
        pause();
        // clearTimeout(latestTimeoutForPath);
        return;
    }
    let currentPathNode = path.pop();
    swapNodeClass(document.getElementById(`${currentPathNode}`), NodeValue.VISITED, NodeValue.PATH);
    setTimeout(clearPop, 500, document.getElementById(`${currentPathNode}`));
    if(playing){
        setTimeout(displayPath, playSpeed);

    }
    else{
        pause();
    }

}

function resetAll(){
    // hideControls();
    graph = null;
    nodes = [];
    if(startNode !== null){
        startNode = null;
        startXCoor = null;
        startYCoor = null;
    }
    if(endNode !== null){
        endNode = null;
        endXCoor = null;
        endYCoor  = null;
    }
    if(activePlayId !== null){
        clearInterval(activePlayId);
        activePlayId = null;
    }
    recursive = null;
    path = [];
    toVisit = [];
    visited = [];
    endFound = false;
    endPathFound = false;
    playing = false;
    maze.innerHTML = ''
}

function resetMaze(){
    
    if(startNode !== null){
        // document.getElementById(startNode).classList.remove(NodeValue.START);
        swapNodeClass(document.getElementById(startNode), NodeValue.START, NodeValue.UNVISITED)
        startNode = null;
        startXCoor = null;
        startYCoor = null;
    }
    if(endNode !== null){
        // document.getElementById(endNode).classList.remove(NodeValue.END);
        swapNodeClass(document.getElementById(endNode), NodeValue.END, NodeValue.UNVISITED)
        endNode = null;
        endXCoor = null;
        endYCoor  = null;
    }
    document.querySelectorAll(`.${NodeValue.PATH}`).forEach( pathNode => {swapNodeClass(pathNode, NodeValue.PATH, NodeValue.UNVISITED); pathNode.classList.remove('popup');})
    document.querySelectorAll(`.${NodeValue.VISITED}`).forEach( pathNode => {swapNodeClass(pathNode, NodeValue.VISITED, NodeValue.UNVISITED); pathNode.classList.remove('popup');})
    if(activePlayId !== null){
        clearInterval(activePlayId);
        activePlayId = null;
    }
    endFound = false;
    endPathFound = false;
    playing = false;
    // recursive = null;
    path = [];

    
}

function showControls(){
    // document.querySelector('.mazeControl').style.height = '100%'
    // document.querySelector('.mazeControl').style.display = 'block'
        
}
function hideControls(){
    // document.querySelector('.mazeControl').style.height = '0'
    // document.querySelector('.mazeControl').style.display = 'none'
    
}