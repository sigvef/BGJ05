function GameState(){
    this.maze;
    this.player;
    this.bombs = [];
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
    ctx.fillStyle = 'darkblue';
    ctx.fillRect(0,0, 16*GU, 9*GU);

    this.maze.render(ctx, 0, 0, 16, 9);
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
