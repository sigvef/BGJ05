function LightHouse(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.pulseInterval = 10000;
    this.lastPulse = -1000; //Pulse at the start!
}

LightHouse.prototype.houseImage = loadImage("lighthouse.png");

LightHouse.prototype.update = function(){
    if(t - this.lastPulse > this.pulseInterval){
        sm.activeState.placeBomb(this.x+this.size/2, this.y+this.size/2, 10, 40000);
        this.lastPulse = t;
    }

}

LightHouse.canvas = document.createElement('canvas');
LightHouse.ctx = LightHouse.canvas.getContext('2d');

LightHouse.prototype.render = function(darkctx, viewport){
    LightHouse.canvas.width = darkctx.canvas.width;
    LightHouse.canvas.height = darkctx.canvas.height;
    
    LightHouse.ctx.translate(Math.floor(-viewport.x*GU+0.5*GU),Math.floor(-viewport.y*GU+0.5*GU));
    //LightHouse.ctx.fillStyle = 'rgba(255,255,255,' + square_interpolation(1,0,1) +')';
    LightHouse.ctx.drawImage(this.houseImage,this.x*GU, this.y*GU, this.size*GU, this.size*GU);


    darkctx.globalCompositeOperation = 'destination-out';
    darkctx.drawImage(LightHouse.canvas,0,0);

}
