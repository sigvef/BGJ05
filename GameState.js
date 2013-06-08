GameState = (function(){

    function GameState(socket, renderable){
        this.maze;
        this.players = {};
        this.bombs = [];
        this.player_id_counter = 0;

        this.renderable = renderable;

        if(this.renderable){
            this.darkvas = document.createElement('canvas');
            this.darkctx = this.darkvas.getContext('2d');
        }
    }

    GameState.prototype.addPlayer = function(player){
        player.id = this.player_id_counter++; 
        this.players[player.id] = player;
    }

    GameState.prototype.removePlayer = function(player){
        delete this.players[player.id];
    }

    GameState.prototype.placeBomb = function(x,y,duration){
        this.bombs.push(new LightBomb(x,y,duration));
    }

    GameState.prototype.init = function(){
    }

    GameState.prototype.pause = function(){
    }

    GameState.prototype.resume = function(){
        this.maze = new Maze();
        this.player = new Player(1,1);
    }

    GameState.prototype.render = function(ctx){

        if(this.renderable){
            this.darkvas.width = 16*GU;
            this.darkvas.height = 9*GU;

            this.darkctx.fillStyle = 'black';
            this.darkctx.fillRect(0,0, 16*GU, 9*GU);

            this.maze.render(ctx, 0, 0, 16, 9);

            for(var i=0;i<this.bombs.length;i++){
                this.bombs[i].render_light(this.darkctx);
            }

            ctx.save();
            ctx.globalAlpha = 0.98;
            //ctx.drawImage(this.darkvas, 0, 0);
            ctx.restore();

            this.player.render(ctx);

            for(var i=0;i<this.bombs.length;i++){
                this.bombs[i].render(ctx);
            }
        }
    }

    GameState.prototype.update = function(){
        for(var i in this.players){
            this.players[i].update();
        }

        for(var i=0;i<this.bombs.length;i++){
            if(this.bombs[i].update()){
                this.bombs.remove(i--);
            }
        }
    }

    return GameState;

})();

try{
    console.log("THIS MOODUULLEE!");
    module.exports = GameState;
}catch(e){}
