function MainMenuState(){
    var that = this;
    this.keydownListener = function(e){
        if(e.keyCode == 32) { //space
            sm.changeState('game'); 
        }
    }
}

MainMenuState.prototype.init = function(){
}

MainMenuState.prototype.pause = function(){
    document.removeEventListener('keydown', this.keydownListener);
}

MainMenuState.prototype.resume = function(){
    document.addEventListener('keydown', this.keydownListener);
}

MainMenuState.prototype.render = function(ctx){
    ctx.fillStyle = 'maroon';
    ctx.fillRect(0,0, 16*GU, 9*GU);
    ctx.fillStyle = 'black';
    ctx.font = '45px Arial';
    ctx.fillText('Hello world, this is the main menu', 1*GU, 1*GU);
    ctx.fillText('Press space to start', 1*GU, 2*GU);
}

MainMenuState.prototype.update = function(){
}
