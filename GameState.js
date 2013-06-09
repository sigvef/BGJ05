try{
    var Maze = require('./Maze');
    var LightBomb = require('./LightBomb');
    var Firefly = require('./Firefly');
}catch(e){}

function GameState(socket, renderable){
    this.maze = {};
    this.players = {};
    this.fireflies = [];
    this.numFireflies = 8;
    this.bombs = [];
    this.player_id_counter = 1;
    this.spawnHouse;

    this.menu = false;

    this.renderable = renderable;

    if(this.renderable){
        this.darkvas = document.createElement('canvas');
        this.darkctx = this.darkvas.getContext('2d');
        this.namefield = document.createElement('input');
        this.titleImage = new Image();
        this.titleImage.src = "title.png";
    }

    var that = this;
    this.keydownMenuListener = function(e){
        if(e.keyCode == 13) { //enter
            that.hideMenu();
        }
    }
}


GameState.prototype.createFrame = function(){
    var frame = {};
    frame.players = {};
    for(var i in this.players){
        frame.players[i] = this.players[i].serialize();
    }
    return frame;
}

GameState.prototype.createKeyframe = function(){
    var keyframe = {};
    keyframe.players = {};
    keyframe.bombs = [];

    for(var i in this.players){
        keyframe.players[i] = this.players[i].serialize();
    }

    for(var i in this.bombs){
        keyframe.bombs[i] = this.bombs[i].serialize();
    }

    return keyframe;
}

GameState.prototype.loadFrame = function(frame){
    for(var i in frame.players){
        for(var j in frame.players[i]){
            this.players[i][j] = frame.players[i][j];
        }
    }
}

GameState.prototype.loadKeyframe = function(keyframe){
    this.players = {};
    this.bombs = [];

    for(var i in keyframe.players){
        var player = new Player(this, keyframe.players[i]); 
        this.players[i] = player;
    }

    for(var i in keyframe.bombs){
        var bomb = new LightBomb(keyframe.bombs[i]); 
        this.bombs[i] = bomb;
    }
}


GameState.prototype.addPlayer = function(player){
    player.id = this.player_id_counter++; 
    player.color = {r: Math.random()*256|0, g: Math.random()*256|0, b: Math.random()*256|0};
    player.x = 1;
    player.y = 1;
    this.players[player.id] = player;
}

GameState.prototype.removePlayer = function(id){
    delete this.players[id];
}

GameState.prototype.placeBomb = function(x,y,duration, blast_duration){
    this.bombs.push(new LightBomb({x:x, y:y, duration_in_ms: duration, blast_duration: blast_duration}));
}

GameState.prototype.init = function(){
}

GameState.prototype.pause = function(){
}

GameState.prototype.resume = function(){
    this.maze = new Maze(this);
    this.connect && this.connect();

    for(var i = 0; i < this.numFireflies;i++){
        this.fireflies[i] = new Firefly(Math.random()*16, Math.random()*9);//TODO find some better way to do this
    }

    /*
       var foundSpawn= false;
       var x = this.maze.blockSize|0;
       var y = 0;
       var i = 0;
       while(!foundSpawn){
       console.log(""+(x+i)+" "+ y + "")
       var cell = this.maze.getCellAt(x+i,y);
       if(!cell.isWall()){
       foundSpawn = true;
       }
       i++;
       }
       this.player = new Player(x+i,y);
       this.spawnHouse = new LightHouse(this.player.x,this.player.y);
       */

}

GameState.prototype.render = function(ctx){
    if(!this.renderable) return;

    this.darkvas.width = 16*GU+GU;
    this.darkvas.height = 9*GU+GU;

    var viewport = {
        x: (this.players[SELF_ID] || {x:0}).x - 8,
        y: (this.players[SELF_ID] || {y:0}).y - 4.5,
        width: 16,
        height: 9 
    };


    ctx.save();
    ctx.translate(Math.floor(-viewport.x*GU), Math.floor(-viewport.y*GU));

    for(var i = 0; i<this.numFireflies;i++){
        this.fireflies[i].render(ctx,this.darkctx, viewport);
    }

    //this.spawnHouse.render(this.darkctx, viewport);

    for(var i=0;i<this.bombs.length;i++){
        this.bombs[i].render_light(this.darkctx, viewport);
    }


    this.darkctx.fillStyle = 'black';
    this.darkctx.fillRect(0, 0, 16*GU+GU, 9*GU+GU);

    this.maze.render(ctx, viewport);

    for(var i = 0; i<this.numFireflies;i++){
        this.fireflies[i].render(ctx,this.darkctx, viewport);
    }
    for(var i=0;i<this.bombs.length;i++){
        this.bombs[i].render_light(this.darkctx, viewport);
    }

    for(var i in this.players){
        this.players[i].render(ctx);
    }

    ctx.save();
    ctx.globalAlpha = 0.98;
    ctx.drawImage(this.darkvas, viewport.x*GU-0.5*GU, viewport.y*GU-0.5*GU);
    ctx.restore();

    SELF_ID && this.players[SELF_ID].render(ctx);

    for(var i=0;i<this.bombs.length;i++){
        this.bombs[i].render(ctx);
    }

    ctx.restore();

    if(this.menu){
        var padding = 0.5*GU;
        var width = 8*GU;

        /* TODO: put some of this in css */
        this.namefield.style.position = 'fixed';
        this.namefield.style.zIndex = 99999;
        this.namefield.style.font = 1*GU + 'px Arial';
        this.namefield.style.width = width + 'px';
        this.namefield.style.height = 2*GU + 'px';
        this.namefield.style.top = window.innerHeight/2 - padding/2 + 'px';
        this.namefield.style.left = window.innerWidth/2 - width/2 - padding + 'px';
        this.namefield.style.padding = padding + 'px';
        this.namefield.style.border = '0';
        this.namefield.style.background = 'rgba(0,0,0,0.8)';
        this.namefield.style.color = 'white';
        this.namefield.style.borderRadius = GU+'px';
        this.namefield.placeholder = "Enter your name";

        ctx.drawImage(this.titleImage, 0, 0, 16*GU, 9*GU);
    }
}

GameState.prototype.showMenu = function(){
    document.addEventListener('keydown', this.keydownMenuListener);
    document.body.appendChild(this.namefield);
    this.namefield.focus();

    document.removeEventListener('keydown', this.keydownGameListener);
    document.removeEventListener('keyup', this.keyupGameListener);
    this.menu = true;
}

GameState.prototype.hideMenu = function(){
    console.log("HIDEMENU");
    document.removeEventListener('keydown', this.keydownMenuListener);
    document.addEventListener('keydown', this.keydownGameListener);
    document.addEventListener('keyup', this.keyupGameListener);
    document.body.removeChild(this.namefield);
    SELF_NAME = this.namefield.value;
    this.sendName(SELF_NAME);
    this.menu = false;
}

GameState.prototype.update = function(){

    if(this.renderable && !this.menu && !SELF_NAME){
        this.showMenu();
    }

    for(var i in this.players){
        this.players[i].update();
    }
    //this.spawnHouse.update();

    for(var i = 0; i<this.numFireflies;i++){
        this.fireflies[i].update();
    }

    for(var i=0;i<this.bombs.length;i++){
        if(this.bombs[i].update()){
            var bomb = this.bombs.pop();
            if(i < this.bombs.length){
                this.bombs[i--] = this.bombs.pop();
            }
        }
    }
}



try{
    module.exports = GameState;
}catch(e){}
