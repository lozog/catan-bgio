import { Client } from "boardgame.io/react";
import { TicTacToeBoard } from "./Board";
import { TicTacToe } from "./Game";

const App = Client({
    game: TicTacToe,
    board: TicTacToeBoard,
});

export default App;
