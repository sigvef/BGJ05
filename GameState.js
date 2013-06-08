try{
var Maze = require('./Maze');
var LightBomb = require('./LightBomb');
}catch(e){}

GameState = (function(){

    function GameState(socket, renderable){
        this.maze = {};
        this.players = {};
        this.bombs = [];
        this.player_id_counter = 1;

        this.renderable = renderable;

        if(this.renderable){
            this.darkvas = document.createElement('canvas');
            this.darkctx = this.darkvas.getContext('2d');
        }
    }

    GameState.prototype.createFrame = function(){
        var frame = {};
       for(var i in this.players){
            keyframe.players[i] = this.players[i].serialize();
       }
       return frame;
    }

    GameState.prototype.createKeyframe = function(){
       var keyframe = {};
       keyframe.maze = this.maze;
       keyframe.players = {};
       keyframe.bombs = [];

       for(var i in this.players){
            keyframe.players[i] = this.players[i].serialize();
       }

       for(var i in this.bombs){
            keyframe.bombs[i] = this.bombs[i].serialize();
       }

       return keyframe;
    }

    GameState.prototype.loadFrame = function(frame){
       this.players = {};
       for(var i in keyframe.players){
            var player = new Player(this, keyframe.players[i]); 
            this.players[i] = player;
       }
    }

    GameState.prototype.loadKeyframe = function(keyframe){
        this.players = {};
        this.bombs = [];

       for(var i in keyframe.players){
            var player = new Player(this, keyframe.players[i]); 
            this.players[i] = player;
       }

       for(var i in keyframe.bombs){
            var bomb = new LightBomb(keyframe.bombs[i]); 
            this.bombs[i] = bomb;
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
        this.bombs.push(new LightBomb({x:x, y:y, duration_in_ms: duration}));
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

            for(var i in this.players){
                this.players[i].render(ctx);
            }

            ctx.save();
            ctx.drawImage(this.darkvas, 0, 0);
            ctx.restore();

            SELF_ID && this.players[SELF_ID].render(ctx);

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
                Array.remove(this.bombs, i--);
            }
        }
    }

    return GameState;

})();

try{
    module.exports = GameState;
}catch(e){}
