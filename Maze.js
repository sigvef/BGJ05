function Maze(){

    /* internal is some internal representation of the maze,
       either a graph or an array of cells or whatever is best */
    this.internal = this.generate();
}

Maze.prototype.render = function(ctx, x, y, w, h){
    
}


/* init this.internal if n is undefined, else grow internal by n */
Maze.prototype.generate = function(n){
}
