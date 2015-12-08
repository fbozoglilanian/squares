var board = [];
var playerTurn = 0;
var boardLength = 4;

$(function() {
    restart();
    $("#restart").click(restart);
});

function restart() {
    board = [];
    $("#board").empty();
    playerTurn = 0;
    console.log("Game Ready");
    loadBoard();
    setBoardEvents();
    $("#playerTurn").html(playerTurn);
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
    console.log(board);
}
function getCellCoords(id) {
    var coords = id.split("_");
    return [parseInt(coords[0]), parseInt(coords[1])];
}

function cellClick() {
    var id = $(this).attr("id");
    var coords = getCellCoords(id);
    if (!board[coords[0]][coords[1]].clicked) {
        board[coords[0]][coords[1]].clicked = true;
        $("#" + id).addClass("clicked");
        makesASquare(id);
    }
}

function makesASquare(id) {
    console.log("Makes a Square?");
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
            console.log(coords);
            partialSolution = solution;
            if (board[coords.x] != undefined) {
                var cell = board[coords.x][coords.y];
                if (cell != undefined && cell.square == null) {
                    found = found && cellClicked(cell);
                    if (found) {
                        solution.push(coords);
                        j++;
                    }
                    console.log(cell, found);
                }
            }
        });
        found = found && j == 3;
        i++;
    }
    if (found) {
        solution = partialSolution;
        console.log("Square!", solution);
        $(solution).each(function(i, coords) {
            var id = "#" + coords.x + "_" + coords.y;
            console.log(id, coords);
            board[coords.x][coords.y].square = solution;
            $(id).removeClass("clicked");
            $(id).addClass("square");
            addCurrentPlayerPoints(4);
        });
    } else {
        changePlayerTurn();
        console.log("Not yet...");
    }
}

function addCurrentPlayerPoints(points) {
    $("#points_" + getCurrentPlayerId()).html(parseInt($("#points_" + getCurrentPlayerId()).html()) + points);
}

function getCurrentPlayerId() {
    return playerTurn;
}

function changePlayerTurn() {
    playerTurn = (playerTurn==1)?0:1;
    $("#playerTurn").html(playerTurn);
}

function cellClicked(cell) {
    return cell != undefined && cell.clicked;
}