import { Client } from "boardgame.io/react";
import { HexBoard } from "./Board";
import { HexGame } from "./Game";

const App = Client({
    game: HexGame,
    board: HexBoard,
    numPlayers: 3,
});

export default App;
