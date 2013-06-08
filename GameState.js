try{
var Maze = require('./Maze');
}catch(e){}

GameState = (function(){

    function GameState(socket, renderable){
        this.maze = {};
        this.players = {};
        this.bombs = [];
        this.player_id_counter = 0;

        this.renderable = renderable;

        if(this.renderable){
            this.darkvas = document.createElement('canvas');
            this.darkctx = this.darkvas.getContext('2d');
        }
    }


    GameState.prototype.createKeyframe = function(){
       var keyframe = {};
       keyframe.maze = this.maze;
       keyframe.players = {};

       for(var i in this.players){
            var p = this.players[i];
            keyframe.players[i] = {id: p.id, name: p.name, x: p.x, y: p.y, dx: p.dx, dy: p.dy};
       }
       return keyframe;
    }

    GameState.prototype.loadKeyframe = function(keyframe){
        this.players = {};
       for(var i in keyframe.players){
            var p = keyframe.players[i];
            var player = new Player(p.id); 
            player.name = p.name;
            player.x = p.x;
            player.y = p.y;
            player.dx = p.dx;
            player.dy = p.dy;
            this.players[i] = player;
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

            for(var i in this.players){
                this.players[i].render(ctx);
            }

            /*
            for(var i=0;i<this.bombs.length;i++){
                this.bombs[i].render(ctx);
            }
            */
        }
    }

    GameState.prototype.update = function(){
        for(var i in this.players){
            this.players[i].update();
        }

        /*
        for(var i=0;i<this.bombs.length;i++){
            if(this.bombs[i].update()){
                this.bombs.remove(i--);
            }
        }
        */
    }

    return GameState;

})();

try{
    module.exports = GameState;
}catch(e){}
