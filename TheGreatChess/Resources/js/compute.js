self.importScripts('chess.js');

var maxalpha=100000;

/*The "AI" part starts here */
self.addEventListener("message", function(e) {
	var res = e.data.split("|");
	var depth = res[0];
	var game = new Chess(res[1] + "");
	console.log("threat: " + threatValue(game.board()));
	makeBestMove(depth, game);
	var moves = game.history();
	var move = moves[moves.length -1]; // get last move
	self.postMessage("finished" + "|" + positionCount+"|"+move);
}, false);

var makeBestMove = function (depth, game) {
    var bestMove = getBestMove(depth, game);
    game.ugly_move(bestMove);
};

var positionCount;
var getBestMove = function (depth, game) {
    positionCount = 0;
	var d = parseInt(depth);
	var bestMove = minimaxRoot(d, game, true);
	return bestMove;
};

var evaluateBoard = function (board) {
    var sum = 0;
	var materialconstant = 0.8;
	var threatconstant = 0.2;
	
    sum += materialconstant * materialValue(board);
	sum += threatconstant * threatValue(board);

    return sum;
}

var pieceMaterialValue = function (piece) {
	if(piece == null){
		return 0;
	}
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

var materialValue = function (board) {
    var value = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var piece = board[i][j];
			if(piece != null){
				value = value + (piece.color === 'w' ? 1 : -1) * pieceMaterialValue(piece);
			}
        }
    }

    return value;
}

var threatValue = function (board) {
	var value = 0;
	for( var i=0; i<8; i++) {
		for(var j=0; j<8; j++) {
			var piece = board[i][j];
			if( piece != null) {
				value = value + (piece.color === 'w' ? 1 : -1) * threatcomputepiece(board, piece, i, j);
			}
		}
	}
	return value;
}

var threatcomputepiece = function(board, piece, i, j) {
	var value = 0;
	var color = piece.color;
	
	var valueutil = function(p, c){
		if(p != null)
				if(p.color !== c)
					if(p.type === 'k')
						return 900;
					else
						return pieceMaterialValue(p);
		return 0;
	}
	
	if (piece.type === 'p') {
		var piece1 = getpiece(board, i + (color === 'b'?1:-1), j + 1);
		var piece2 = getpiece(board, i + (color === 'b'?1:-1), j - 1);
		value += valueutil(piece1, color);
		value += valueutil(piece2, color);
    } else if (piece.type === 'r') {
        var piece1 = raycast(board, i, j, 1, 0);
		var piece2 = raycast(board, i, j, -1, 0);
		var piece3 = raycast(board, i, j, 0, 1);
		var piece4 = raycast(board, i, j, 0, -1);
		value += valueutil(piece1, color);
		value += valueutil(piece2, color);
		value += valueutil(piece3, color);
		value += valueutil(piece4, color);
    } else if (piece.type === 'n') {
        var piece1 = getpiece(board, i - 2, j + 1);
		var piece2 = getpiece(board, i - 2, j - 1);
		var piece3 = getpiece(board, i - 1, j + 2);
		var piece4 = getpiece(board, i - 1, j - 2);
		var piece5 = getpiece(board, i + 1, j + 2);
		var piece6 = getpiece(board, i + 1, j - 2);
		var piece7 = getpiece(board, i + 2, j + 1);
		var piece8 = getpiece(board, i + 2, j - 1);
		value += valueutil(piece1, color);
		value += valueutil(piece2, color);
		value += valueutil(piece3, color);
		value += valueutil(piece4, color);
		value += valueutil(piece5, color);
		value += valueutil(piece6, color);
		value += valueutil(piece7, color);
		value += valueutil(piece8, color);
    } else if (piece.type === 'b') {
		var piece1 = raycast(board, i, j, 1, 1);
		var piece2 = raycast(board, i, j, -1, 1);
		var piece3 = raycast(board, i, j, -1, -1);
		var piece4 = raycast(board, i, j, 1, -1);
		value += valueutil(piece1, color);
		value += valueutil(piece2, color);
		value += valueutil(piece3, color);
		value += valueutil(piece4, color);
    } else if (piece.type === 'q') {
        var piece1 = raycast(board, i, j, 1, 0);
		var piece2 = raycast(board, i, j, -1, 0);
		var piece3 = raycast(board, i, j, 0, 1);
		var piece4 = raycast(board, i, j, 0, -1);
		var piece5 = raycast(board, i, j, 1, 1);
		var piece6 = raycast(board, i, j, -1, 1);
		var piece7 = raycast(board, i, j, -1, -1);
		var piece8 = raycast(board, i, j, 1, -1);
		value += valueutil(piece1, color);
		value += valueutil(piece2, color);
		value += valueutil(piece3, color);
		value += valueutil(piece4, color);
		value += valueutil(piece5, color);
		value += valueutil(piece6, color);
		value += valueutil(piece7, color);
		value += valueutil(piece8, color);
    } else if (piece.type === 'k') {
        var piece1 = getpiece(board, i + 1, j + 1);
		var piece2 = getpiece(board, i + 1, j);
		var piece3 = getpiece(board, i + 1, j - 1);
		var piece4 = getpiece(board, i, j - 1);
		var piece5 = getpiece(board, i - 1 , j - 1);
		var piece6 = getpiece(board, i - 1, j);
		var piece7 = getpiece(board, i - 1, j + 1);
		var piece8 = getpiece(board, i, j + 1);
		value += valueutil(piece1, color);
		value += valueutil(piece2, color);
		value += valueutil(piece3, color);
		value += valueutil(piece4, color);
		value += valueutil(piece5, color);
		value += valueutil(piece6, color);
		value += valueutil(piece7, color);
		value += valueutil(piece8, color);
    }
	return value;
}

var raycast = function(board, ri, rj, vi, vj) {
	var mi = ri + vi;
	var mj = rj + vj;
	
	while(mi >= 0 && mi <= 7 && mj >= 0 && mj <= 7) {
		var piece = getpiece(board, mi, mj);
		if(piece != null) {
			return piece;
		}
		mi += vi;
		mj += vj;
	}
	return null;
}

var getpiece = function(board, i, j){
	if(i < 0 || i >= 8 || j < 0 || j >= 8){
		return null;
	}
	return board[i][j];
}

var minimaxRoot =function(depth, game, isMaximisingPlayer) {

    var newGameMoves = game.ugly_moves();
    var bestMove = Object.freeze({value: -maxalpha + 1, fen: game.fen()});
    var bestMoveFound;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.ugly_move(newGameMove);
        var record = minimax(depth - 1, game, -maxalpha, maxalpha, !isMaximisingPlayer);
        game.undo();
        if(record.value >= bestMove.value) {
            bestMove = record;
            bestMoveFound = newGameMove;
	
        }
		postMessage("bestmove" + "|" + bestMove.fen);
    }
	
	postMessage("bestmove" + "|" + bestMove.fen);
    return bestMoveFound;
};

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
		var record = Object.freeze({value: -evaluateBoard(game.board()), fen: game.fen()});
        return record;
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = Object.freeze({value: -maxalpha + 1, fen: game.fen()});
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
			var other = minimax(depth -1, game, alpha, beta, !isMaximisingPlayer);
			if(bestMove.value < other.value){
				bestMove = other;
			}
            game.undo();
            alpha = Math.max(alpha, bestMove.value);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = Object.freeze({value: maxalpha - 1, fen: game.fen()});
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
			var other = minimax(depth -1, game, alpha, beta, !isMaximisingPlayer);
			if(bestMove.value > other.value){
				bestMove = other;
			}
            game.undo();
            beta = Math.min(beta, bestMove.value);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};
