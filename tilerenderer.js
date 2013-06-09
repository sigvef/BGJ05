function TileRenderer(row, col, world, context, renderer){
    this.row = row;
    this.col = col;
    this.world = world;
    this.context = context;
    this.renderer = renderer;
    this.neighbours = [
        [world.getCellAt(row - 1, col -1), world.getCellAt(row - 1, col), world.getCellAt(row - 1, col +1)],
        [world.getCellAt(row    , col -1), world.getCellAt(row    , col), world.getCellAt(row    , col +1)],
        [world.getCellAt(row + 1, col -1), world.getCellAt(row + 1, col), world.getCellAt(row + 1, col +1)]
            ];
    this.cell = world.getCellAt(row    , col);
    }

TileRenderer.prototype.isWall = function(x,y){
    return this.neighbours[x+1][y+1].isWall();
};

TileRenderer.prototype.isPath = function(x,y){
    return this.neighbours[x+1][y+1].isPath();
};

TileRenderer.prototype.fits = function(arr){
    for (var i = 0 ; i < arr.length; i++){
        for (var j = 0 ; j < arr[i].length ; j++){
            var command = arr[i][j]; //0-path, 1-wall, 2-any
            var x = i - 1;
            var y = j - 1;
            if (command == 0 && this.isWall(x, y)) return false;
            if (command == 1 && this.isPath(x, y)) return false;
        }
    }
    return true;
};

TileRenderer.prototype.blit = function(sprite, srcX, srcY){
    var blockSize = this.world.blockSize;
    this.context.drawImage(sprite, this.render_col*blockSize*GU, this.render_row*blockSize*GU, blockSize*GU, blockSize*GU);
    //this.context.drawImage(sprite, srcX, srcY, blockSize*GU, blockSize*GU, 
            //this.render_col*blockSize*GU, this.render_row*blockSize*GU, blockSize*GU, blockSize*GU);
   // this.context.fillText(this.render_col+","+this.render_row,this.render_col*blockSize*GU, this.render_row*blockSize*GU, blockSize*GU, blockSize*GU);

};

TileRenderer.prototype.render = function(render_row, render_col){
    this.render_row = render_row;
    this.render_col = render_col;
    if (this.isWall(0,0)) {
        this.renderWall();
    } else {
        this.renderRoad();
    }
    var cell = this.world.getCellAt(this.row, this.col);
    if (cell.hasContent()) {
        /*if (cell.content.isCoin()) {
            this.renderCoin(cell.content.value);
        }*/
    }
};

/*TileRenderer.prototype.renderCoin = function(content_type) {
    this.coin_frame = this.coin_offset + this.renderer.accumulator;
    var tmp = Math.floor((this.coin_frame * 5) % 4);
    var animation = (tmp % 2) ? 0 : Math.floor(tmp/2)+1;
    this.blit(this.renderer.coins, 16 * animation, 16 * content_type)
}*/

TileRenderer.prototype.renderWall = function(){
    var idx = 0;
    if (this.isPath(-1,0))  idx += 1;
    if (this.isPath(0,1))   idx += 2;
    if (this.isPath(1,0))   idx += 4;
    if (this.isPath(0,-1))  idx += 8;
    this.blit(this.renderer.wall,0 , idx * 16);
};

TileRenderer.prototype.renderRoad = function(){
    this.blit(this.renderer.road, 0, 0);
};

