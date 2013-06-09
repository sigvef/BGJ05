try{
    var Pattern = require('./pattern');
    require('./util');
}catch(e){}

function Maze(game){

    this.game = game;
    this.patternsMatrix = {};
    this.cells = {};
    blockSize = 1;//0.5;
    try{
    this.hedgeImage = new Image();
    this.groundImage = new Image();
    this.hedgeImage.src = "hedge.png";
    this.groundImage.src = "ground.png";
    this.renderer = new LevelRenderer(); 
    }catch(e){}
    this.ratioBlockGU = 1;//0.5;
}

Maze.prototype.render = function(ctx, viewport){

    var startRow = Math.ceil(viewport.y / blockSize) - 1;
    var startCol = Math.ceil(viewport.x / blockSize) - 1;
    var rows = Math.ceil(viewport.height / blockSize) + 1;
    var cols = Math.ceil(viewport.width / blockSize) + 1;

    for (var row = 0; row < rows; ++row) {
        for (var col = 0; col < cols; ++col) {
            this.renderer.renderTile(startRow + row, startCol + col, this, ctx);
        }
    }
    /*for(var nx = 0; nx < this.internal.length; nx++){
      for(var ny = 0; ny < this.internal[0].length; ny++){
      if(this.internal[nx][ny]){
    //Hedge
    ctx.drawImage(this.hedgeImage, x+nx*blockSize,y+ny*blockSize,blockSize,blockSize);
    }else{
    //Ground
    ctx.drawImage(this.groundImage, x+nx*blockSize,y+ny*blockSize,blockSize,blockSize);
    }

    }
    }*/
}

Maze.prototype.collide = function(x, y){
    var blockSize = this.ratioBlockGU*GU;
    var nx = Math.floor(GU*x/blockSize)|0;
    var ny = Math.floor(GU*y/blockSize)|0;
    var cell = this.getCellAt(nx,ny);
    if(cell){
        return cell.wall;
    }else{
        return true;
    }
}

Maze.prototype.getPatternAt = function(coord) {
    if (!this.patternsMatrix[coord.row] || ! this.patternsMatrix[coord.row][coord.col]) {
        return null;
    }
    return this.patternsMatrix[coord.row][coord.col];
};

Maze.prototype.cellExists = function(global_row, global_col) {
    return this.cells[global_row] && this.cells[global_row][global_col];
};

Maze.prototype.addCellAt = function(cell, global_row, global_col) {
    if (!this.cells[global_row]) {
        this.cells[global_row] = {};
    }
    this.cells[global_row][global_col] = cell;
};

Maze.prototype.getCellAt = function(global_row, global_col) {
    if (!this.cellExists(global_row, global_col)) {
        if(this.game.renderable){
            this.game.getCellAt(global_row, global_col);
            return;
        }
        var pattern_coord = Pattern.translateGlobalToPattern(global_row, global_col);
        pattern = this.generatePatternFor(pattern_coord);
        for (var internal_row = 0; internal_row < 3; internal_row++) {
            for (var internal_col = 0; internal_col < 3; internal_col++) {
                this.addCellAt(pattern.internalCellAt(internal_row, internal_col), pattern_coord.row * 3 + internal_row, pattern_coord.col * 3 + internal_col);
            }
        }
    }
    return this.cells[global_row][global_col];
};

Maze.CONNECTION_CHANCES = [1,  1,  0.025, 0.001];


Maze.prototype.generatePatternFor = function(coord) {
    var top_pattern    = this.getPatternAt(coord.top());
    var right_pattern  = this.getPatternAt(coord.right());
    var bottom_pattern = this.getPatternAt(coord.bottom());
    var left_pattern   = this.getPatternAt(coord.left());

    var top_exists    = top_pattern    ? true : false;
    var right_exists  = right_pattern  ? true : false;
    var bottom_exists = bottom_pattern ? true : false;
    var left_exists   = left_pattern   ? true : false;

    var connections = 0;

    var top_connected    = top_exists    ? top_pattern.bottom : false;
    if (top_connected) connections++;

    var right_connected  = right_exists  ? right_pattern.left : false;
    if (right_connected) connections++;

    var bottom_connected = bottom_exists ? bottom_pattern.top : false;
    if (bottom_connected) connections++;

    var left_connected   = left_exists   ? left_pattern.right : false;
    if (left_connected) connections++;

    var connection_chances = Maze.CONNECTION_CHANCES.slice(0, 4 - connections);

    var new_connections = 0;

    var top_function = function() {
        if (!top_exists || top_connected) {
            top_connected = top_connected || Math.roll(connection_chances[new_connections]);
            new_connections++;
        }
    }

    var right_function = function() {
        if (!right_exists || right_connected) {
            right_connected = right_connected || Math.roll(connection_chances[new_connections]);
            new_connections++;
        }
    }

    var bottom_function = function() {
        if (!bottom_exists | bottom_connected) {
            bottom_connected = bottom_connected || Math.roll(connection_chances[new_connections]);
            new_connections++;
        }
    }

    var left_function = function() {
        if (!left_exists || left_connected) {
            left_connected = left_connected || Math.roll(connection_chances[new_connections]);
            new_connections++;
        }
    }

    var connection_functions = Array.shuffle([top_function, right_function, bottom_function, left_function]);
    for (var i = 0; i < 4; i++) {
        connection_functions[i].call();
    }

    var pattern = new Pattern({top:top_connected, right:right_connected, bottom:bottom_connected, left:left_connected});

    if (!this.patternsMatrix[coord.row]) {
        this.patternsMatrix[coord.row] = {};
    }

    this.patternsMatrix[coord.row][coord.col] = pattern;
    return pattern;
};

Maze.prototype.renderTile = function(row, col, world, context){
        if (!([row,col] in this.tileRenderers)) {
            this.tileRenderers[[row,col]] = new TileRenderer(row, col, world, context, this);
        }
        this.tileRenderers[[row,col]].render(row, col);
};


try{
    module.exports = Maze;
}catch(e){}
