try{
    var Maze = require('./Maze');
    var LightBomb = require('./LightBomb');
    var Firefly = require('./Firefly');
}catch(e){}

function GameState(socket, renderable){
    this.maze = {};
    this.fireflies = [];
    this.fireflyAddProb = 0.5;
    this.bombs = [];
    this.player_id_counter = 1;
    this.spawnHouse;
    this.spawnSize = 4;
    this.lightHouses = [];
    this.lhHash = {};
    this.numLightHouses = 0;
    this.lightHouseSize = 2;
    this.lightHouseAddProb = 0.008;
    this.score = 0;

    this.textalizer = 0;

    this.menu = false;

    this.renderable = renderable;

    this.darkvas = document.createElement('canvas');
    this.darkctx = this.darkvas.getContext('2d');
    this.menuDiv = document.getElementById('menuDiv');

    var that = this;
    this.keydownMenuListener = function(e){
        if(e.keyCode == 13){
            document.body.requestFullscreen && document.body.requestFullscreen();
            document.body.webkitRequestFullscreen && document.body.webkitRequestFullscreen(); 
            document.body.mozRequestFullscreen && document.body.mozRequestFullScreen();
            that.hideMenu();
        }else if(e.keyCode == 27){
            that.hideMenu();
        }
    }
}

GameState.FIREFLY_DIMINISHING_RATIO = 0.003;

GameState.prototype.sfx = {
    takeFirefly: loadAudio('take-firefly.ogg'),
    celebrate: loadAudio('celebrate.ogg')
}

GameState.prototype.titleImage = loadImage("title.png");

GameState.prototype.placeBomb = function(x,y,duration, blast_duration){
    this.bombs.push(new LightBomb({x:x, y:y, duration_in_ms: duration, blast_duration: blast_duration}));
}

GameState.prototype.init = function(){
}

GameState.prototype.pause = function(){
}

GameState.prototype.resume = function(){
    this.score = 0;
    this.maze = new Maze(this);
    this.fireflies = [];
    for(var i = 0; i < this.fireflies.length;i++){
        this.fireflies[i] = new Firefly(Math.random()*16, Math.random()*9);//TODO find some better way to do this
    }
    this.player = new Player(0,0, this);
    //this.spawnHouse = new LightHouse(this.player.x,this.player.y);
    this.spawnHouse = this.createLightHouse(this.player.x,this.player.y, this.spawnSize);
    this.showMenu();
}

GameState.prototype.createLightHouse = function(x,y,size){
    //making a clearing
    var cell;
    var col = x/this.maze.blockSize-size/2;
    var row = y/this.maze.blockSize-size/2;
    for(var i=0;i<size;i++){
        for(var j=0;j<size;j++){
            var posx = col+i;
            var posy = row+j;
            cell = this.maze.getCellAt(posy,posx);
            cell.setAsPath();
        }
    }
    this.lightHouses[this.numLightHouses] = new LightHouse(col-0.5,row-0.5, size+1);//This is ugly, should be fixed
    this.numLightHouses++;
}

GameState.prototype.addFirefly = function(x,y){
    this.fireflies.push(new Firefly(x,y));
}
GameState.prototype.onNewCell = function(row,col){
    //adding fireflies
    var dist = Math.abs(row)+Math.abs(col);
    var addProb = Math.max(this.fireflyAddProb - GameState.FIREFLY_DIMINISHING_RATIO*dist,0);
    var p = Math.random();
    if(addProb > p){
        var x = Math.random();
        var y = Math.random();
        this.addFirefly(col+x,row+y); 
    }
    //adding lighthouses randomly
    /*
    addProb = this.lightHouseAddProb;
    p = Math.random();
    if(addProb > p){
        console.log("Generated a lightHouse at: " + col + " " + row);
        this.createLightHouse(col,row,this.lightHouseSize);
    }*/

    //adding 
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
    for(var i=0;i<this.lightHouses.length;i++){
        this.lightHouses[i].render(this.darkctx,viewport);
    }

    for(var i=0;i<this.bombs.length;i++){
        this.bombs[i].render_light(this.darkctx, viewport);
    }


    ctx.drawImage(this.darkvas, viewport.x*GU-0.5*GU, viewport.y*GU-0.5*GU);

    for(var i=0;i<this.bombs.length;i++){
        this.bombs[i].render(ctx);
    }

    ctx.font = (GU*0.3)+"px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    if(this.textalizer > 0){
        ctx.fillStyle = 'orange';
        ctx.font = (this.textalizer*GU*0.02+GU*0.3)+"px Arial";
    }
    ctx.fillText(this.score + ' firefl' + ['ies','y'][+(this.score == 1)], viewport.x*GU+8*GU, viewport.y*GU+0.1*GU);
    ctx.restore();

    if(this.menu){
        ctx.fillStyle = 'rgba(0,0,0,0.9)';
        ctx.fillRect(0,0, 16*GU, 9*GU);
        ctx.drawImage(this.titleImage, 0, 0, 16*GU, 9*GU);

        ctx.font = (GU*0.3)+"px Arial";
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.fillText('Best score: ' + (localStorage.bestScore || 0), 15.5*GU, 6*GU);
        ctx.fillText('Last score: ' + (localStorage.score || 0), 15.5*GU, 6.4*GU);
    }
}

GameState.prototype.getPlayerLight = function(){
    if(this.darkctx == undefined) return 0;
    return this.darkctx.getImageData(8*GU, 4.5*GU,1,1).data[3];
}

GameState.prototype.showMenu = function(){
    console.log("SHOWMENU");
    document.addEventListener('keydown', this.keydownMenuListener);
    this.menuDiv.style.display = 'block';

    document.removeEventListener('keydown', this.keydownGameListener);
    document.removeEventListener('keyup', this.keyupGameListener);
    BLUR = true;
    this.menu = true;
}

GameState.prototype.hideMenu = function(){
    this.menuDiv.style.display = 'none';
    console.log("HIDEMENU");
    document.removeEventListener('keydown', this.keydownMenuListener);
    document.addEventListener('keydown', this.keydownGameListener);
    document.addEventListener('keyup', this.keyupGameListener);
    BLUR = false;
    SELF_NAME = "this has to be set to something random as an ugly hack, yo";
    this.menu = false;
}


GameState.prototype.update = function(){

    if(this.renderable && !this.menu && !SELF_NAME){
        this.showMenu();
    }

    this.player.update();

    if(this.textalizer > 0){
        this.textalizer--;
    }

    var firefly;
    for(var i = 0; i < this.fireflies.length;i++){
        firefly = this.fireflies[i];
        if(firefly == undefined) continue;
        firefly.update();

        if(Math.abs(firefly.x-this.player.x) < Player.REACH
                && Math.abs(firefly.y-this.player.y) < Player.REACH){
            
            this.score++;
            this.player.eatFirefly(firefly);
            //Delete firefly;
            var fire = this.fireflies.pop();
            if(i < this.fireflies.length){
                this.fireflies[i--] = fire;
            }
        }
    }
    for(var i = 0; i<this.numLightHouses;i++){
        //this.lightHouses[i].update();
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
