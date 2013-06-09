try{
    var Maze = require('./Maze');
    var LightBomb = require('./LightBomb');
    var Firefly = require('./Firefly');
}catch(e){}

function GameState(socket, renderable){
    this.maze = {};
    this.fireflies = [];
    this.numFireflies = 8;
    this.fireflyAddProb = 0.2;
    this.bombs = [];
    this.player_id_counter = 1;
    this.spawnHouse;
    this.spawnSize = 4;
    this.lightHouses = [];
    this.numLightHouses = 0;
    this.lightHouseSize = 2;
    this.lightHouseAddProb = 0.008;

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



GameState.prototype.placeBomb = function(x,y,duration, blast_duration){
    this.bombs.push(new LightBomb({x:x, y:y, duration_in_ms: duration, blast_duration: blast_duration}));
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
    this.player = new Player(0,0, this);
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
            var posx = col+i|0;
            var posy = row+j|0;
            cell = this.maze.getCellAt(posy,posx);
            cell.setAsPath();
        }
    }
    this.lightHouses[this.numLightHouses] = new LightHouse(col-1-0.5,row-0.5, size+1);//This is ugly, should be fixed
    this.numLightHouses++;
}

GameState.prototype.addFirefly = function(x,y){
    this.fireflies[this.numFireflies] = new Firefly(x,y);
    this.numFireflies++;
}
GameState.prototype.onNewCell = function(row,col){
    //adding fireflies
    var addProb = this.fireflyAddProb;
    var p = Math.random();
    if(addProb > p){
        var x = Math.random();
        var y = Math.random();
        this.addFirefly(col+x,row+y); 
    }
    //adding lighthouses
    addProb = this.lightHouseAddProb;
    p = Math.random();
    if(addProb > p){
        console.log("Generated a lightHouse at: " + col + " " + row);
        this.createLightHouse(col,row,this.lightHouseSize);
    }
}

GameState.prototype.render = function(ctx){
    if(!this.renderable) return;

    this.darkvas.width = 16*GU+GU;
    this.darkvas.height = 9*GU+GU;

    var viewport = {
        x: (this.player || {x:0}).x - 8,
        y: (this.player || {y:0}).y - 4.5,
        width: 16,
        height: 9 
    };


    ctx.save();
    ctx.translate(Math.floor(-viewport.x*GU), Math.floor(-viewport.y*GU));

    this.darkctx.fillStyle = 'black';
    this.darkctx.fillRect(0, 0, 16*GU+GU, 9*GU+GU);

    this.maze.render(ctx, viewport);

    this.player.render(ctx,this.darkctx, viewport);

    for(var i = 0; i < this.fireflies.length;i++){
        if(this.fireflies[i] == undefined) continue;
        this.fireflies[i].render(ctx,this.darkctx, viewport);
    }
    for(var i=0;i<this.numLightHouses;i++){
        this.lightHouses[i].render(this.darkctx,viewport);
    }

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

GameState.prototype.getPlayerLight = function(){
    if(this.darkctx == undefined) return 0;
    return this.darkctx.getImageData(8*GU, 4.5*GU,1,1).data[3];
}

GameState.prototype.showMenu = function(){
    document.addEventListener('keydown', this.keydownMenuListener);
    document.body.appendChild(this.namefield);
    this.namefield.focus();

    document.removeEventListener('keydown', this.keydownGameListener);
    document.removeEventListener('keyup', this.keyupGameListener);
    BLUR = true;
    this.menu = true;
}

GameState.prototype.hideMenu = function(){
    console.log("HIDEMENU");
    document.removeEventListener('keydown', this.keydownMenuListener);
    document.addEventListener('keydown', this.keydownGameListener);
    document.addEventListener('keyup', this.keyupGameListener);
    document.body.removeChild(this.namefield);
    SELF_NAME = this.namefield.value;
    BLUR = false;
    this.menu = false;
}


GameState.prototype.update = function(){

    if(this.renderable && !this.menu && !SELF_NAME){
        this.showMenu();
    }

    this.player.update();


    var firefly;
    for(var i = 0; i<this.fireflies.length;i++){
        firefly = this.fireflies[i];
        if(firefly == undefined) continue;
        firefly.update();

        if(Math.abs(firefly.x-this.player.x) < this.player.playerSize
                && Math.abs(firefly.y-this.player.y) < this.player.playerSize){
            
            this.player.eatFirefly(firefly);
            //Delete firefly;
            firefly = this.fireflies.pop();
            if(i < this.bombs.length){
                this.fireflies[i--] = firefly;
            }
        }
    }
    for(var i = 0; i<this.numLightHouses;i++){
        this.lightHouses[i].update();
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
