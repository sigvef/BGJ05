function LevelRenderer(game) {
    this.game = game;
    this.height = 9;
    this.width = 16;
    this.tileRenderers = {};
    this.accumulator = Math.floor(Math.random() * 60);
}

LevelRenderer.prototype.wall = loadImage("hedge.png");
LevelRenderer.prototype.road = loadImage("ground.png");

/*LevelRenderer.prototype.update = function(dt) {
    this.accumulator = (this.accumulator + dt) % 60;
}*/

LevelRenderer.prototype.renderTile = function(row, col, world, context){
    if (!([row,col] in this.tileRenderers)) {
        this.tileRenderers[[row,col]] = new TileRenderer(row, col, world, context, this, this.game);
    }
    this.tileRenderers[[row,col]].render(row, col);
};
