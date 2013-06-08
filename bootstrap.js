missedGFXFrames = 0;

/* smoothstep interpolaties between a and b, at time t from 0 to 1 */
function smoothstep(a, b, t) {
    var v = t * t * (3 - 2 * t);
    return b * v + a * (1 - v);
};

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

function bootstrap(){

    /* global on purpose */
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.style.zIndex = 999;

    sm = new StateManager();

    dt = 0;
    t = 0;
    time = +new Date();
    old_time = time;
    KEYS = [];
    for(var i=0;i<256;i++){
        KEYS[i] = false;
    }

    document.addEventListener("keydown",function(e){
        KEYS[e.keyCode] = true;
    });

    document.addEventListener("keyup",function(e){
        KEYS[e.keyCode] = false;
    });

    /* add game states here */
    
    sm.addState("mainmenu", new MainMenuState());

    resize();

    document.body.appendChild(canvas);

    /* start the game */

    sm.changeState("mainmenu");

    console.log("bootstrapping loaded");
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
