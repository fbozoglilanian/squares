function connect() {
    socket = io.connect();
}
function setRestartButtonEvent() {
    $("#restart").click(function() {
        restart();
    });
}

function enterRoom() {
    var players = [
        {playerId:0, playerName: playerName},
        {playerId:1, playerName: "The computer"},
    ];
    playerId = 0;
    updatePlayerList(players)
    $("#playerMode").empty();
    $("#localPlayer_0").addClass("playerSession");
    restart();
}


function cellClickEvent(roomName, board, coords) {
    updateBoard(coords);
    computerPlayer();
}

function computerPlayer() {

    findBestGreedyMove();
}


function findBestGreedyMove() {
    if (getCurrentPlayerId() == 1) {
        var i = 1;
        var coords = null;
        var solution = null;
        while (i < board.length && solution == null) {
            var j = 1;
            while (j < board[i].length && solution == null) {
                var cell = board[i][j];
                if (!cell.clicked) {
                    if (coords == null) {
                        coords = [i, j];
                    }
                    solution = makesASquare([i, j]);
                    if (solution != null) {
                        coords = [i, j];
                    }
                }
                j++;
            }
            i++;
        }
        cellClickEvent($("#room").html(), board, coords);
    }
}
