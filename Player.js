var Player = (function(){

function Player(game, params){ 
    this.id = params.id;

    this.game = game;

    this.color = params.color || {r:255, g:255, b: 255};

    this.name = params.name || "";
    
    this.socket;

    this.x = params.x || 0;
    this.y = params.y || 0;
    this.dx = params.dx || 0;
    this.dy = params.dy || 0;

    this.bomb_place_cooldown = Player.BOMB_PLACE_COOLDOWN;

    this.KEYS = [];
    this.KEYS.ESC = 27;
    this.KEYS.SPACE = 32;
    this.KEYS.UP = 38;
    this.KEYS.DOWN = 40;
    this.KEYS.LEFT = 37;
    this.KEYS.RIGHT = 39;

    this.playerSize = 0.5;
    this.hitBox = 0.15;

    for(var i=0;i<256;i++){
        this.KEYS[i] = false;
    }

    try{
    this.personfront = new Image();
    this.personfront.src = "personfront.png";
    this.personback = new Image();
    this.personback.src = "personback.png";
    
    this.personside = new Image();
    this.personside.src = "personside.png";
        
    this.personleft = new Image();
    this.personleft.src = "personleft.png";
    
    this.personimages = {"down": this.personfront, "up": this.personback,
    					 "right": this.personside, "left": this.personleft};
    					 
    this.personDirection = params.personDirection || "down";

    }catch(e){}
}

Player.BOMB_PLACE_COOLDOWN = 40;
Player.FRICTION = 0.8;
Player.SPEED = 0.08;

Player.prototype.update = function(){

    if(this.KEYS[this.KEYS.LEFT]){
        this.dx = -1;
        this.personDirection = "left";
    }

    if(this.KEYS[this.KEYS.RIGHT]){
        this.dx = 1;
        this.personDirection = "right";
    }

    if(this.KEYS[this.KEYS.UP]){
        this.dy = -1;
        this.personDirection =  "up";
    }

    if(this.KEYS[this.KEYS.DOWN]){
        this.dy = 1;
        this.personDirection = "down";
    }

    if(this.KEYS[this.KEYS.SPACE] && this.bomb_place_cooldown == 0){
        this.game.placeBomb(this.x, this.y, 999);
        this.bomb_place_cooldown = Player.BOMB_PLACE_COOLDOWN;
    }

    var speed = Math.sqrt(this.dx*this.dx + this.dy*this.dy);

    if(speed > 1) {
        this.dx = this.dx / speed;
        this.dy = this.dy / speed;
    }
    var lastx = this.x;
    var lasty = this.y;

    this.x += this.dx * Player.SPEED;
    this.y += this.dy * Player.SPEED;
    this.dx *= Player.FRICTION;
    this.dy *= Player.FRICTION;

    if(this.x <= 0 || this.game.maze.collide(this.x+this.hitBox,this.y+this.hitBox) == true
            || this.game.maze.collide(this.x+this.hitBox,this.y-this.hitBox) == true
            || this.game.maze.collide(this.x-this.hitBox,this.y+this.hitBox) == true
            || this.game.maze.collide(this.x-this.hitBox,this.y-this.hitBox) == true
            ){

        //collision in x direction
        if(this.x <= 0 ||  this.game.maze.collide(this.x+this.hitBox,lasty+this.hitBox) == true 
                || this.game.maze.collide(this.x+this.hitBox,lasty-this.hitBox)== true
                || this.game.maze.collide(this.x-this.hitBox,lasty+this.hitBox)== true
                || this.game.maze.collide(this.x-this.hitBox,lasty-this.hitBox)== true
                ){
            this.x = lastx;
            this.dx = 0;
            console.log("hit x");
        }

        //collision in y direction
        if(this.game.maze.collide(lastx+this.hitBox,this.y+this.hitBox) == true
                || this.game.maze.collide(lastx+this.hitBox,this.y-this.hitBox) == true
                || this.game.maze.collide(lastx-this.hitBox,this.y+this.hitBox) == true
                || this.game.maze.collide(lastx-this.hitBox,this.y-this.hitBox) == true
                ){
            this.y = lasty;
            this.dy = 0;
            console.log("hit y");

        }
    }

    if(this.bomb_place_cooldown > 0){
        this.bomb_place_cooldown--;
    }
}


Player.prototype.render = function(ctx){
    ctx.drawImage(this.personimages[this.personDirection], this.x*GU-GU*this.playerSize/2, 
        this.y*GU-GU*this.playerSize/2, GU*this.playerSize,GU*this.playerSize); 

    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.font = (0.2*GU) + 'px Arial'; //TODO: cooler font
    ctx.fillStyle = 'white';
    ctx.fillText('[' + this.id + '] ' + (this.name || 'anonymous'), (this.x)*GU, (this.y - this.playerSize)*GU);
}

Player.prototype.serialize = function(){
    return {id: this.id, name: this.name, x: this.x, y: this.y, dx: this.dx, dy: this.dy, color: this.color,
            personDirection: this.personDirection};
}

return Player;

})();


try{
    module.exports = Player;
}catch(e){}
