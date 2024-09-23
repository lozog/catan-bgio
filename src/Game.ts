import { Game } from "boardgame.io";
import { ScenarioBuilder } from "./lib/ScenarioBuilder";
import { GameState } from "./lib/types";
import { INVALID_MOVE } from "boardgame.io/core";
import {
    findCorner,
    findEdge,
    findPlayer,
    isCorner,
    isEdge,
} from "./lib/helpers";

export const HexGame: Game<GameState> = {
    setup: ({ ctx }) => {
        const scenarioBuilder = new ScenarioBuilder();
        const gameState = scenarioBuilder.buildGameState(ctx.numPlayers);

        return gameState;
    },
    phases: {
        setupForward: {
            start: true,
            next: "setupReverse",
            turn: {
                order: {
                    first: ({ G, ctx }) => 0,
                    next: ({ G, ctx }) =>
                        (ctx.playOrderPos + 1) % ctx.numPlayers,
                },
                minMoves: 2,
                maxMoves: 2,
            },
            endIf: ({ G, ctx }) => ctx.turn > ctx.numPlayers,
            moves: {
                onClickBoardPiece: ({ G, playerID }, id) => {
                    console.log(`clicked ${id}`);

                    const player = findPlayer(G, playerID);

                    if (player.settlements.length === 0) {
                        if (isCorner(id)) {
                            const corner = findCorner(G, id);
                            corner.player = playerID;
                            player.settlements.push(corner.id!);
                        } else {
                            return INVALID_MOVE;
                        }
                    } else {
                        // TODO: edge must be adjacent to corner
                        if (isEdge(id)) {
                            const edge = findEdge(G, id);
                            edge.player = playerID;
                            player.roads.push(edge.id!);
                        } else {
                            return INVALID_MOVE;
                        }
                    }
                },
            },
        },
        setupReverse: {
            turn: {
                order: {
                    first: ({ G, ctx }) => ctx.numPlayers - 1,
                    next: ({ G, ctx }) =>
                        (ctx.playOrderPos - 1) % ctx.numPlayers,
                },
                minMoves: 2,
                maxMoves: 2,
            },
            endIf: ({ G, ctx }) => ctx.playOrderPos < 0,
            moves: {
                onClickBoardPiece: ({ G, playerID }, id) => {
                    console.log(`clicked ${id}`);

                    const player = findPlayer(G, playerID);

                    if (player.settlements.length === 1) {
                        if (isCorner(id)) {
                            const corner = findCorner(G, id);
                            corner.player = playerID;
                            player.settlements.push(corner.id!);
                        } else {
                            return INVALID_MOVE;
                        }
                    } else {
                        // TODO: edge must be adjacent to corner
                        if (isEdge(id)) {
                            const edge = findEdge(G, id);
                            edge.player = playerID;
                            player.roads.push(edge.id!);
                        } else {
                            return INVALID_MOVE;
                        }
                    }
                },
            },
        },
    },
};
