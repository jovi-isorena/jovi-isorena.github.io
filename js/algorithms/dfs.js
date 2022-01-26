class DFS{
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
        this.visitedId = [];
        this.currentId;
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
        this.currentId = this.startNode;
        console.log('Start:' + this.startNode);
        console.log('End:' + this.endNode);
        

        // let visited = []; //aray for visited vertices;
        let nodes = this.nodes.map(node => { 
            return {
                id: node.id, 
                previousNode: null,
                visited: false
            }
        });
        this.vertices = nodes;
        // this.startNode = this.vertices.find(vertex => vertex.id == parseInt(this.startNode));
        // this.endNode = this.vertices.find(vertex => vertex.id == parseInt(this.endNode));
            // console.table(this.vertices);
        
    }

    iterate(){
        if(this.currentId == this.endNode){
            // this.path.push(this.currentId);
            pause();
            activePlayId = setInterval(displayPath, 20);
        }
        if(path.indexOf(this.currentId) === -1){
            path.push(this.currentId);
            console.log("Pushing to path: " + this.currentId);
        }
        if(this.visitedId.indexOf(this.currentId) === -1){
            this.visitedId.push(this.currentId);
            console.log("Pushing to visited: " + this.currentId);
            swapNodeClass(document.getElementById(`${this.currentId}`), NodeValue.UNVISITED, NodeValue.VISITED);
        }
        // if(this.visited.indexOf(this.currentId) !== 1){
        //     return false
        // }
        let neighbors = this.graph.edges[this.currentId];
        console.log("Neighbors: ");
        console.log(neighbors);
        let unvisitedNeighbors = neighbors.filter( neighbor => this.visitedId.indexOf(neighbor) === -1)
        console.log("Unvisited neighbors:")
        console.log(unvisitedNeighbors);

        if(unvisitedNeighbors.length === 0){
            console.log("No more unvisited Neighbor. Popping Path");
            path.pop();
            console.log("Pop stack:");
            console.log(path);
            this.currentId = path[path.length-1];
            console.log('New current:' + this.currentId);
            console.warn('End of iteration');
            return;
        }

        this.currentId = unvisitedNeighbors[0];
        console.log('New current:' + this.currentId);
        console.warn('End of iteration');
        return;
        
    }

    next(){
        this.iterate();
    }

}