import { Game } from "boardgame.io";
import { ScenarioBuilder } from "./lib/ScenarioBuilder";
import { GameState } from "./lib/types";

export const HexGame: Game<GameState> = {
    setup: ({ ctx }) => {
        const scenarioBuilder = new ScenarioBuilder();
        const gameState = scenarioBuilder.buildGameState(ctx.numPlayers);

        return gameState;
    },
    turn: {
        minMoves: 1,
        maxMoves: 1,
    },

    phases: {
        setupForward: {
            start: true,
            moves: {
                clickCorner: ({ G, playerID }, id) => {
                    console.log(`clicked ${id}`);
                    const corner = G.board.corners.find((c) => c.id === id);
                    if (!corner) {
                        throw new Error("Corner not found");
                    }
                    corner.player = playerID;
                },
            },
        },
    },
};
