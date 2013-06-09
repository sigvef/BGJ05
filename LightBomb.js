function LightBomb(x, y, duration_in_ms, blast_duration){
    this.x = x || 0;
    this.y = y || 0;
    this.blast_duration = blast_duration;
    this.planted_time = t;
    this.duration_in_ms = duration_in_ms;
}

LightBomb.BANDWIDTH = 2000;

LightBomb.canvas = document.createElement('canvas');
LightBomb.ctx = LightBomb.canvas.getContext('2d');

LightBomb.prototype.update = function(){
    if((t - this.planted_time - this.duration_in_ms) > this.blast_duration){
        return true;
    }
};

LightBomb.prototype.render_light = function(darkctx, viewport){

    if(this.planted_time + this.duration_in_ms <= t){
        LightBomb.canvas.width = darkctx.canvas.width;
        LightBomb.canvas.height = darkctx.canvas.height;
        LightBomb.ctx.translate(Math.floor(-viewport.x*GU+0.5*GU), Math.floor(-viewport.y*GU+0.5*GU));
        var time_percent = 1 - (t - this.planted_time - this.duration_in_ms)/this.blast_duration;
        LightBomb.ctx.fillStyle = 'rgba(255,255,255,' + square_interpolation(1, 0, time_percent)  + ')';
        LightBomb.ctx.beginPath();
        LightBomb.ctx.arc(this.x*GU, this.y*GU, (t - this.planted_time - this.duration_in_ms)/1000*GU, 0, 2 * Math.PI, false);
        LightBomb.ctx.fill();
        LightBomb.ctx.globalCompositeOperation = 'destination-out';
        LightBomb.ctx.fillStyle = 'black';
        LightBomb.ctx.beginPath();
        var radius = (t - this.planted_time - this.duration_in_ms - LightBomb.BANDWIDTH)/1000*GU;
        LightBomb.ctx.arc(this.x*GU, this.y*GU, radius >= 0 ? radius : 0, 0, 2 * Math.PI, false);
        LightBomb.ctx.fill();

        darkctx.globalCompositeOperation = 'destination-out';
        darkctx.drawImage(LightBomb.canvas,0,0);// -viewport.x*GU, -viewport.y*GU);
    }

}

LightBomb.prototype.render = function(ctx){
    if(this.planted_time + this.duration_in_ms > t){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x*GU, this.y*GU, GU*0.1, GU*0.1);
        ctx.fillStyle = 'white';
        ctx.fillText("" + (this.duration_in_ms - t + this.planted_time)/1000|0, this.x*GU, this.y*GU);
    }
};
