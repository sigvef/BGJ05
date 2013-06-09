function Firefly(x,y){
    this.x = x||0;
    this.y = y||0;
    this.dx = 0;
    this.dy = 0;
    this.size = 0.02;
    this.direction = 0;
    //inerval between jumps in ms
    this.scootchInterval = 2000 + 500*Math.random();
    //time of last jump in ms
    this.lastScootch = t + 2000*Math.random();
}

Firefly.AURASIZE = .80;
Firefly.FRICTION = 0.8;
Firefly.SPEED = 0.08;
try{
}catch(e){}

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

Firefly.canvas = (function(){
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    //firefly light
    var some_largeish_number = 100;
    var r = Firefly.AURASIZE*some_largeish_number/2;
    canvas.width = Firefly.AURASIZE*some_largeish_number;
    canvas.height = canvas.width;
    var x = canvas.width/2;
    var y = canvas.height/2;
    var rad = ctx.createRadialGradient(x,y,0,x,y,r);
    ctx.beginPath();
    rad.addColorStop(0,'rgba(255,255,255,1)');
    rad.addColorStop(0.2,'rgba(255,255,255,0.1)');
    rad.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = rad;
    ctx.arc(x,y,Firefly.AURASIZE*some_largeish_number/2,0,2*Math.PI,false);
    ctx.fill();

    setTimeout(function(){
        document.body.appendChild(canvas);
    }, 1000);

    return canvas;
})();

Firefly.prototype.render = function(ctx, darkctx, viewport){

    darkctx.save();
    var nx = this.x*GU;
    var ny = this.y*GU;
    darkctx.translate(Math.floor(-viewport.x*GU+0.5*GU),Math.floor(-viewport.y*GU+0.5*GU));
    darkctx.translate(-Firefly.canvas.width/2, -Firefly.canvas.width/2);
    darkctx.translate(this.x*GU, this.y*GU);
    darkctx.globalCompositeOperation = 'destination-out';
    var scaler = GU/Firefly.canvas.width;
    //darkctx.scale(scaler,scaler);
    darkctx.drawImage(Firefly.canvas,0,0);
    darkctx.restore();

    ctx.save();
    //ctx.translate(Math.floor(viewport.x*GU+0.5*GU),Math.floor(viewport.y*GU+0.5*GU));
    ctx.fillStyle = "pink";
    ctx.fillRect(nx, ny, 20, 20);
    ctx.restore();
}

try{
    module.exports = Firefly;
}catch(e){}
