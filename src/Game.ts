import { Game } from "boardgame.io";
import { ScenarioBuilder } from "./lib/ScenarioBuilder";
import { GameState } from "./lib/types";
import { INVALID_MOVE, TurnOrder } from "boardgame.io/core";

function isCorner(id: string) {
    return id[0] === "C";
}

function isEdge(id: string) {
    return id[0] === "E";
}

export const HexGame: Game<GameState> = {
    setup: ({ ctx }) => {
        const scenarioBuilder = new ScenarioBuilder();
        const gameState = scenarioBuilder.buildGameState(ctx.numPlayers);

        return gameState;
    },
    phases: {
        setupForward: {
            start: true,
            turn: {
                order: TurnOrder.ONCE,
                minMoves: 2,
                maxMoves: 2,
            },
            moves: {
                onClickBoardPiece: ({ G, playerID }, id) => {
                    console.log(`clicked ${id}`);

                    const player = G.players.find((p) => p.id === playerID);
                    if (!player) {
                        throw new Error("player not found");
                    }

                    if (player.settlements.length === 0) {
                        if (isCorner(id)) {
                            const corner = G.board.corners.find(
                                (c) => c.id === id
                            );
                            if (!corner) {
                                throw new Error("corner not found");
                            }

                            corner.player = playerID;
                            player.settlements.push(corner.id!);
                        } else {
                            return INVALID_MOVE;
                        }
                    } else {
                        // TODO: edge must be adjacent to corner
                        if (isEdge(id)) {
                            const edge = G.board.edges.find((c) => c.id === id);
                            if (!edge) {
                                throw new Error("edge not found");
                            }

                            edge.player = playerID;
                            player.settlements.push(edge.id!);
                        } else {
                            return INVALID_MOVE;
                        }
                    }
                },
            },
        },
    },
};
