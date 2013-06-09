function GameState(){
    this.maze;
    this.player;
    this.fireflies = [];
    this.numFireflies = 8;
    this.bombs = [];
    this.spawnHouse;
    this.spawnSize = 4;
    this.lightHouseSize = 2;

    this.darkvas = document.createElement('canvas');
    this.darkctx = this.darkvas.getContext('2d');

}

GameState.prototype.placeBomb = function(x,y,duration, blast_duration){
    this.bombs.push(new LightBomb(x,y,duration, blast_duration));
}

GameState.prototype.init = function(){
}

GameState.prototype.pause = function(){
}

GameState.prototype.resume = function(){
    this.maze = new Maze(this);
    for(var i = 0; i < this.numFireflies;i++){
        this.fireflies[i] = new Firefly(Math.random()*16, Math.random()*9);//TODO find some better way to do this
    }
    this.player = new Player(0,0);
    //this.spawnHouse = new LightHouse(this.player.x,this.player.y);
    this.spawnHouse = this.createLightHouse(this.player.x,this.player.y, this.spawnSize);


}
GameState.prototype.createLightHouse = function(x,y,size){
    //making a clearing
    var cell;
    var col = Math.floor(x/this.maze.blockSize)-size/2 | 0;
    var row = Math.floor(y/this.maze.blockSize)-size/2 | 0;
    for(var i=0;i<size;i++){
        for(var j=0;j<size;j++){
            var posx = col+i;
            var posy = row+j;
            cell = this.maze.getCellAt(posx,posy);
            cell.setAsPath();
        }
    }
    return new LightHouse(col-0.5,row-0.5, size+1);
}

GameState.prototype.addFirefly = function(x,y){
    this.fireflies[this.numFireflies] = new Firefly(x,y);
    this.numFireflies++;
}
GameState.prototype.onNewCell = function(row,col){
    var addProb = 0.2;
    var p = Math.random();
    if(addProb > p){
        var x = Math.random();
        var y = Math.random();
        this.addFirefly(row+x,col+y); 
    }
}

GameState.prototype.render = function(ctx){
    
    this.darkvas.width = 16*GU+GU;
    this.darkvas.height = 9*GU+GU;

    var viewport = {
        x: this.player.x - 8,
        y: this.player.y - 4.5,
        width: 16,
        height: 9 
    };
    ctx.translate(Math.floor(-viewport.x*GU), Math.floor(-viewport.y*GU));
    //console.log("Player x:"+((this.player.x/this.maze.blockSize)|0)+" y:"+((this.player.y/this.maze.blockSize)|0));

    this.darkctx.fillStyle = 'black';
    this.darkctx.fillRect(0, 0, 16*GU+GU, 9*GU+GU);

    this.maze.render(ctx, viewport);

    this.player.render(ctx,this.darkctx, viewport);

    for(var i = 0; i<this.numFireflies;i++){
        this.fireflies[i].render(ctx,this.darkctx, viewport);
    }
    this.spawnHouse.render(this.darkctx, viewport);
    for(var i=0;i<this.bombs.length;i++){
        this.bombs[i].render_light(this.darkctx, viewport);
    }

    ctx.save();
    ctx.globalAlpha = 0.98;
    ctx.drawImage(this.darkvas, viewport.x*GU-0.5*GU, viewport.y*GU-0.5*GU);
    ctx.restore();

    

    for(var i=0;i<this.bombs.length;i++){
        this.bombs[i].render(ctx);
    }

}


GameState.protoype.getDarkness = function(x_in_GU, y_in_GU){
}

GameState.prototype.update = function(){
    if(KEYS[KEYS.ESC]){
        sm.changeState('mainmenu'); 
    }
    this.player.update();
    this.spawnHouse.update();
    for(var i = 0; i<this.numFireflies;i++){
        this.fireflies[i].update();
    }

    for(var i=0;i<this.bombs.length;i++){
        if(this.bombs[i].update()){
            this.bombs.remove(i--);
        }
    }
}
