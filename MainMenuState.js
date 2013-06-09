function MainMenuState(){
    var that = this;

}

MainMenuState.prototype.init = function(){
}

MainMenuState.prototype.pause = function(){
}

MainMenuState.prototype.resume = function(){
}

MainMenuState.prototype.render = function(ctx){


    ctx.drawImage(this.titleImage, 0, 0, 16*GU, 9*GU);
}

MainMenuState.prototype.update = function(){
}
