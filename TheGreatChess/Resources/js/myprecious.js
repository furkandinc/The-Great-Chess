var board, game, cfg;

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
    board = ChessBoard('board', cfg);
    game = new Chess();
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
            value = value + (piece.color === 'w' ? 1 : -1) * pieveMaterialValue(piece);
        }
    }

    return value;
}

// Visualization

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var onDrop = function (source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    // renderMoveHistory(game.history());
    // window.setTimeout(makeBestMove, 250);
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
        background = '#9b1717';
    }
    squareEl.css('background', background);
};

$(document).ready(init);