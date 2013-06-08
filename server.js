var io = require('socket.io').listen(8000);
var GameState = require('./GameState');
var Player = require('./Player');
var LightBomb = require('./LightBomb');

var game = new GameState();
game.resume();


function sendKeyframe(socket){
    socket.emit('keyframe', game.createKeyframe());
}

function sendFrame(socket){
    socket.emit('frame', game.createFrame());
}

function sendEntireMaze(socket){
    socket.emit('maze', game.maze.internal);
}

io.sockets.on('connection', function (socket) {

    console.log('We got a connection!');

    var player = new Player(game, {});
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
        sendKeyframe(game.players[i].socket);
    }

    setTimeout(loop, 0);
}, 0);

// Array Remove - By John Resig (MIT Licensed)
Array.remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};
