import { Server, Origins } from "boardgame.io/server";

import { HexGame } from "./Game";

const server = Server({
    games: [HexGame],
    origins: [Origins.LOCALHOST],
});

server.run(8000, () => {
    console.log("Server is running on port 8000");
});
