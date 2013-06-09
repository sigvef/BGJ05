function Player(x,y){
    this.x = x || 0;
    this.y = y || 0;
    this.dx = 0;
    this.dy = 0;
    this.hp = Player.START_HP;
    this.playerSize = 0.5;
    this.hitBox = 0.05;

    this.bomb_place_cooldown = Player.BOMB_PLACE_COOLDOWN;
    
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
    					 
    this.personDirection = "down";
    
    
}

Player.BOMB_PLACE_COOLDOWN = 10;
Player.FRICTION = 0.8;
Player.SPEED = 0.08;
Player.START_HP = 0.5;

Player.canvas = document.createElement('canvas');
Player.ctx = Player.canvas.getContext('2d');

Player.prototype.update = function(){

    if(KEYS[KEYS.LEFT]){
        this.dx = -1;
        this.personDirection = "left";
    }

    if(KEYS[KEYS.RIGHT]){
        this.dx = 1;
        this.personDirection = "right";
    }

    if(KEYS[KEYS.UP]){
        this.dy = -1;
        this.personDirection =  "up";
    }

    if(KEYS[KEYS.DOWN]){
        this.dy = 1;
        this.personDirection = "down";
    }

    if(KEYS[KEYS.SPACE] && this.bomb_place_cooldown == 0){
        sm.activeState.placeBomb(this.x, this.y, 999, 3000);
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

    if(sm.activeState.maze.collide(this.x+this.hitBox,this.y+this.hitBox) == true
            || sm.activeState.maze.collide(this.x+this.hitBox,this.y-this.hitBox) == true
            || sm.activeState.maze.collide(this.x-this.hitBox,this.y+this.hitBox) == true
            || sm.activeState.maze.collide(this.x-this.hitBox,this.y-this.hitBox) == true
            ){

        //collision in x direction
        if(sm.activeState.maze.collide(this.x+this.hitBox,lasty+this.hitBox) == true 
                || sm.activeState.maze.collide(this.x+this.hitBox,lasty-this.hitBox)== true
                || sm.activeState.maze.collide(this.x-this.hitBox,lasty+this.hitBox)== true
                || sm.activeState.maze.collide(this.x-this.hitBox,lasty-this.hitBox)== true
                ){
            this.x = lastx;
            this.dx = 0;
            //console.log("hit x");
        }

        //collision in y direction
        if(sm.activeState.maze.collide(lastx+this.hitBox,this.y+this.hitBox) == true
                || sm.activeState.maze.collide(lastx+this.hitBox,this.y-this.hitBox) == true
                || sm.activeState.maze.collide(lastx-this.hitBox,this.y+this.hitBox) == true
                || sm.activeState.maze.collide(lastx-this.hitBox,this.y-this.hitBox) == true
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
    var r = this.hp*GU;
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

