self.importScripts('chess.js');

/*The "AI" part starts here */
self.addEventListener("message", function(e) {
	var res = e.data.split("|");
	var depth = res[0];
	var game = new Chess(res[1] + "");
	makeBestMove(depth, game);
	var moves = game.history();
	var move = moves[moves.length -1]; // get last move
	self.postMessage(positionCount+"|"+move);
}, false);

var makeBestMove = function (depth, game) {
    var bestMove = getBestMove(depth, game);
    game.ugly_move(bestMove);
    if (game.game_over()) {
        alert('Game over');
    }
};

var positionCount;
var getBestMove = function (depth, game) {
    if (game.game_over()) {
        alert('Game over');
    }

    positionCount = 0;
	var d = parseInt(depth);
	var bestMove = minimaxRoot(d, game, true);
	return bestMove;
};

var evaluateBoard = function (board) {
    var sum = 0;
	
    sum += materialValue(board);

    return sum;
}

var materialValue = function (board) {

    var pieceMaterialValue = function (piece) {
        if (piece.type === 'p') {
            return 100;
        } else if (piece.type === 'r') {
            return 500;
        } else if (piece.type === 'n') {
            return 320;
        } else if (piece.type === 'b') {
            return 330;
        } else if (piece.type === 'q') {
            return 900;
        } else if (piece.type === 'k') {
            return 20000;
        }
    }

    var value = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var piece = board[i][j]
			if(piece != null){
				value = value + (piece.color === 'w' ? 1 : -1) * pieceMaterialValue(piece);
			}
        }
    }

    return value;
}

var minimaxRoot =function(depth, game, isMaximisingPlayer) {

    var newGameMoves = game.ugly_moves();
    var bestMove = -9999;
    var bestMoveFound;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.ugly_move(newGameMove);
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if(value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evaluateBoard(game.board());
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};
