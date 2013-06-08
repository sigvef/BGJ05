var Player = (function(){

function Player(game, params){ 
    this.id = params.id;

    this.game = game;

    this.nickname = params.name || "";
    
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

    for(var i=0;i<256;i++){
        this.KEYS[i] = false;
    }
}

Player.BOMB_PLACE_COOLDOWN = 10;
Player.FRICTION = 0.8;
Player.SPEED = 0.08;

Player.prototype.update = function(){

    if(this.KEYS[this.KEYS.LEFT]){
        this.dx = -1;
    }

    if(this.KEYS[this.KEYS.RIGHT]){
        this.dx = 1;
    }

    if(this.KEYS[this.KEYS.UP]){
        this.dy = -1;
    }

    if(this.KEYS[this.KEYS.DOWN]){
        this.dy = 1;
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

Player.prototype.serialize = function(){
    return {id: this.id, name: this.name, x: this.x, y: this.y, dx: this.dx, dy: this.dy};
}

return Player;

})();


try{
    module.exports = Player;
}catch(e){}

