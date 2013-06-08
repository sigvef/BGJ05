function StateManager(){
    this.states = {};
    this.activeState;
}

StateManager.prototype.addState = function(name, state){
    state.init();
    this.states[name] = state;
}

StateManager.prototype.changeState = function(name){
    console.log("Changing to state " + name);
    this.oldState = this.activeState;
    this.activeState = this.states[name];
    this.oldState && this.oldState.pause();
    this.activeState.resume();
}

StateManager.prototype.render = function(ctx){
    this.activeState.render(ctx);
}

StateManager.prototype.update = function(){
    this.activeState.update();
}
