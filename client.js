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

function blur(ctx){
    var amount = 2;
    var times = 16;

    while(times --> 0){
        ctx.scale(1/amount, 1/amount);
        ctx.drawImage(ctx.canvas, 0, 0);
        ctx.scale(amount*amount, amount*amount);
        ctx.drawImage(ctx.canvas, 0, 0);
        ctx.scale(1/amount, 1/amount);
    }

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

BLUR = false;

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


    if(BLUR){
        blurcanvas.width = blurcanvas.width;
        sm.render(blurctx);
        blur(blurctx);
        ctx.drawImage(blurcanvas, 0, 0);
    }else{
        sm.render(ctx);
    }

    requestAnimFrame(loop);
}

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.style.zIndex = 999;
blurcanvas = document.createElement("canvas");
blurctx = canvas.getContext("2d");

function client(){

    /* global on purpose */


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

    game.keydownGameListener = function(e){
        if(e.keyCode == 27){
            return game.showMenu();
        }
        game.player.KEYS[e.keyCode] = true;
    }

    game.keyupGameListener = function(e){
        game.player.KEYS[e.keyCode] = false;
    }



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

    blurcanvas.width = canvas.width;
    blurcanvas.height= canvas.height;
}

window.onresize = resize;

// Array Remove - By John Resig (MIT Licensed)
Array.remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};
