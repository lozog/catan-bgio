import { Client } from "boardgame.io/react";
import { HexBoard } from "./Board";
import { HexGame } from "./Game";

const App = Client({
    game: HexGame,
    board: HexBoard,
    numPlayers: 2,
});

export default App;
