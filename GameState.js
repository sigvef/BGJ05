function GameState(){
}

GameState.prototype.init = function(){
}

GameState.prototype.pause = function(){
}

GameState.prototype.resume = function(){
}

GameState.prototype.render = function(ctx){
    ctx.fillStyle = 'darkblue';
    ctx.fillRect(0,0, 16*GU, 9*GU);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 45px Arial';
    ctx.fillText('AHOY, THIS IS THE GAME STATE YO!', 1*GU, 1*GU);
    ctx.fillText('press esc to leave', 1*GU, 7*GU);
}

GameState.prototype.update = function(){
    if(KEYS[KEYS.ESC]){
        sm.changeState('mainmenu'); 
    }
}
