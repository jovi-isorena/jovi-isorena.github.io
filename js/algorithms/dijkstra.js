class Dijkstra{
    constructor(nodes, graph, startNode, endNode){
        this.nodes = [];
        for (let i = 0; i < nodes.length; i++) {
            this.nodes.push(...nodes[i]);
        }
        this.graph = graph;
        this.startNode = startNode;
        // this.currentPathNodeId;
        this.endNode = endNode;
        this.vertices = [];
        this.intervalID;

        
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
                distance: node.id == this.startNode ? 0 : Infinity,
                previousNode: null,
                visited: false
            }
        });
        this.vertices = nodes;
        this.startNode = this.vertices.find(vertex => vertex.id == parseInt(this.startNode));
        this.endNode = this.vertices.find(vertex => vertex.id == parseInt(this.endNode));
            // console.table(this.vertices);
    }

    iterate(){
        //go to unvisited with the least distance
        let unvisitedVertices = this.vertices.filter(vertex => vertex.visited === false && vertex.distance !== Infinity);
        if(unvisitedVertices.length == 0){
            pause();
            alert('There is no path');
        }
        let currentVertex = unvisitedVertices.sort((a, b) => a.distance - b.distance)[0];
        // console.log(`current vertex: `);
        // console.log(currentVertex);
        let neighbors = graph.edges[currentVertex.id];
        neighbors.forEach(neighbor => {
            let currentNeighbor = this.vertices.find(vertex => vertex.id === neighbor);
            let currentDistance = currentVertex.distance + 1;
            
            
            if(currentDistance < currentNeighbor.distance){
                currentNeighbor.distance = currentDistance;
                currentNeighbor.previousNode = currentVertex.id;
            }
            
        });
        currentVertex.visited = true;
        swapNodeClass(document.getElementById(`${currentVertex.id}`), NodeValue.UNVISITED, NodeValue.VISITED)
        // document.getElementById(`${currentVertex.id}`).classList.add('visited');
        // document.getElementById(`${currentVertex.id}`).classList.remove('unvisited');

        // console.table(this.vertices);
        if(this.endNode.visited === true){
            // clearInterval(intervalId);
            pause();
            this.setPath();
            console.log(`Path:`);
            console.log(path);
            activePlayId = setInterval(displayPath, 20);
            // this.currentPathNodeId = this.endNode.id;
            // console.log(this.endNode.id,this.currentPathNodeId );
            // activePlayId = setInterval(this.displayPath, 100, this.currentPathNodeId, this.vertices, this.startNode.id);
        
            // alert('End is found');
        }
    }

    play(){
        this.intervalID = setInterval(this.iterate, 100);

        return this.intervalID;
    }

    next(){
        // console.log('endnode:' + this.endNode);
        this.iterate();
    }

    setPath(){
        let currentVertex = this.endNode;
        while(currentVertex !== this.startNode){
            // document.getElementById(`${currentVertex.id}`).classList.add('path');
            currentVertex = this.vertices.find(vertex => vertex.id === currentVertex.previousNode);
            // setTimeout(swapNodeClass, 1000,  document.getElementById(`${currentVertex.id}`), NodeValue.VISITED, NodeValue.PATH); 
            path.push(currentVertex.id);
            
        }
        // console.log(currentPathNodeId);
        // swapNodeClass(document.getElementById(`${currentPathNodeId}`), NodeValue.VISITED, NodeValue.PATH);
        // currentPathNodeId = vertices.find(vertex => vertex.id === currentPathNodeId).id;
        // if(currentPathNodeId === startNodeId){
        //     pause();    
        // }
    }
    
}