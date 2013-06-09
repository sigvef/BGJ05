function LightHouse(x, y){
    this.x = x;
    this.y = y;
    this.size = 2;
    this.pulseInterval = 10000;
    this.lastPulse = -1000; //Pulse at the start!
}

LightHouse.prototype.update = function(){
    if(t - this.lastPulse > this.pulseInterval){
        sm.activeState.placeBomb(this.x, this.y, 10, 40000);
        this.lastPulse = t;
    }

}

LightHouse.canvas = document.createElement('canvas');
LightHouse.ctx = LightHouse.canvas.getContext('2d');

LightHouse.prototype.render = function(darkctx, viewport){
    LightHouse.canvas.width = darkctx.canvas.width;
    LightHouse.canvas.height = darkctx.canvas.height;
    
    LightHouse.ctx.translate(Math.floor(-viewport.x*GU),Math.floor(-viewport.y*GU));
    //LightHouse.ctx.fillStyle = 'rgba(255,255,255,' + square_interpolation(1,0,1) +')';
    LightHouse.ctx.beginPath();
    var rad = LightHouse.ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.size*GU);
    rad.addColorStop(0,'rgba(255,255,255,1)');
    rad.addColorStop(0.6,'rgba(255,255,255,1)');
    rad.addColorStop(1,'rgba(255,255,255,0)');
    LightHouse.ctx.fillStyle = rad;
    LightHouse.ctx.arc(this.x*GU,this.y*GU,this.size*GU,0,2*Math.PI,false);
    LightHouse.ctx.fill();
    //LightHouse.ctx.globalCompositeOperation = 'destination-out';


    darkctx.globalCompositeOperation = 'destination-out';
    darkctx.drawImage(LightHouse.canvas,0,0);

}
