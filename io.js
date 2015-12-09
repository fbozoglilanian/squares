var io = require('socket.io')();
var rooms = {};


io.on('connection', function(socket) {
    socket.on('disconnect', function () {
        //Improve this!
        console.log(socket.id);
    });
    socket.on('enter-room', function(room){
        if (rooms[room] == undefined) {
            rooms[room] = {players: [], viewers: [], board: [], currentPlayer: 0};
        }
        if (rooms[room].players.length < 2) { //new room
            console.log("Added user to room: " + room);
            rooms[room].players.push(socket);
            socket.join(room);
            socket.emit('player-id', rooms[room].players.length -1);
        } else { //full room
            rooms[room].viewers.push(socket);
            socket.join(room);
            socket.emit('player-id', "viewer");
        }
    });
    socket.on('player-move', function(updates){
        //updates: {room: $("#room").html(), board: board}
        var room = rooms[updates.room];
        room.currentPlayer = (room.currentPlayer==0)?1:0;
        room.board = updates.board;
        var playerSocket = room.players[room.currentPlayer];
        playerSocket.emit("update-room", updates.coords);

        for (var i in room.viewers) {
            var viewerSocket = room.viewers[i];
            viewerSocket.emit("update-room", updates.coords);
        }
    });

    socket.on('reset-room', function(roomName){
        //updates: {room: $("#room").html(), board: board}
        var room = rooms[roomName];
        var nextPlayer = (room.currentPlayer==0)?1:0;
        rooms[roomName].board = [];
        rooms[roomName].currentPlayer = 0;

        var playerSocket = room.players[nextPlayer];
        playerSocket.emit("reset-room");

        for (var i in room.viewers) {
            var viewerSocket = room.viewers[i];
            viewerSocket.emit("reset-room");
        }
    });

});

module.exports = io;
