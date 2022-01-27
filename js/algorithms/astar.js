class AStar{
    constructor(nodes, graph, startNode, endNode){
        this.nodes = [];
        for (let i = 0; i < nodes.length; i++) {
            this.nodes.push(...nodes[i]);
        }
        this.graph = graph;
        this.startNode = parseInt(startNode);
        this.endNode = parseInt(endNode);
        this.vertices = [];
        this.intervalID;
        this.OpenNodes = [];
        this.ClosedNodes = [];
        this.currentNode;
    }

    initiate(){
        if(this.startNode == null && this.endNode == null){
            alert('No starting and ending point placed.');
            return;
        }
        else if(this.startNode == null){
            alert('No starting point placed.');
            return;
        }
        else if(this.endNode == null){
            alert('No ending point placed.');
            return;
        }
        let unvisited = []; //array for unvisited vertices;
        let visited = []; //aray for visited vertices;

        let nodes = this.nodes.map(node => { 
            return {
                id: node.id, 
                fcost: Infinity,
                gcost: Infinity,
                hcost: Infinity,
                parentNode: null,
                visited: false
            }
        });
        this.vertices = nodes;
        let startingNode = this.vertices.find(vertex => vertex.id == parseInt(this.startNode))
        startingNode.gcost = this.get_gcost(startingNode, startingNode, this.endNode);
        startingNode.hcost = this.get_hcost(startingNode, this.endNode);
        startingNode.fcost = startingNode.gcost + startingNode.hcost;
        
        this.OpenNodes.push(startingNode);
        // this.startNode = this.vertices.find(vertex => vertex.id == parseInt(this.startNode));
        // this.endNode = this.vertices.find(vertex => vertex.id == parseInt(this.endNode));
        // this.currentNode = this.startNode;
            // console.table(this.vertices);
    }


    iterate(){
        console.warn('Start of Iteration');
        // set current with the open node with least f cost
        this.OpenNodes = this.OpenNodes.sort((a,b) => b.fcost - a.fcost);
        console.log('OpenNodes:');
        console.table(this.OpenNodes);
        this.currentNode = this.OpenNodes.pop();
        console.log("Current node:")
        console.table(this.currentNode);
        swapNodeClass(document.getElementById(`${this.currentNode.id}`), NodeValue.UNVISITED, NodeValue.VISITED);
        this.ClosedNodes.push(this.currentNode.id);
        console.log("Closed nodes:")
        console.table(this.ClosedNodes);


        if(this.currentNode.id === this.endNode){
            console.log('End node found. Displaying path.')
            pause();
            this.setPath();
            // displayPath();
            activePlayId = setInterval(displayPath, 20);
        }
        
        let neighbors = this.graph.edges[this.currentNode.id];
        console.log("Neighbors of current:");
        console.log(neighbors);
        neighbors.forEach(neighbor => {
            if(this.ClosedNodes.indexOf(neighbor) !== -1 ){
                return;
            }
            let neighborNode = this.vertices.find(vertex => vertex.id === neighbor);
            let gcost = this.get_gcost(neighborNode, this.currentNode, this.endNode);
            let hcost = this.get_hcost(neighborNode, this.endNode);
            let fcost = gcost + hcost;
            console.log(`Calculated Cost of the current Node. GCost: ${gcost} ; HCost: ${hcost} ; FCost: ${fcost}`);
            let isNotInOpen = this.OpenNodes.indexOf(neighborNode) === -1;
            if(fcost < neighborNode.fcost || isNotInOpen){
                console.log("Updating cost values");
                neighborNode.gcost = gcost;
                neighborNode.hcost = hcost;
                neighborNode.fcost = fcost;
                neighborNode.parentNode = this.currentNode.id;
                console.log('New values');
                console.table(neighborNode);
                if(isNotInOpen){
                    console.log('Pushing neighbor to Open nodes')
                    this.OpenNodes.push(neighborNode);
                    console.table(this.OpenNodes);
                }

            }
        });
        console.warn('End of Iteration');


        // //go to unvisited with the least distance
        // let unvisitedVertices = this.vertices.filter(vertex => vertex.visited === false && vertex.distance !== Infinity);
        // if(unvisitedVertices.length == 0){
        //     pause();
        //     alert('There is no path');
        // }
        // let currentVertex = unvisitedVertices.sort((a, b) => a.distance - b.distance)[0];
        // // console.log(`current vertex: `);
        // // console.log(currentVertex);
        // let neighbors = graph.edges[currentVertex.id];
        // neighbors.forEach(neighbor => {
        //     let currentNeighbor = this.vertices.find(vertex => vertex.id === neighbor);
        //     let currentDistance = currentVertex.distance + 1;
            
            
        //     if(currentDistance < currentNeighbor.distance){
        //         currentNeighbor.distance = currentDistance;
        //         currentNeighbor.previousNode = currentVertex.id;
        //     }
            
        // });
        // currentVertex.visited = true;
        // swapNodeClass(document.getElementById(`${currentVertex.id}`), NodeValue.UNVISITED, NodeValue.VISITED)
        // document.getElementById(`${currentVertex.id}`).classList.add('visited');
        // document.getElementById(`${currentVertex.id}`).classList.remove('unvisited');

        // console.table(this.vertices);
        // if(this.endNode.visited === true){
        //     // clearInterval(intervalId);
        //     pause();
        //     this.setPath();
        //     console.log(`Path:`);
        //     console.log(path);
        //     activePlayId = setInterval(displayPath, 20);
        //     // this.currentPathNodeId = this.endNode.id;
        //     // console.log(this.endNode.id,this.currentPathNodeId );
        //     // activePlayId = setInterval(this.displayPath, 100, this.currentPathNodeId, this.vertices, this.startNode.id);

        //     // alert('End is found');
        // }
    }

    next(){
        this.iterate();
    }

    get_gcost(node, parentNode, endNodeId){
        if(parentNode.gcost === Infinity){
            return  this.getManhattanDistance(node.id, parentNode.id);
        }

        let gcost = this.getManhattanDistance(node.id, parentNode.id) + parentNode.gcost;
        return gcost;
    }

    get_hcost(node, endNodeId){
        let hcost = this.getManhattanDistance(node.id, endNodeId);
        return hcost;
    }

    // set_costs(node, parentNode, startNodeId ,endNodeId){
    //     node.gcost = this.getManhattanDistance(node.id, parentNode.id) + parentNode.gcost;
    //     node.hcost = this.getManhattanDistance(node.id, endNodeId);
    //     node.fcost = node.gcost + node.hcost;
    //     node.parentNode = parentNode;
    // }

    getManhattanDistance(nodeId, otherNodeId){
        let x1 = Math.floor(nodeId / this.graph.col);
        let y1 = nodeId % this.graph.col;

        let x2 =  Math.floor(otherNodeId / this.graph.col);
        let y2 = otherNodeId % this.graph.col;

        let manhattanDistance = Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2)
        return manhattanDistance;
    }
    setPath(){
        let currentVertex = this.vertices.find(vertex => vertex.id === this.endNode);
        while(currentVertex.id !== this.startNode){
            currentVertex = this.vertices.find(vertex => vertex.id === currentVertex.parentNode);
            console.log('Pushing to path:' + currentVertex.id);
            path.push(currentVertex.id);
            
        }
        
    }
}