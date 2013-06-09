var io = require('socket.io').listen(8000);
var connect = require('connect');
connect.createServer(
    connect.static( require('path').dirname(require.main.filename))
).listen(8080);
var GameState = require('./GameState');
var Player = require('./Player');
var LightBomb = require('./LightBomb');
var Firefly = require('./Firefly');
GU = 1;
t = + new Date();

var game = new GameState();


function sendKeyframe(socket){
    socket.emit('keyframe', game.createKeyframe());
}

function sendFrame(socket){
    socket.emit('frame', game.createFrame());
}

io.sockets.on('connection', function (socket) {

    console.log('We got a connection!');


    var player = new Player(game, {});
    player.socket = socket;
    game.addPlayer(player);
    socket.emit('id', player.id);

    for(var i=0;i<game.players.length;i++){
        if(game.players[i].id != player.id){
            game.players[i].socket.emit('add player', player.id);
        }
    }

    sendKeyframe(socket);

    socket.on('maze get cell at', function(params){
        socket.emit('maze cell at', [game.maze.getCellAt.apply(game.maze, params), params[0], params[1]]);
    });


    socket.on('keydown', function(keyCode){
        player.KEYS[keyCode] = true;
    });

    socket.on('keyup', function(keyCode){
        player.KEYS[keyCode] = false;
    });

    socket.on('set name', function(name){
        player.name = name;
    });

    socket.on('msg', function () {
    });

    socket.on('disconnect', function(){
        console.log('a player has disconnected');
        game.removePlayer(player.id);

        for(var i=0;i<game.players.length;i++){
            game.players[i].socket.emit('remove player', player.id);
        }
    });
});

game.resume();

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
        sendFrame(game.players[i].socket);
    }

    setTimeout(loop, 0);
}, 0);

// Array Remove - By John Resig (MIT Licensed)
Array.remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

