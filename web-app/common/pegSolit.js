import R from "../common/ramda.js";

/**
 * PegSolit.js is a module to model and play Peg Solitaire.
 * https://en.wikipedia.org/wiki/Peg_solitaire
 * @namespace PegSolit
 * @author Aditya Munot
 * @version 2022
 */

const PegSolit = Object.create(null);

/**
 * A Board is an square grid in which the peg have been placed.
 * There will be one empty cell which would allow the game to begin
 * It is implemented as an array of columns of tokens
 * (or empty positions)
 * @memberof PegSolit
 * @typedef {PegSolit.Peg[][]} Board
 */

/**
 * A peg is a coloured marble that has been placed on the grid already
 * The user moves the pegs in order to play the game
 * @memberof PegSolit
 * @typedef {(1 | 2)} Peg
 */

/**
 * Either a peg or an empty position.
 * @memberof PegSolit
 * @typedef {(PegSolit.Peg | 0)} Peg_or_empty
 */

/**
 * A set of template token strings for {@link PegSolit.to_string_with_Pegs}.
 * @memberof PegSolit
 * @enum {string[]}
 * @property {string[]} default ["0", "1"] Displays tokens by their index.
 * @property {string[]} disks ["⚫", "🔴"]
 * Displays pegs as coloured disks.
 */

PegSolit.token_strings = Object.freeze({
    "default": ["0", "1"],
    "disks": ["⚫", "🔴"]
});

/**
 * Creates the starting default board which is a
 * 6x6 matrix of 1s except one element, which
 * its a 0.
 * Math.random and .splice() are used to randomize the place of
 * the zero, so that every game is a new challenge.
 * @memberof PegSolit
 * @function
 * @param {number} [width = 6] The width of the new board.
 * @param {number} [height = 6] The height of the new board.
 * @returns {PegSolit.Board} An empty board for starting a game has 1s
 * everywhere, except one place, where its zero.
 */
PegSolit.starting_board = function () {
    let length = 6;

    const starting_board = R.repeat(R.repeat(1, length), length);
    const random_row = Math.floor(Math.random() * 6);
    const random_column = Math.floor(Math.random() * 6);

    const row_of_one = R.repeat(1,length);
    row_of_one.splice(random_row, 1, 0);

    starting_board.splice(random_column, 1, row_of_one);
    return starting_board;
};
/**
 * Returns if a game has ended,
 * The game ends when there are no jumps/moves possible
 * Multiple or one peg can be left on the board
 * Either way, if none of them have valid jumps,
 * the game ends.
 * @memberof PegSolit
 * @function
 * @param {PegSolit.Board} board The board to test.
 * @returns {boolean} Whether the game has ended.
 */


PegSolit.is_ended = function (board) {
    return (
        player_has_no_vertical_moves(board) &&
        player_has_no_horizontal_moves(board)
    );
};

const no_jumps_possible_vertically = function () {
    return function (column) {
        if (!R.includes(
            [1, 1, 0],
            R.aperture(3, column)
        ) && !R.includes(
            [0, 1, 1],
            R.aperture(3, column)
        )) {
            return true;
        }
    };
};

const player_has_no_vertical_moves = function (board) {
    return R.all(no_jumps_possible_vertically(), board);
};

const player_has_no_horizontal_moves = function (board) {
    return player_has_no_vertical_moves(R.transpose(board));
};



/**
 * Returns if the board is in a winning state.
 * A game is one when there is only one piece left on the board.
 * This means that the final score is 1.
 * @memberof PegSolit
 * @function
 * @param {PegSolit.Board} board The board to check.
 * @returns {boolean} Returns if the board is in a winning state
 */
PegSolit.has_won = function (board) {
    if(PegSolit.final_score(board) === 1){
        return true;
    }
};


/**
 * This function finds the final score of the game.
 * The score of a player is the number of pegs remaining
 * at the end when no moves are possible. As all pieces
 * are signified by 1, the sum will be the final score.
 * @memberof PegSolit
 * @function
 * @param {PegSolit.Board} board The board to check.
 * @returns {number} Returns the number of pieces left.
 */
PegSolit.final_score = function (board) {
        return R.sum(R.flatten(board));
};


/**
 * Checks if a certain move is valid or not.
 * If first checks if the selected place has a value
 * of 1, which means there is a filled piece.
 * Next, it checks if the new position of the piece
 * has a value of 0, signalling its an empty space.
 * Then, it checks if the selected piece and the new
 * position have a common row OR column, with a difference
 * of 2, so it is just jumping over one piece, vertically
 * or horizontally.
 * Lastly, the row and column of the jumped piece is taken
 * as the mean row and column and checked if that piece has
 * a value of 1, signalling that jumped piece is filled.
 * If the move doesn't meet any of these statements,
 * false is returned.
 * @memberof PegSolit
 * @function
 * @param {PegSolit.Board} board The board to test.
 * @returns {boolean} Whether the game has ended.
 */
PegSolit.valid_move = function(board, positions){
    if(board[positions[2]] === undefined || board[positions[3]] === undefined){
        return false;
    }
    if (board[positions[0]][positions[1]] === 1) {
        if (board[positions[2]][positions[3]] === 0) {
            if ((positions[0]===positions[2] &&
                Math.abs(positions[3] - positions[1]) === 2)
                  || (positions[1] === positions [3] &&
                    Math.abs(positions[2] - positions[0]) === 2))
                  {
                    const jumped_row = (positions[0]+positions[2])/2;
                    const jumped_column = (positions[1] + positions[3])/2;
                    if (board[jumped_row][jumped_column] === 1){
                        return true;
                }
            }
        }
    }
    return false;
};


