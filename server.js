var io = require('socket.io').listen(8000);
var GameState = require('./GameState');
var Player = require('./Player');

console.log(GameState);

var game = new GameState();

io.sockets.on('connection', function (socket) {

    console.log('We got a connection!');

    var player = new Player();
    player.socket = socket;
    game.addPlayer(player);



    socket.on('set nickname', function (name) {
    });

    socket.on('keydown', function(keyCode){
        player.KEYS[keyCode] = true;
    });

    socket.on('keyup', function(keyCode){
        player.KEYS[keyCode] = false;
    });

    socket.on('msg', function () {
    });
});


old_time = +new Date();
dt = 0;

setTimeout(function loop(){
        t = +new Date();
        dt += (t-old_time);
        old_time = t;
        while(dt>20){
            game.update();
            dt-= 20;
        }
    setTimeout(loop, 0);
}, 0);
