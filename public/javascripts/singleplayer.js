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
    var bestSolution = 0;
    var possibleSolutions = [];
    while (i < board.length && solution == null) {
        var j = 1;
        while (j < board[i].length && solution == null) {
            var points = 0;
            var cell = board[i][j];
            if (!cell.clicked) {
                if (!checkOnlyPossibleSquares) {
                    coords = [i, j];
                    points = 1;
                }

                solution = makesASquare([i, j]);
                if (solution != null) {
                    coords = [i, j];
                    points = solution.points;
                }
                if (!checkOnlyPossibleSquares) {
                    if (solution == null && giftToThePlayer([i, j])) {
                        coords = null;
                        points = 0;
                    }
                }
                if (coords != null && points > bestSolution) {
                    possibleSolutions = [coords];
                    bestSolution = points;
                } else if (coords != null && points == bestSolution) {
                    possibleSolutions.push(coords);
                }

            }
            j++;
        }
        i++;
    }
    if (!checkOnlyPossibleSquares && possibleSolutions.length == 0) {
        //it's a trap! well played
        var i = 1;
        while (i < board.length) {
            var j = 1;
            while (j < board[i].length) {
                var cell = board[i][j];
                if (!cell.clicked) {
                    possibleSolutions = [[i, j]];
                }
                j++;
            }
            i++;
        }
    }
    console.log(possibleSolutions);
    return possibleSolutions[Math.floor(Math.random()*possibleSolutions.length)];;
}

function giftToThePlayer(coords) {
    if (freeCells <= 2) return false;
    var isAGift = false;
    board[coords[0]][coords[1]].clicked = true;
    isAGift = findBestGreedyMove(true) != null;
    board[coords[0]][coords[1]].clicked = false;
    return isAGift;
}
