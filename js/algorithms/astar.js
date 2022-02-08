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
        // set current with the open node with least f cost
        this.OpenNodes = this.OpenNodes.sort((a,b) => b.fcost - a.fcost);
        this.currentNode = this.OpenNodes.pop();
        swapNodeClass(document.getElementById(`${this.currentNode.id}`), NodeValue.UNVISITED, NodeValue.VISITED);
        this.ClosedNodes.push(this.currentNode.id);
        if(this.currentNode.id === this.endNode){
            // pause();
            endFound = true;

            this.setPath();
            // activePlayId = setInterval(displayPath, playSpeed);
            displayPath();
        }
        
        let neighbors = this.graph.edges[this.currentNode.id];
        neighbors.forEach(neighbor => {
            if(this.ClosedNodes.indexOf(neighbor) !== -1 ){
                return;
            }
            let neighborNode = this.vertices.find(vertex => vertex.id === neighbor);
            let gcost = this.get_gcost(neighborNode, this.currentNode, this.endNode);
            let hcost = this.get_hcost(neighborNode, this.endNode);
            let fcost = gcost + hcost;
            let isNotInOpen = this.OpenNodes.indexOf(neighborNode) === -1;
            if(fcost < neighborNode.fcost || isNotInOpen){
                neighborNode.gcost = gcost;
                neighborNode.hcost = hcost;
                neighborNode.fcost = fcost;
                neighborNode.parentNode = this.currentNode.id;
                if(isNotInOpen){
                    this.OpenNodes.push(neighborNode);
                }

            }
        });
        
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