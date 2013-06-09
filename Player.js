function Player(x,y,game){
    this.game = game;
    this.x = x || 0;
    this.y = y || 0;
    this.dx = 0;
    this.dy = 0;
    this.hp = Player.START_HP;
    this.playerSize = 0.5;
    this.hitBox = 0.05;

    this.bomb_place_cooldown = Player.BOMB_PLACE_COOLDOWN;

    this.KEYS = [];
    this.KEYS.ESC = 27;
    this.KEYS.SPACE = 32;
    this.KEYS.UP = 38;
    this.KEYS.DOWN = 40;
    this.KEYS.LEFT = 37;
    this.KEYS.RIGHT = 39;

    for(var i=0;i<256;i++){
        this.KEYS[i] = false;
    }

    
    this.personimages = {"down": this.personfront, "up": this.personback,
    					 "right": this.personside, "left": this.personleft};
    					 
    this.personDirection = "down";

}

Player.prototype.personfront = loadImage("personfront.png");
Player.prototype.personback = loadImage("personback.png");
Player.prototype.personside = loadImage("personside.png");
Player.prototype.personleft = loadImage("personleft.png");

Player.BOMB_PLACE_COOLDOWN = 40;
Player.FRICTION = 0.8;
Player.SPEED = 0.08;
Player.START_HP = 0.03;
Player.MAX_HP = 1;

Player.canvas = document.createElement('canvas');
Player.ctx = Player.canvas.getContext('2d');


Player.prototype.eatFirefly = function(firefly){
    this.hp += 0.03;
    if(this.hp > Player.MAX_HP){
        this.hp = Player.MAX_HP;
    }


    if(this.game.score % 5 != 1){
        this.game.sfx.takeFirefly.superplay();
    }else{
        this.game.sfx.celebrate.superplay();
    }
    
}

Player.prototype.update = function(){


    if(this.game.getPlayerLight() > 250){
        this.hp -= 0.001;
    }

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
        this.game.placeBomb(this.x, this.y, 999, 3000);
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

    if(this.game.maze.collide(this.x+this.hitBox,this.y+this.hitBox) == true
            || this.game.maze.collide(this.x+this.hitBox,this.y-this.hitBox) == true
            || this.game.maze.collide(this.x-this.hitBox,this.y+this.hitBox) == true
            || this.game.maze.collide(this.x-this.hitBox,this.y-this.hitBox) == true
            ){

        //collision in x direction
        if(this.game.maze.collide(this.x+this.hitBox,lasty+this.hitBox) == true 
                || this.game.maze.collide(this.x+this.hitBox,lasty-this.hitBox)== true
                || this.game.maze.collide(this.x-this.hitBox,lasty+this.hitBox)== true
                || this.game.maze.collide(this.x-this.hitBox,lasty-this.hitBox)== true
                ){
            this.x = lastx;
            this.dx = 0;
            //console.log("hit x");
        }

        //collision in y direction
        if(this.game.maze.collide(lastx+this.hitBox,this.y+this.hitBox) == true
                || this.game.maze.collide(lastx+this.hitBox,this.y-this.hitBox) == true
                || this.game.maze.collide(lastx-this.hitBox,this.y+this.hitBox) == true
                || this.game.maze.collide(lastx-this.hitBox,this.y-this.hitBox) == true
                ){
            this.y = lasty;
            this.dy = 0;
            //console.log("hit y");

        }
    }

    if(this.bomb_place_cooldown > 0){
        this.bomb_place_cooldown--;
    }
}


Player.prototype.render = function(ctx, darkctx, viewport){
    var nx = this.x*GU;//+GU*this.playerSize/2;
    var ny = this.y*GU;//+GU*this.playerSize/2;
    var r = Math.max(this.hp*GU,0);
    Player.canvas.width = darkctx.canvas.width;
    Player.canvas.height = darkctx.canvas.height;
    Player.ctx.translate(Math.floor(-viewport.x*GU+0.5*GU),Math.floor(-viewport.y*GU+0.5*GU));
    Player.ctx.beginPath();
    var rad = Player.ctx.createRadialGradient(nx,ny,0,nx,ny,r);
    rad.addColorStop(0,'rgba(255,0,255,1)');
    rad.addColorStop(0.9,'rgba(255,0,255,0.1)');
    rad.addColorStop(1,'rgba(255,0,255,0)');
    Player.ctx.fillStyle = rad;
    Player.ctx.arc(nx,ny,r,0,2*Math.PI,false);
    Player.ctx.fill();
    Player.ctx.globalCompositeOperation = 'destination-out';

    darkctx.globalCompositeOperation = 'destination-out';
    darkctx.drawImage(Player.canvas,0,0);

    var rad = ctx.createRadialGradient(nx,ny,0,nx,ny,r);
    rad.addColorStop(0,'rgba(0,250,0,1)');
    rad.addColorStop(0.9,'rgba(0,250,255,0.1)');
    rad.addColorStop(1,'rgba(0,255,0,0)');
    ctx.fillStyle = rad;
    ctx.arc(nx,ny,r,0,2*Math.PI,false);
    ctx.fill();

 
    ctx.drawImage(this.personimages[this.personDirection], this.x*GU-GU*this.playerSize/2, 
        this.y*GU-GU*this.playerSize/2, GU*this.playerSize,GU*this.playerSize); 
}

Player.prototype.serialize = function(){
    return {id: this.id, name: this.name, x: this.x, y: this.y, dx: this.dx, dy: this.dy,
            personDirection: this.personDirection};
}
