var board = [];
var playerTurn = 1;
var boardLength = 6;
//var socket = io.connect('http://192.168.2.3:8080');
var socket;

var playerId = null;
var playerName = "Me";

$(function() {
    $("#message").hide();

    socket = io.connect();
    playerName = prompt("Your Name");
    if (playerName == null || playerName == "") {
        playerName = "";
    }
    hidePlayerList();

    $("#restart").click(function() {
        if (playerId == getCurrentPlayerId()) {
            socket.emit('reset-room', $("#room").html());
        }
    });
    socket.emit('enter-room', {
                        roomName: $("#room").html(),
                        playerName: playerName
                    });

    socket.on('update-player-list', function(players) {
        hidePlayerList();
        for (var i in players) {
            var player = players[i];
            $("#player_item_" + player.playerId).show();
            $("#player_name_" + player.playerId).html(player.playerName + ": ");
        }
        if (players.length == 1) {
            $("#board").hide();
            $("#message").show();
            $("#message").html("Waiting for more players...");
        } else {
            $("#board").show();
            $("#message").empty();
            $("#message").hide();
        }
    });
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
});

function hidePlayerList() {
    $("#player_item_0").hide();
    $("#player_item_1").hide();
}

function restart() {
    board = [];
    $("#board").empty();
    playerTurn = 1;
    changePlayerTurn();
    resetPoints();
    loadBoard();
    setBoardEvents();
}


function loadBoard() {
    for (var i = 1; i <= boardLength; i++) {
        $("#board").append("<tr></tr>");
        for (var j = 1; j <= boardLength; j++) {
            var id = i + "_" + j;
            $($("#board tr")[(i-1)]).append("<td id=\"" + id + "\"></td>");
        }
    }
}



function setBoardEvents() {
    $('table#board td').each(function(i, td) {
        var id = $(td).attr("id");
        var val = $(td).html();
        var coords = getCellCoords(id);
        if (board[coords[0]] == undefined) {
            board[coords[0]] = [];
        }
        board[coords[0]][coords[1]] = {clicked: false, square: null};
        $(td).click(cellClick);

    });
}
function getCellCoords(id) {
    var coords = id.split("_");
    return [parseInt(coords[0]), parseInt(coords[1])];
}

function cellClick() {
    if (playerId == getCurrentPlayerId()) {
        var id = $(this).attr("id");
        var coords = getCellCoords(id);
        if (!board[coords[0]][coords[1]].clicked) {
            updateBoard(coords);
            socket.emit('player-move', {room: $("#room").html(),
                                        board: board,
                                        coords: coords
                                        });
        }
    }
}

function updateBoard(coords) {
    var id = coords[0] + "_" + coords[1];
    board[coords[0]][coords[1]].clicked = true;
    $("#" + id).addClass("clicked");
    makesASquare(id);
}


function makesASquare(id) {
    var coords = getCellCoords(id);
    var cuadrants = [];
    cuadrants.push([{x: coords[0], y:coords[1]-1},
                    {x: coords[0]+1, y:coords[1]-1},
                    {x: coords[0]+1, y:coords[1]}]);

    cuadrants.push([{x: coords[0], y:coords[1]-1},
                    {x: coords[0]-1, y:coords[1]-1},
                    {x: coords[0]-1, y:coords[1]}]);

    cuadrants.push([{x: coords[0]-1, y:coords[1]},
                    {x: coords[0]-1, y:coords[1]+1},
                    {x: coords[0], y:coords[1]+1}]);

    cuadrants.push([{x: coords[0], y:coords[1]+1},
                    {x: coords[0]+1, y:coords[1]+1},
                    {x: coords[0]+1, y:coords[1]}]);
    var found = false;
    var i = 0;
    var solution = [{x: coords[0], y:coords[1]}];
    var partialSolution;

    while (i < cuadrants.length && !found) {
        found = true;
        var j = 0;
        $(cuadrants[i]).each(function(i, coords){
            partialSolution = solution;
            if (board[coords.x] != undefined) {
                var cell = board[coords.x][coords.y];
                if (cell != undefined && cell.square == null) {
                    found = found && cellClicked(cell);
                    if (found) {
                        solution.push(coords);
                        j++;
                    }
                }
            }
        });
        found = found && j == 3;
        i++;
    }
    if (found) {
        solution = partialSolution;
        $(solution).each(function(i, coords) {
            var id = "#" + coords.x + "_" + coords.y;
            board[coords.x][coords.y].square = solution;
            $(id).removeClass("clicked");
            $(id).addClass("square");
        });
        addCurrentPlayerPoints(4);
    } else {
        changePlayerTurn();
    }
}

function addCurrentPlayerPoints(points) {
    $("#points_" + getCurrentPlayerId()).html(parseInt($("#points_" + getCurrentPlayerId()).html()) + points);
}

function resetPoints() {
    $("#points_0").html(0);
    $("#points_1").html(0);
}


function getCurrentPlayerId() {
    return playerTurn;
}

function changePlayerTurn() {
    $("#player_item_" + playerTurn).removeClass("alert-info");
    playerTurn = (playerTurn==1)?0:1;
    $("#player_item_" + playerTurn).addClass("alert-info");
}

function cellClicked(cell) {
    return cell != undefined && cell.clicked;
}
