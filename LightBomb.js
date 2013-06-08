function LightBomb(x,y, duration_in_ms){
    this.x = x || 0;
    this.y = y || 0;
    this.planted_time = t;
    this.duration_in_ms = duration_in_ms;
}

LightBomb.ALIVE_TIME_IN_MS = 10000;
LightBomb.BANDWIDTH = 2000;

LightBomb.canvas = document.createElement('canvas');
LightBomb.ctx = LightBomb.canvas.getContext('2d');
/* TODO: resize this when needed */
LightBomb.canvas.width = 1920;
LightBomb.canvas.height = 1080;

LightBomb.prototype.update = function(){
    if((t - this.planted_time - this.duration_in_ms) > LightBomb.ALIVE_TIME_IN_MS){
        return true;
    }
};

LightBomb.prototype.render = function(ctx){

    if(this.planted_time + this.duration_in_ms > t){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x*GU, this.y*GU, GU*0.1, GU*0.1);
        ctx.fillStyle = 'white';
        ctx.fillText("" + (this.duration_in_ms - t + this.planted_time)/1000|0, this.x*GU, this.y*GU);
    }else{
        LightBomb.canvas.width = LightBomb.canvas.width;
        LightBomb.ctx.fillStyle = 'rgba(255,255,255,' + lerp(0.2, 0, 1 - (t - this.planted_time - this.duration_in_ms)/LightBomb.ALIVE_TIME_IN_MS) + ')';
        LightBomb.ctx.beginPath();
        LightBomb.ctx.arc(this.x*GU, this.y*GU, (t - this.planted_time - this.duration_in_ms)/1000*GU, 0, 2 * Math.PI, false);
        LightBomb.ctx.fill();
        LightBomb.ctx.globalCompositeOperation = 'destination-out';
        LightBomb.ctx.fillStyle = 'black';
        LightBomb.ctx.beginPath();
        var radius = (t - this.planted_time - this.duration_in_ms - LightBomb.BANDWIDTH)/1000*GU;
        LightBomb.ctx.arc(this.x*GU, this.y*GU, radius >= 0 ? radius : 0, 0, 2 * Math.PI, false);
        LightBomb.ctx.fill();

        ctx.drawImage(LightBomb.canvas, 0, 0);
    }
};
