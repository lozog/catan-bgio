import { Game } from "boardgame.io";
import { ScenarioBuilder } from "./lib/ScenarioBuilder";
import { GameState, Hand } from "./lib/types";
import { INVALID_MOVE } from "boardgame.io/core";
import {
    findCorner,
    findEdge,
    findPlayer,
    findTile,
    isCorner,
    isEdge,
    isEdgeAdjacentToCorner,
} from "./lib/helpers";

export const HexGame: Game<GameState> = {
    setup: ({ ctx }) => {
        const scenarioBuilder = new ScenarioBuilder(ctx.numPlayers);
        const gameState = scenarioBuilder.buildGameState();

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

                            if (corner.player) {
                                return INVALID_MOVE;
                            }
                            corner.player = playerID;
                            player.settlements.push(corner.id!);
                        } else {
                            return INVALID_MOVE;
                        }
                    } else {
                        if (isEdge(id)) {
                            const edge = findEdge(G, id);

                            if (edge.player) {
                                return INVALID_MOVE;
                            }

                            if (
                                !isEdgeAdjacentToCorner(
                                    edge,
                                    findCorner(G, player.settlements[0])
                                )
                            ) {
                                return INVALID_MOVE;
                            }

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
            next: "main",
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

                            if (corner.player) {
                                return INVALID_MOVE;
                            }
                            corner.player = playerID;
                            player.settlements.push(corner.id!);

                            corner.tiles.forEach((tileId) => {
                                const tile = findTile(G, tileId);
                                if (!tile.type) {
                                    throw new Error(
                                        `Tile ${tile.id} is missing type`
                                    );
                                }
                                if (!(tile.type in player.hand)) return;
                                player.hand[tile.type as keyof Hand]++;
                            });
                        } else {
                            return INVALID_MOVE;
                        }
                    } else {
                        if (isEdge(id)) {
                            const edge = findEdge(G, id);

                            if (edge.player) {
                                return INVALID_MOVE;
                            }

                            if (
                                !isEdgeAdjacentToCorner(
                                    edge,
                                    findCorner(G, player.settlements[1])
                                )
                            ) {
                                return INVALID_MOVE;
                            }

                            edge.player = playerID;
                            player.roads.push(edge.id!);
                        } else {
                            return INVALID_MOVE;
                        }
                    }
                },
            },
        },
        main: {
            moves: {
                rollDice: ({ G, playerID, random }) => {
                    if (G.diceRoll.length !== 0) return INVALID_MOVE;
                    G.diceRoll = random.D6(2);
                },
                endTurn: ({ G, playerId, events }) => {
                    G.diceRoll = [];
                    events.endTurn();
                },
            },
        },
    },
};
