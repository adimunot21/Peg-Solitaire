import { findIndex } from "ramda";
import PegSolit from "../common/pegSolit.js";
import R from "../common/ramda.js";

const DISPLAY_MODE = "to_string";

const display_functions = {
    "json": JSON.stringify,
    "to_string": PegSolit.to_string_with_tokens(PegSolit.token_strings.disks)
};
const display_board = function (board) {
    try {
        return "\n" + display_functions[DISPLAY_MODE](board);
    } catch (ignore) {
        return "\n" + JSON.stringify(board);
    }
};

/**
 * Returns if the board is in a valid state.
 * A board is valid if all the following are true:
 * - The board is a rectangular 2d array containing only 0 and 1 as elements
 * - There is at least one 0 and one 1 as elements
 * @memberof PegSolit.test
 * @function
 * @param {Board} board The board to test.
 * @throws if the board fails any of the above conditions.
 */
const throw_if_invalid = function (board) {
    // Rectangular array.
    if (!Array.isArray(board) || !Array.isArray(board[0])) {
        throw new Error(
            "The board is not a 2D array: " + display_board(board)
        );
    }
    const height = board[0].length;
    const rectangular = R.all(
        (column) => column.length === height,
        board
    );
    if (!rectangular) {
        throw new Error(
            "The board is not rectangular: " + display_board(board)
        );
    }

    // Only valid tokens
    const token_or_empty = [0, 1];
    const contains_valid_tokens = R.pipe(
        R.flatten,
        R.all((slot) => token_or_empty.includes(slot))
    )(board);
    if (!contains_valid_tokens) {
        throw new Error(
            "The board contains invalid tokens: " + display_board(board)
        );
    }
};

describe("Starting Board", function () {
    it("A starting board is a valid board", function () {
        const empty_board = PegSolit.starting_board();
        throw_if_invalid(empty_board);
    });

    it("A starting board is not ended.", function () {
        const starting_board = PegSolit.starting_board();
        if (PegSolit.is_ended(starting_board)) {
            throw new Error(
                "An empty board should not be ended: " +
                display_board(starting_board)
            );
        }
    });

    it("A starting board has just 1 empty space.", function () {
        const starting_board = PegSolit.starting_board();
        const one_free_slot = function (board) {
            if (R.sum(R.flatten(board)) === 35) {
                return true;
            }
        };
        if (!one_free_slot(starting_board)) {
            throw new Error(
                "The starting board has more than 1 empty slot: " +
                display_board(starting_board)
            );
        }
    });

    it("A starting board has not been won", function () {
        const starting_board = PegSolit.starting_board();
        if (
            PegSolit.has_won(starting_board)
        ) {
            throw new Error(
                "The starting board has been won: " +
                display_board(starting_board)
            );
        }
    });
});

describe("Plies", function () {
    it(
        `Considering the rule says moves allowed
        orthogonally, any jump over a piece diagonally
        should not be allowed and should stay as the same board
        as the existing one. `,
        function () {
            const not_ended_board =
                [
                    [1, 1, 0, 0, 0, 0],
                    [1, 1, 0, 0, 0, 0],
                    [1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0]
                ];
            if (
                    PegSolit.update_board(not_ended_board, [2,2,4,4]) !== undefined
                ) {
                    throw new Error(
                        "A diagonal move was allowed in this board " +
                        display_board(not_ended_board)
                    );
                }
        });

    it(
        `A piece should only be allowed to jump over
        one other peg, not more than that. Thus, if
        a move is made to jump over 2 or more, it
        should return undefined and the updated board
        should stay the same as previous. `,
        function () {
            const not_ended_board =
                [
                    [1, 1, 0, 0, 0, 0],
                    [1, 1, 0, 0, 0, 0],
                    [1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0]
                ];
            if (
                    PegSolit.update_board(not_ended_board, [0,1,4,1]) !== undefined
                ) {
                    throw new Error(
                        "A piece jumped over 2 pieces instead of one " +
                        display_board(not_ended_board)
                    );
                }
        });

    it(
        `The rule of the game is to pick
        up a peg, thus if the player tries to
        pick up an empty hole, the update_board
        function will return undefined `,
        function () {
            const not_ended_board =
                [
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0]
                ];
            if (
                    PegSolit.update_board(not_ended_board, [1,1,3,1]) !== undefined
                ) {
                    throw new Error(
                        "An empty slot got selected and played with" +
                        display_board(not_ended_board)
                    );
                }
        });
});

describe("Ended boards", function () {
    it("A board with just one 1 should be ended", function () {
        const ended_board = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]
        ];
        if (!PegSolit.is_ended(ended_board)) {
            throw new Error(
                `A board with a winning configuration,
should be marked as won
${display_board(ended_board)}`
            );
        }
    });

    it(
        `A board with multiple 1s but them having no valid
        moves around should be an ended board`,
        function () {
            const four_ones = [
                [0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 0],
                [1, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 0, 0]
            ];
            if (
                !PegSolit.is_ended(four_ones)
            ) {
                throw new Error(
                    `A board with a winning configuration,
should be marked as won
${display_board(four_ones)}`
                );
            }
        }
    );

    it(
        `A board with a just one line filled with 1s
        rest zeros should be an ended board`,
        function () {
            const vertical_win = [
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0]
            ];
            if (
                !PegSolit.is_ended(vertical_win)
            ) {
                throw new Error(
                    `A board with a winning configuration,
should be marked as won
${display_board(vertical_win)}`
                );
            }
        }
    );
});
