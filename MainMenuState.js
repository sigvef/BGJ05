function MainMenuState(){
}

MainMenuState.prototype.init = function(){
}

MainMenuState.prototype.pause = function(){
}

MainMenuState.prototype.resume = function(){
}

MainMenuState.prototype.render = function(ctx){
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0, 16*GU, 9*GU);
    ctx.fillStyle = 'black';
    ctx.font = '45px Arial';
    ctx.fillText('Hello world, this is the main menu', 1*GU, 1*GU);
}

MainMenuState.prototype.update = function(){
}
