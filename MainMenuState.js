function MainMenuState(){
    var that = this;
    this.keydownListener = function(e){
        if(e.keyCode == 13) { //enter
            sm.changeState('game'); 
        }
    }

    this.namefield = document.createElement('input');
}

MainMenuState.prototype.init = function(){
}

MainMenuState.prototype.pause = function(){
    document.removeEventListener('keydown', this.keydownListener);
    document.removeEventListener('keypress', this.keypressListener);
    document.body.removeChild(this.namefield);
}

MainMenuState.prototype.resume = function(){
    document.addEventListener('keydown', this.keydownListener);
    document.addEventListener('keypress', this.keypressListener);
    document.body.appendChild(this.namefield);
    this.namefield.focus();
}

MainMenuState.prototype.render = function(ctx){

    var padding = 0.5*GU;
    var width = 8*GU;

    this.namefield.style.position = 'fixed';
    this.namefield.style.zIndex = 99999;
    this.namefield.style.font = 1*GU + 'px Arial';
    this.namefield.style.width = width + 'px';
    this.namefield.style.height = 2*GU + 'px';
    this.namefield.style.top = window.innerHeight/2 - padding/2 + 'px';
    this.namefield.style.left = window.innerWidth/2 - width/2 - padding + 'px';
    this.namefield.style.padding = padding + 'px';
    this.namefield.style.border = '0';
    this.namefield.style.background = 'rgba(0,0,0,0.5)';
    this.namefield.style.color = 'white';
    this.namefield.style.borderRadius = GU+'px';
    this.namefield.placeholder = "Enter your name";


    ctx.fillStyle = 'maroon';
    ctx.fillRect(0,0, 16*GU, 9*GU);
    ctx.fillStyle = 'black';
    ctx.font = '45px Arial';
    ctx.fillText('Walk in the light', 1*GU, 1*GU);
}

MainMenuState.prototype.update = function(){
}
