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
            io.to(room).emit('update-player-list', getRoomPlayers(room));
        }
    });
    socket.on('enter-room', function(room){
        if (rooms[room.roomName] == undefined) {
            rooms[room.roomName] = {
                numPlayers: 0,
                players: [undefined, undefined],
                viewers: [], board: [], currentPlayer: 0
            };
        }
        if (rooms[room.roomName].numPlayers < 2) { //new room
            console.log("Added user to room: " + room.roomName);
            if (playerRooms[socket.id] == undefined) {
                playerRooms[socket.id] = {};
            }
            rooms[room.roomName].numPlayers++;

            var playerId = 1;
            if (rooms[room.roomName].players[0] == undefined) {
                playerId = 0;
            }
            if (room.playerName == "") {
                room.playerName = "Player " + playerId;
            }
            rooms[room.roomName].players[playerId] = socket;
            playerRooms[socket.id] = {
                room: room.roomName,
                playerId: playerId,
                playerName: room.playerName
            };
            socket.join(room.roomName);
            io.to(room.roomName).emit('update-player-list', getRoomPlayers(room.roomName));
            io.to(room.roomName).emit('reset-room'); // when a new player enters, the game is restarted

            socket.emit('player-id', {id: playerId, name: room.playerName});
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

        /*for (var i in room.viewers) {
            var viewerSocket = room.viewers[i];
            viewerSocket.emit("update-room", updates.coords);
        }*/
    });

    socket.on('reset-room', function(roomName){
        var room = rooms[roomName];
        var nextPlayer = (room.currentPlayer==0)?1:0;
        rooms[roomName].board = [];
        rooms[roomName].currentPlayer = 0;
        io.to(roomName).emit('reset-room');
    });

});

function getRoomPlayers(roomName) {
    var players = [];
    if (rooms[roomName] != undefined) {
        for (var i in rooms[roomName].players) {
            if (rooms[roomName].players[i] != undefined) {
                players.push(playerRooms[rooms[roomName].players[i].id]);
            }
        }
    }

    return players;
}

module.exports = io;
