var board, game, cfg, worker;

var aiboard,lastaifen;
var aiVisionToggle = true;;

var d;
var init = function() {
    cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };
	worker = new Worker('js/compute.js');
	worker.addEventListener('message', function(e) {
		var res = e.data.split("|");
		
		if(res[0]+"" == "finished"){
			var positionCount = parseInt(res[1]);
			var move = res[2] + "";
			game.move(move);
			board.position(game.fen());
			renderMoveHistory(game.history());
			
			var d2 = new Date().getTime();
			var moveTime = (d2 - d);
			var positionsPerS = ( positionCount * 1000 / moveTime);
			$('#position-count').text(positionCount);
			$('#time').text(moveTime/1000 + 's');
			$('#positions-per-s').text(positionsPerS);
		}
		else {
			lastaifen = res[1] + "";
			if(aiVisionToggle)
				aiboard.position(lastaifen);
		}
	});
	
    board = ChessBoard('board', cfg);
	aiboard = ChessBoard('aiboard');
    game = new Chess();
};

var computeMove = function() {
	d = new Date().getTime();
	
	var depth = $('#search-depth').find(':selected').text();
	worker.postMessage(depth + "|" + game.fen());
	if (game.game_over()) {
        alert('Game over');
    }
};

$(document).ready(init);

// Visualization

$('#aiboard').on('click', function(){
	if(aiVisionToggle) {
		aiboard.clear();
		aiVisionToggle = false;
	} else {
		aiboard.position(lastaifen);
		aiVisionToggle = true;
	}
});

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var renderMoveHistory = function(moves) {
	var historyElement = $('#move-history');
	historyElement.empty();
	for(var i=0; i< moves.length; i=i+2){
		var str = '';
		str += '<div class="row" id="history-' + ((i+2) / 2) + '">\n';
		str += '<div class="col-2">' + ((i+2) / 2) + '</div>\n';
		str += '<div class="col-4 move">' + moves[i] + '</div>\n';
		if(moves.length > i + 1){
			str += '<div class="col-4 move">' + moves[i+1] + '</div>\n';
		}
		str += '</div>';
		historyElement.append(str);
	}
	
	historyElement.scrollTop(historyElement.height);
};

var onDrop = function (source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: $('#preferred-promotion').val()
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }
	
	computeMove();
};

var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};