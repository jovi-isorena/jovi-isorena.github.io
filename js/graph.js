class Graph{
    // constructor(row, col){
    //     this.row = row;
    //     this.col = col;
    //     this.maxEdges = row * col;
    //     this.edges = this.generateAdjacencyList(row, col);
    // }
    constructor(nodes){
        this.row = nodes.length;
        this.col = nodes[0].length;
        this.maxEdges = this.row * this.col;
        this.nodes = nodes;
        this.edges = this.generateAdjacencyList(this.row, this.col);    
    }

    generateAdjacencyMatrix(row, col){
        console.log('Generating matrix...')
        let maxEdges = row * col;
        let ret = Array.from({ length: maxEdges }, () => 
            Array.from({ length: maxEdges }, () => 0)
        );
        
        for (let i = 0; i < maxEdges; i++) {
            
            for (let j = i; j < maxEdges; j++) {
                if(j == i){
                    ret[i][j] = 0;
                }
                else if(i-col >= 0 && i-col == j){ //connect up
                    ret[i][j] = 1;
                    ret[j][i] = 1;
                }
                else if(i+col < maxEdges && i+col == j){ //connect down
                    ret[i][j] = 1;
                    ret[j][i] = 1;
                }
                else if(i%col != 0 && i-1 == j){ //connect left
                    ret[i][j] = 1;
                    ret[j][i] = 1;
                }
                else if(i%col != col-1 && i+1 == j){ //connect right
                    ret[i][j] = 1;
                    ret[j][i] = 1;
                }else{
                    ret[i][j] = 0;
                    ret[j][i] = 0;
                }
                
            }
        }
        return ret;
    }

    generateAdjacencyList(row, col){
        console.log('Generating list...')
        console.log(this.nodes);
        let maxEdges = row * col;
        let ret = [];
        
        for (let i = 0; i < maxEdges; i++) {
            let adjacentList = [];
            let nodeX = i % col;
            let nodeY = Math.floor(i / col);
            if(nodes[nodeY][nodeX].value == 'wall'){ //if the node is wall, skip
                adjacentList = [];
                ret.push(adjacentList);
                continue;
            }
            for (let j = 0; j < maxEdges; j++) {
                nodeX = j % col;
                nodeY = Math.floor(j / col);
                if(nodes[nodeY][nodeX].value == 'wall'){ //if the node is wall, skip
                    continue;
                }
                else if(j == i){
                    // ret[i][j] = 0;
                    continue;
                }
                else if(i-col >= 0 && i-col == j){ //connect up
                    // ret[i][j] = 1;
                    // ret[j][i] = 1;
                    adjacentList.push(j);
                }
                else if(i+col < maxEdges && i+col == j){ //connect down
                    // ret[i][j] = 1;
                    // ret[j][i] = 1;
                    adjacentList.push(j);
                }
                else if(i%col != 0 && i-1 == j){ //connect left
                    // ret[i][j] = 1;
                    // ret[j][i] = 1;
                    adjacentList.push(j);
                }
                else if(i%col != col-1 && i+1 == j){ //connect right
                    // ret[i][j] = 1;
                    // ret[j][i] = 1;
                    adjacentList.push(j);
                }
                else{
                    // ret[i][j] = 0;
                    // ret[j][i] = 0;
                    continue;
                }
                
            }
            // console.log(`pushing: ${adjacentList}`);
            ret.push(adjacentList);
        }
        return ret;
    }
}