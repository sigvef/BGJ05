function Firefly(x,y){
    this.x = x||0;
    this.y = y||0;
    this.dx = 0;
    this.dy = 0;
    this.size = 0.02;
    this.auraSize = .80;
    this.direction = 0;
    //inerval between jumps in ms
    this.scootchInterval = 2000 + 500*Math.random();
    //time of last jump in ms
    this.lastScootch = t + 2000*Math.random();

}

Firefly.FRICTION = 0.8;
Firefly.SPEED = 0.08;
Firefly.canvas = document.createElement('canvas');
Firefly.ctx = Firefly.canvas.getContext('2d');

Firefly.prototype.update = function(){

    //console.log("time to scootch:" + (this.scootchInterval-(t-this.lastScootch)));
   if(t-this.lastScootch > this.scootchInterval){
       this.dx = 2*Math.random() - 1;
       this.dy = 2*Math.random() - 1;
       this.lastScootch = t;
   }
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

Firefly.prototype.render = function(ctx, darkctx, viewport){
    //firefly light
    var nx = this.x*GU;
    var ny = this.y*GU;
    var r = this.auraSize*GU;
    Firefly.canvas.width = darkctx.canvas.width;
    Firefly.canvas.height = darkctx.canvas.height;
    Firefly.ctx.translate(Math.floor(-viewport.x*GU+0.5*GU),Math.floor(-viewport.y*GU+0.5*GU));
    //Firefly.ctx.fillStyle = 'rgba(255,255,255,' + square_interpolation(1,0,1) +')';
    Firefly.ctx.beginPath();
    var rad = Firefly.ctx.createRadialGradient(nx,ny,0,nx,ny,r);
    rad.addColorStop(0,'rgba(255,255,255,1)');
    rad.addColorStop(0.2,'rgba(255,255,255,0.2)');
    rad.addColorStop(1,'rgba(255,255,255,0)');
    Firefly.ctx.fillStyle = rad;
    Firefly.ctx.arc(this.x*GU,this.y*GU,this.auraSize*GU,0,2*Math.PI,false);
    Firefly.ctx.fill();
    Firefly.ctx.globalCompositeOperation = 'destination-out';

    //the firefly
    ctx.fillStyle = "white";//well, this line seems to do nothing. no idea why.
    ctx.beginPath();
    ctx.arc(this.x*GU,this.y*GU,this.size*GU,0,2*Math.PI,false);
    ctx.fill();

    darkctx.globalCompositeOperation = 'destination-out';
    darkctx.drawImage(Firefly.canvas,0,0);
}

