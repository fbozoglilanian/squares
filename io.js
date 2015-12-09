var io = require('socket.io')();
var rooms = {};
var playerRooms = {};

io.on('connection', function(socket) {
    socket.on('disconnect', function () {
        //Improve this!
        console.log("Disconnect user: ", socket.id);
        if (playerRooms[socket.id] != undefined) {
            var room = playerRooms[socket.id].room;
            var playerId = playerRooms[socket.id].playerId;

            rooms[room].players[playerId] = undefined;
            rooms[room].numPlayers--;


            if (rooms[room].numPlayers == 0) {
                delete rooms[room];
            }
            delete playerRooms[socket.id];
        }
    });
    socket.on('enter-room', function(room){
        if (rooms[room] == undefined) {
            rooms[room] = {numPlayers: 0, players: [undefined, undefined], viewers: [], board: [], currentPlayer: 0};
        }
        if (rooms[room].numPlayers < 2) { //new room
            console.log("Added user to room: " + room);
            if (playerRooms[socket.id] == undefined) {
                playerRooms[socket.id] = {};
            }
            rooms[room].numPlayers++;

            var playerId = 1;
            if (rooms[room].players[0] == undefined) {
                playerId = 0;
            }
            rooms[room].players[playerId] = socket;
            playerRooms[socket.id] = {room: room, playerId: playerId};
            socket.join(room);
            socket.emit('player-id', playerId);
        } else { //full room
            /*rooms[room].viewers.push(socket);
            socket.join(room);*/
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
