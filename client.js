missedGFXFrames = 0;

SELF_NAME = ''

/* smoothstep interpolaties between a and b, at time t from 0 to 1 */
function smoothstep(a, b, t) {
    var v = t * t * (3 - 2 * t);
    return b * v + a * (1 - v);
};

function lerp(a, b, t){
    return (a * t) + (b * (1 - t));
}

function square_interpolation(a, b, t){
    t = t*t; 
    return lerp(a,b,t);
}

function cube_interpolation(a, b, t){
    t = t*t*t;
    return lerp(a,b,t);
}

function clamp(low, x, high){
    return Math.max(low,Math.min(x,high));
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function( callback ){
        window.setTimeout(callback, 0);
    };
})();

function loop(){
    t = +new Date();
    dt += (t-old_time);
    old_time = t;
    while(dt>20){
        sm.update();
        dt-= 20;
    }
    /* clearing canvas */
    canvas.width = canvas.width;
    sm.render(ctx);
    requestAnimFrame(loop);
}

function client(){

    /* global on purpose */
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.style.zIndex = 999;

    sm = new StateManager();

    SELF_ID = 0;

    dt = 0;
    t = +new Date();
    old_time = t;


    /* add game states here */
    
    var game =  new GameState("not sure what this argument was supposed to be", "but this should definately be here!");
    sm.addState("game", game);

    resize();

    document.body.appendChild(canvas);



    game.connect = function(url){

        console.log("doing a connect");
        socket = io.connect('//:8000');

        game.map_asked_for = {};

        game.sendName = function(name){
            socket.emit('set name', name);
        }

        game.keydownGameListener = function(e){
            if(e.keyCode == 27){
                return game.showMenu();
            }
            socket.emit('keydown', e.keyCode);
        }

        game.keyupGameListener = function(e){
            socket.emit('keyup', e.keyCode);
        }

        game.getCellAt = function(global_row, global_col){
            var params = [global_row, global_col];
            if(!game.map_asked_for[params]){
                game.map_asked_for[params] = true;
                socket.emit('maze get cell at', params);
            }
        }

        socket.on('connecting', function () {
            console.log("trying to connect...");
        });

        socket.on('connect', function() {
            console.log("Connected!");
        });

        socket.on('id', function(id){
            SELF_ID = id;
        });

        socket.on('keyframe', function(keyframe){
            game.loadKeyframe(keyframe);
        });

        socket.on('frame', function(frame){
            game.loadFrame(frame);
        });

        socket.on('maze cell at', function(params){
            var cell = new Cell();
            cell.wall = params[0].wall;
            cell.broken = params[0].broken;
            cell.content = params[0].content;
            params[0] = cell;
            game.maze.addCellAt.apply(game.maze, params);
        });

        socket.on('add player', function (id) {
            console.log('player connected', id);
            game.addPlayer(new Player(id));
        });

        socket.on('remove player', function (id) {
            console.log('player disconnected', id);
            game.removePlayer(id);
        });
    };


    /* start the game */

    sm.changeState("game");

    requestAnimFrame(loop);
}

function resize(e){
    if(window.innerWidth/window.innerHeight > 16/9){
        GU = (window.innerHeight/9);
    }else{
        GU = (window.innerWidth/16);
    }
    canvas.width = 16*GU;
    canvas.height = 9*GU;
    canvas.style.margin = ((window.innerHeight - 9*GU) /2)+"px 0 0 "+((window.innerWidth-16*GU)/2)+"px";
}

window.onresize = resize;

// Array Remove - By John Resig (MIT Licensed)
Array.remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};