/**
 * The possible valid moves function is used to see
 * all the places a clicked piece can be placed on.
 * It checks this buy assuming the 4 possible clicked
 * spaces and checking with valid_move if any of the 4
 * are valid. It returns an array of arrays with the
 * row and column of the valid clicked spaces.
 * @memberof PegSolit
 * @function
 * @param {PegSolit.Board} board The board to test.
 * @returns {Array} Returns an array of possible valid spaces.
 */
PegSolit.possible_valid_moves = function(board, clicked_row, clicked_column){
    const valid_array = [];
    if(PegSolit.valid_move(board, [clicked_row, clicked_column, clicked_row+2, clicked_column])){
        valid_array.push([clicked_row+2, clicked_column]);
    }
    if(PegSolit.valid_move(board, [clicked_row, clicked_column, clicked_row-2, clicked_column])){
        valid_array.push([clicked_row-2, clicked_column]);
    }
    if(PegSolit.valid_move(board, [clicked_row, clicked_column, clicked_row, clicked_column+2])){
        valid_array.push([clicked_row, clicked_column+2]);
    }
    if(PegSolit.valid_move(board, [clicked_row, clicked_column, clicked_row, clicked_column-2])){
        valid_array.push([clicked_row, clicked_column-2]);
    }
    return valid_array;
};



/**
 * This function is the updating function (ply) which
 * updates the matrix everytime a move is made.
 * It takes in 2 parameters, the board and positions.
 * Positions is an array of 4 values, clicked piece row
 * and column, moved space row and column respectively.
 * It changes the value of the original position of the
 * peg, and the jumped peg to 0, and the new position to 1
 * @memberof PegSolit
 * @function
 * @param {PegSolit.Board} board The board to test.
 * @returns {PegSolit.Board} returns the updated matrix.
 */
PegSolit.update_board = function(board, positions){
    if(PegSolit.is_ended(board)){
        return undefined;
    }
    if(!PegSolit.valid_move(board, positions)){
        return undefined;
    }
        const updateboard = R.update(
            positions[0],
            R.update(positions[1], 0, board[positions[0]]),
            board);

        const updateboard2 = R.update(
            positions[2],
            R.update(positions[3], 1, updateboard[positions[2]]),
            updateboard);

        const jumped_row = (positions[0]+positions[2])/2;
        const jumped_column = (positions[1] + positions[3])/2;

        if (positions[1] === positions[3]){
            const updateboard3 = R.update(
                jumped_row,
                R.update(jumped_column, 0, updateboard2[jumped_row]),
                updateboard2);
            return updateboard3;
        }

        if(positions[1] !== positions[3]){
            const updateboard4 = R.update(
                jumped_column,
                R.update(jumped_row, 0, R.transpose(updateboard2)[jumped_column]),
                R.transpose(updateboard2));
            return R.transpose(updateboard4);
        }
    };

const replace_tokens_in_slot = (token_strings) => (token) => (
        token_strings[token] || token
    );

const replace_tokens_on_board = function (token_strings) {
        return function (board) {
            return R.map(R.map(replace_tokens_in_slot(token_strings)), board);
        };
    };

/**
 * Returns a {@link PegSolit.to_string} like function,
 * mapping tokens to provided string representations.
 * @memberof PegSolit
 * @function
 * @param {string[]} token_strings
 * Strings to represent tokens as. Examples are given in
 * {@link PegSolit.token_strings}
 * @returns {function} The string representation.
 */
 PegSolit.to_string_with_tokens = (token_strings) => (board) => R.pipe(
    R.transpose, // Columns to display vertically.
    R.reverse, // Empty slots at the top.
    replace_tokens_on_board(token_strings),
    R.map(R.join(" ")), // Add a space between each slot.
    R.join("\n") // Stack rows atop each other.
)(board);

/**
 * Returns a string representation of a board.
 * I.e. for printing to the console rather than serialisation.
 * @memberof PegSolit
 * @function
 * @param {PegSolit.Board} board The board to represent.
 * @returns {string} The string representation.
 */
PegSolit.to_string = PegSolit.to_string_with_tokens(["0", "1"]);



export default Object.freeze(PegSolit);

/**
The following code helps in running the game in the terminal/debug console.
Importing the prompt sync module allows to take in input from the terminal.
It asks for 4 values, the row of the clicked piece, the column of that piece,
and the row and column for the place where the use wants to move the piece.

import ps from "prompt-sync";
const prompt = ps();


PegSolit.start_game = function () {
    const board = PegSolit.starting_board();
    console.table(board);
    PegSolit.ply(board);
    PegSolit.update_board(board, positions);
};

PegSolit.ply = function(board, positions){
    if(PegSolit.is_ended(board)){
        console.table(board);
        return;
    }
    rl.question("Play your move - CR, CC, NR, NC: ", function (answer) {
    let answer = prompt("PR PC NR NC: ");
    let positions = answer.split(" ");
    const positions = answer.split(" ").map(x => parseInt(x));
    if(valid_move(board, positions) === true){
    let new_board = PegSolit.update_board(board, positions);
    console.table(new_board);
    PegSolit.ply(new_board);
    }
    else{
        console.log("invalid move!!")
        PegSolit.ply(board);
    }
};
*/