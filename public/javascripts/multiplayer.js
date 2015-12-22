var socket;

function connect() {
    socket = io.connect();
}
function setRestartButtonEvent() {
    $("#restart").click(function() {
        if (playerId == getCurrentPlayerId()) {
            socket.emit('reset-room', $("#room").html());
        }
    });
}

function enterRoom() {
    socket.emit('enter-room', {
                        roomName: $("#room").html(),
                        playerName: playerName
                    });
    socket.on('update-player-list', updatePlayerList);
    socket.on('player-id', function(player){
        if (player.id == "viewer") {
            //$("#playerMode").html("Viewer");
            //$("#restart").hide();
            alert("This room is full!");
            $(location).attr('href', '/');
        } else {
            $("#playerMode").empty();
            playerId = player.id;
            $("#localPlayer_" + player.id).addClass("playerSession");
        }
    });
    socket.on("update-room", function(coords) {
        updateBoard(coords);
    });
    socket.on("reset-room", function(coords) {
        restart();
    });
}
function cellClickEvent(roomName, board, coords) {
    socket.emit('player-move', {room: $("#room").html(),
                                board: board,
                                coords: coords
                                });
}
