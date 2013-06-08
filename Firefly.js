function Firefly(x,y){
    this.x = x||0;
    this.y = y||0;
    this.dx = 0;
    this.dy = 0;
    this.size = 0.2;
    this.direction = 0;
    this.scootchInterval = 20;

}

Firefly.FRICTION = 0.8;
Firefly.SPEED = 0.008;

Firefly.prototype.update = function() {
    dir = chooseDirection();
    this.dx = dir[0];
    this.dy = dir[1];
    console.log(""+this.x+" " + this.y);
    var speed = Math.sqrt(this.dx*this.dx + this.dy*this.dy);

    if(speed > 1){
        this.dx = this.dx / speed;
        this.dy = this.dy / speed;
    }
    
    this.x += this.dx * Firefly.SPEED;
    this.y += this.dy * Firefly.SPEED;
    this.dx *= Firefly.FRICTION;
    this.dy *= Firefly.FRICTION;





}

Firefly.prototype.render = function(ctx){
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x*GU,this.y*GU,this.size*GU,this.size*GU);
}

function chooseDirection(){
    return [1,1];

}
