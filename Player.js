function Player(x,y){
    this.x = x || 0;
    this.y = y || 0;
    this.dx = 0;
    this.dy = 0;

    this.bomb_place_cooldown = Player.BOMB_PLACE_COOLDOWN;
}

Player.BOMB_PLACE_COOLDOWN = 10;
Player.FRICTION = 0.8;
Player.SPEED = 0.08;

Player.prototype.update = function(){

    if(KEYS[KEYS.LEFT]){
        this.dx = -1;
    }

    if(KEYS[KEYS.RIGHT]){
        this.dx = 1;
    }

    if(KEYS[KEYS.UP]){
        this.dy = -1;
    }

    if(KEYS[KEYS.DOWN]){
        this.dy = 1;
    }

    if(KEYS[KEYS.SPACE] && this.bomb_place_cooldown == 0){
        sm.activeState.placeBomb(this.x, this.y, 999);
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

    if(this.x <= 0 || sm.activeState.maze.collide(this.x,this.y) == true){
        //collision in x direction
        if(this.x <= 0 ||  sm.activeState.maze.collide(this.x,lasty) == true){
            this.x = lastx;
            this.dx = 0;
            console.log("hit x");

        }

        //collision in y direction
        if(sm.activeState.maze.collide(lastx,this.y) == true){
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
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x*GU, this.y*GU, GU*0.2, GU*0.2); 
}

