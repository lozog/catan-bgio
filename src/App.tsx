import { Local, SocketIO } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";
import { GameArea } from "./components/GameArea/GameArea";
import { HexGame } from "./Game";

const GameClient = Client({
    game: HexGame,
    board: GameArea,
    numPlayers: 3,
    // multiplayer: Local(),
    multiplayer: SocketIO({ server: "localhost:8000" }),
});

const App = () => <GameClient playerID="0" />;

export default App;
