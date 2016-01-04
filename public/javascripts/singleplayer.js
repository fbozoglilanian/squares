function connect() {
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
    if (getCurrentPlayerId() == 1) {
        setTimeout(function(){
            var coords = findBestGreedyMove(false);
            if (coords != null) {
                cellClickEvent($("#room").html(), board, coords);
            }
        }, 1000);
    }
}


function findBestGreedyMove(checkOnlyPossibleSquares) {
    var i = 1;
    var coords = null;
    var solution = null;
    while (i < board.length && solution == null) {
        var j = 1;
        while (j < board[i].length && solution == null) {
            var cell = board[i][j];
            if (!cell.clicked) {
                if (!checkOnlyPossibleSquares) {
                    if (coords == null) {
                        coords = [i, j];
                    }
                }

                solution = makesASquare([i, j]);
                if (solution != null) {
                    coords = [i, j];
                }
                if (!checkOnlyPossibleSquares) {
                    if (solution == null && giftToThePlayer([i, j])) {
                        coords = null;
                    }
                }

            }
            j++;
        }
        i++;
    }
    if (!checkOnlyPossibleSquares && coords == null) {
        //it's a trap! well played
        var i = 1;
        while (i < board.length) {
            var j = 1;
            while (j < board[i].length) {
                var cell = board[i][j];
                if (!cell.clicked) {
                    coords = [i, j];
                }
                j++;
            }
            i++;
        }
    }

    return coords;
}

function giftToThePlayer(coords) {
    if (freeCells <= 2) return false;
    var isAGift = false;
    board[coords[0]][coords[1]].clicked = true;
    isAGift = findBestGreedyMove(true) != null;
    board[coords[0]][coords[1]].clicked = false;
    return isAGift;
}
