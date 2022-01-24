class RecursiveBacktracking
{
    constructor(nodes){
        this.nodes = nodes;
        this.row = nodes.length;
        this.col = nodes[0].length;
        this.visited = [];
        this.potentialEdges = new Graph(this.nodes);
        this.edges=[];
        this.limit = 0;
        this.currentProcessNode = null;
    }

    nextRecursive(){
        if(this.currentProcessNode === null){
            this.currentProcessNode = 0;
        }
        this.processNode(this.currentProcessNode);
    }

    // function to create a adjancency list
    createMaze(){
        // 1. get a node
        let firstNodeId = 0;
        this.processNode(firstNodeId);
        let finalAdjacencyList = this.edges;
        //console.table(this.edges);

        // //console.log('Potential Edges:');
        // //console.table(potentialEdges.edges);
        return finalAdjacencyList;
    }

    processNode(nodeId){
        if(this.limit == 4){
            return;
        }
        //console.log("Process Node")
        let currentNode = nodeId;
        //console.log("Processing Node:")
        //console.log(currentNode)
        // 2. add to visited
        this.visited.push(currentNode);
        //console.log("Visited list:")
        //console.log(this.visited)
        // extra step to get the next neighbor
        let neighbors = this.getNextNeighbor(currentNode);
        //console.log('List of next neighbors');
        //console.log(neighbors);
        // 3. While the current cell has any unvisited neighbors
        while(neighbors.length > 0){
            // a. choose one of the unvisited neighbors
            let nextNode = this.randomSelect(neighbors);
            //console.log('Selected next node: ' + nextNode)
            //console.log('New length of neigbors: ' + neighbors.length)
            if(this.visited.indexOf(nextNode) === -1){
                //console.log('Not yet visited. Connecting the nodes.');
                this.connectNodes(currentNode, nextNode);
                this.currentProcessNode = nextNode;
                this.processNode(nextNode);
            }
        }
        // this.limit++;
        //console.warn('End of Processing.')
        //console.table(this.edges)
        return;
    }

    getNextNeighbor(nodeId){
        let ret = []
        let neighbors = [...this.potentialEdges.edges[nodeId]];
        //console.log('Neighbors of current node:');
        //console.log(neighbors);
        neighbors.forEach(neighbor => {
            //console.log('Getting next neighbor of: ');
            //console.log(neighbor);
            //console.log('List of potential edges for this node:');
            //console.log( this.potentialEdges.edges[neighbor]);
            //algo to find the next neighboring node
            let nextNeighbor = nodeId + ((neighbor - nodeId) * 2);
            //console.log('Next neighbor is: ' + nextNeighbor);
            if( this.potentialEdges.edges[neighbor].indexOf(nextNeighbor) > -1){ //nextNeighbor >= 0 || nextNeighbor < this.potentialEdges.edges.length) &&
                ret.push(nextNeighbor);
                //compare to the potential edge of the neighbor to verify edge
            }
        });
        return ret;
    }

    // randomly pop an element from a given array and return it
    randomSelect(neighbors){
        let selectedIndex = Math.floor(Math.random()*neighbors.length);
        let deletedElement = neighbors.splice(selectedIndex, 1);
        return deletedElement[0];
    }

    connectNodes(currentNode, nextNode){
        let arr1 = this.potentialEdges.edges[currentNode];
        let arr2 = this.potentialEdges.edges[nextNode]
        
        let wallNode = arr1.filter(val=>arr2.indexOf(val)>-1)[0];
        if(this.edges[currentNode] === undefined){
            this.edges[currentNode] = [];
        }
        if(this.edges[nextNode] === undefined){
            this.edges[nextNode] = [];
        }
        if(this.edges[wallNode] === undefined){
            this.edges[wallNode] = [];
        }
        this.edges[currentNode].push(wallNode);
        this.edges[wallNode].push(currentNode);
        this.edges[wallNode].push(nextNode);
        this.edges[nextNode].push(wallNode);
        
    }

}