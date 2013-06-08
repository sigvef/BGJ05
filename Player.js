function Player(x,y){
    this.x = x || 0;
    this.y = y || 0;
    this.dx = 0;
    this.dy = 0;
}

Player.FRICTION = 0.8;
Player.SPEED = 0.05;

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

    this.x += this.dx * Player.SPEED;
    this.y += this.dy * Player.SPEED;
    this.dx *= Player.FRICTION;
    this.dy *= Player.FRICTION;
}


Player.prototype.render = function(ctx){
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x*GU, this.y*GU, GU*0.2, GU*0.2); 
}

