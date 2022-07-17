import R from "../common/ramda.js";
import Json_rpc from "./Json_rpc.js";
import PegSolit from "../common/pegSolit.js";

const play = new Audio("./assets/play.mp3");
const select = new Audio("./assets/select.mp3");

const grid_columns = 6;
const grid_rows = 6;

let board = PegSolit.starting_board();

const result_dialog = document.getElementById("result_dialog");

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");
const footer = document.getElementById("footer");

const positions = [];

const cells = R.range(0, 6).map(function (row_index) {
    const line = document.createElement("div");
    line.className = "row";

    const rows = R.range(0, 6).map(function (column_index) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.onclick = function () {
            if (positions.length === 4) {
                positions.length = 0;
            }
            positions.push(row_index, column_index);
            if (positions.length === 2) {
                select.play();
                let valid_moves = PegSolit.possible_valid_moves(board, row_index, column_index);
                if (valid_moves.length === 0){
                    document.getElementById("footer").textContent = (
                        `No valid moves for the selected piece :/`);
                    positions.length = 0;
                }
                else if(valid_moves.length===1) {document.getElementById("footer").textContent = (
                    `Valid moves for selected piece:
                    [${valid_moves[0]}] `
                );}
                else if(valid_moves.length===2) {document.getElementById("footer").textContent = (
                    `Valid moves for selected piece:
                    [${valid_moves[0]}],[${valid_moves[1]}]`
                );}
                else if(valid_moves.length===3) {document.getElementById("footer").textContent = (
                    `Valid moves for selected piece:
                    [${valid_moves[0]}],[${valid_moves[1]}],
                    [${valid_moves[2]}]`
                );}
                else if(valid_moves.length===4) {document.getElementById("footer").textContent = (
                    `Valid moves for selected piece:
                    [${valid_moves[0]}],[${valid_moves[1]}],
                    [${valid_moves[2]}],[${valid_moves[3]}]`
                );}
            }
            if (positions.length === 4) {
                document.getElementById("footer").textContent = (
                    `Select Piece`
                );
                if (PegSolit.valid_move(board, positions)) {
                    board = PegSolit.update_board(board, positions);
                    update_grid();
                    if (PegSolit.is_ended(board)) {
                        if(PegSolit.has_won(board)){
                            document.getElementById("result_dialog h2").textContent = (
                                "CONGRATS \n YOU WIN!!"
                            );
                        }
                        else {
                        const result = PegSolit.final_score(board);
                        document.getElementById("final_score").textContent = (
                            `Good! Your Score is ${result}!`
                        );
                        }
                        result_dialog.showModal();
                    }
                }
            }
        };
        line.append(cell);
        return cell;
    }
    );
    grid.append(line);
    return rows;
});

const update_grid = function () {
    play.play();
    cells.forEach(function (row, row_index) {
        row.forEach(function (cell, column_index) {
            const token = board[row_index][column_index];
            cell.classList.remove("empty");
            cell.classList.remove("red");
            if (token === 0) {
                cell.classList.add("empty");
            }
            if (token === 1) {
                cell.classList.add("red");
            }
        });
    });
};

result_dialog.onclick = function () {
    board = PegSolit.starting_board();
    update_grid();
    result_dialog.close();
};


update_grid();