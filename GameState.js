try{
    var Maze = require('./Maze');
    var LightBomb = require('./LightBomb');
}catch(e){}

function GameState(socket, renderable){
    this.maze = {};
    this.players = {};
    this.bombs = [];
    this.player_id_counter = 1;

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


this.createFrame = function(){
    var frame = {};
    for(var i in this.players){
        keyframe.players[i] = this.players[i].serialize();
    }
    return frame;
}

GameState.prototype.createKeyframe = function(){
    var keyframe = {};
    keyframe.maze = this.maze;
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
    this.players = {};
    for(var i in keyframe.players){
        for(var j in keyframe.players[i]){
            this.players[i][j] = keyframe.players[i][j];
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
    player.x = 0.25;
    player.y = 0.25;
    this.players[player.id] = player;
}

GameState.prototype.removePlayer = function(id){
    delete this.players[id];
}

GameState.prototype.placeBomb = function(x,y,duration){
    this.bombs.push(new LightBomb({x:x, y:y, duration_in_ms: duration}));
}

GameState.prototype.init = function(){
}

GameState.prototype.pause = function(){
}

GameState.prototype.resume = function(){
    this.maze = new Maze();
    this.connect && this.connect();
}

GameState.prototype.render = function(ctx){

    if(this.renderable){

        this.darkvas.width = 16*GU;
        this.darkvas.height = 9*GU;

        this.darkctx.fillStyle = 'black';
        this.darkctx.fillRect(0,0, 16*GU, 9*GU);

        this.maze.render(ctx, 0, 0, 16, 9);

        for(var i=0;i<this.bombs.length;i++){
            this.bombs[i].render_light(this.darkctx);
        }

        for(var i in this.players){
            this.players[i].render(ctx);
        }

        ctx.save();
        ctx.globalAlpha = 0.98;
        ctx.drawImage(this.darkvas, 0, 0);
        ctx.restore();

        SELF_ID && this.players[SELF_ID].render(ctx);

        for(var i=0;i<this.bombs.length;i++){
            this.bombs[i].render(ctx);
        }

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
