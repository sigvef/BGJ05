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
        sm.activeState.placeBomb(this.x, this.y, 3999);
        this.bomb_place_cooldown = Player.BOMB_PLACE_COOLDOWN;
    }

    var speed = Math.sqrt(this.dx*this.dx + this.dy*this.dy);

    if(speed > 1) {
        this.dx = this.dx / speed;
        this.dy = this.dy / speed;
    }

    this.x += this.dx * Player.SPEED;
    this.y += this.dy * Player.SPEED;
    this.dx *= Player.FRICTION;
    this.dy *= Player.FRICTION;

    if(this.bomb_place_cooldown > 0){
        this.bomb_place_cooldown--;
    }
}


Player.prototype.render = function(ctx){
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x*GU, this.y*GU, GU*0.2, GU*0.2); 
}

