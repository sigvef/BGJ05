function LevelRenderer() {
    this.height = 9;
    this.width = 16;
    this.wall = new Image();
    this.wall.src = "hedge.png";
    this.road = new Image();
    this.road.src = "ground.png";
    this.tileRenderers = {};
    this.accumulator = Math.floor(Math.random() * 60);
}

/*LevelRenderer.prototype.update = function(dt) {
    this.accumulator = (this.accumulator + dt) % 60;
}*/

LevelRenderer.prototype.renderTile = function(row, col, world, context){
    if (!([row,col] in this.tileRenderers)) {
        this.tileRenderers[[row,col]] = new TileRenderer(row, col, world, context, this);
    }
    this.tileRenderers[[row,col]].render(row, col);
};
