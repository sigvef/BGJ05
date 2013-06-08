var io = require('socket.io').listen(8000);
var GameState = require('./GameState');
var Player = require('./Player');

var game = new GameState();
game.resume();


function sendKeyframe(socket){
    socket.emit('keyframe', game.createKeyframe());
}

function sendEntireMaze(socket){
    socket.emit('maze', game.maze.internal);
}

io.sockets.on('connection', function (socket) {

    console.log('We got a connection!');

    var player = new Player();
    player.socket = socket;
    game.addPlayer(player);

    sendKeyframe(socket);
    sendEntireMaze(socket);

    socket.on('keydown', function(keyCode){
        player.KEYS[keyCode] = true;
    });

    socket.on('keyup', function(keyCode){
        player.KEYS[keyCode] = false;
    });

    socket.on('msg', function () {
    });

    socket.on('disconnect', function(){
        console.log('a player has disconnected');
        game.removePlayer(player.id);
        socket.emit('remove player', player.id);
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

    var keyframe = game.createKeyframe();
    for(var i in game.players){
        game.players[i].socket.emit('keyframe', keyframe);
    }

    setTimeout(loop, 0);
}, 0);
