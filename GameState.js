function GameState(){
    this.maze;
    this.player;
    this.bombs = [];

    this.darkvas = document.createElement('canvas');
    this.darkctx = this.darkvas.getContext('2d');
}

GameState.prototype.placeBomb = function(x,y,duration){
    this.bombs.push(new LightBomb(x,y,duration));
}

GameState.prototype.init = function(){
}

GameState.prototype.pause = function(){
}

GameState.prototype.resume = function(){
    this.maze = new Maze();
    this.player = new Player(1,1);
}

GameState.prototype.render = function(ctx){
    
    this.darkvas.width = 16*GU;
    this.darkvas.height = 9*GU;

    this.darkctx.fillStyle = 'black';
    this.darkctx.fillRect(0,0, 16*GU, 9*GU);

    this.maze.render(ctx, 0, 0, 16, 9);

    for(var i=0;i<this.bombs.length;i++){
        this.bombs[i].render_light(this.darkctx);
    }

    ctx.save();
    ctx.globalAlpha = 0.98;
    ctx.drawImage(this.darkvas, 0, 0);
    ctx.restore();

    this.player.render(ctx);

    for(var i=0;i<this.bombs.length;i++){
        this.bombs[i].render(ctx);
    }

}

GameState.prototype.update = function(){
    if(KEYS[KEYS.ESC]){
        sm.changeState('mainmenu'); 
    }
    this.player.update();

    for(var i=0;i<this.bombs.length;i++){
        if(this.bombs[i].update()){
            this.bombs.remove(i--);
        }
    }
}
