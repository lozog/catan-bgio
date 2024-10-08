import { Local, SocketIO } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";
import { HexBoard } from "./components/Board/Board";
import { HexGame } from "./Game";

const GameClient = Client({
    game: HexGame,
    board: HexBoard,
    numPlayers: 3,
    // multiplayer: Local(),
    multiplayer: SocketIO({ server: "localhost:8000" }),
});

const App = () => <GameClient playerID="0" />;

export default App;
