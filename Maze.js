function Maze(){

    /* internal is some internal representation of the maze,
       either a graph or an array of cells or whatever is best */
    this.internal = this.generate();
}

Maze.prototype.render = function(ctx, x, y, w, h){
    for(var nx = 0; nx < this.internal.length; nx++){
        for(var ny = 0; ny < this.internal[0].length; ny++){
            ctx.fillStyle = this.internal[nx][ny] ?  "#000000" : "#FFFFFF" ;
            ctx.fillRect(x+nx*GU*0.5,y+ny*GU*0.5,GU*0.5,GU*0.5);
        }
    }
}


/* init this.internal if n is undefined, else grow internal by n */
Maze.prototype.generate = function(n){
    var DEBUG = true;
    if(DEBUG)
        console.log("Generating maze!");
    var activeList = [[0,0]];
    var edges = [];
    var visited = {"0,0":true};

    while(activeList.length > 0){
        if(DEBUG)
            console.log("Len: " + activeList.length);
        var currentNode = activeList[Math.floor(Math.random() * activeList.length)];
        if(DEBUG)
            console.log("Current node "+currentNode); 
        var added = false;

        //Visit all neighbors.
        for(var i = -1; i < 2 && !added; i++){
            for(var j = -1; j < 2 && !added; j++){
                var x = i+currentNode[0];
                var y = j+currentNode[1];
                if(x<0 || y<0 || x > 16 || y > 9) continue;

                var newNode = [0,0];
                newNode[0] = x;
                newNode[1] = y;
                
                if(DEBUG)
                    console.log("New node: "+newNode);
                if(visited[newNode+""] == undefined){
                    edges.push([currentNode,newNode]);
                    activeList.push(newNode);
                    visited[newNode+""] = true;
                    added = true;
                }
            }
        }

        //If all neighbors have been visited before, so nothing new is added, remove
        //from active set
        if(!added){
            if(DEBUG)
                console.log("Removing "+currentNode);
            activeList.splice(activeList.indexOf(currentNode),1);
        }

    }



    //Generate the actual map. 
    //TODO: Integrate in main loop, or move elsewhere.
    var map = [];

    for(var i = 0; i < 16*2+1; i++){
        map[i]=[]; 
        for(var j = 0; j < 9*2+1; j++){
            if(i%2 == 1 || j % 2 == 1){
                map[i][j] = true;
            }else{
                map[i][j] = false;
            }
        }
    }


    for(var i = 0; i < edges.length; i++){
        //An edge looks like this: [[0,1],[0,2]]
        var currentEdge = edges[i];
        var dx = currentEdge[1][0] - currentEdge[0][0];
        var dy = currentEdge[1][1] - currentEdge[0][1];
        var ix = currentEdge[0][0]*2 + dx;
        var iy = currentEdge[0][1]*2 + dy;
        if(DEBUG)
            console.log("Accessing map " + ix +"" + iy);
        map[ix][iy] = false;
    }

    return map;
}
