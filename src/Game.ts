import { Game } from "boardgame.io";
import { ScenarioBuilder } from "./lib/ScenarioBuilder";
import { Corner, GameState, Hand, Player } from "./lib/types";
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

/**
 * Given a dice roll, find all tiles with same value
 * and yield resources to players with adjacent settlements/cities
 */
function distributeResources(G: GameState, roll: number) {
    for (const tile of G.board.tiles) {
        if (!(tile.value === roll)) continue;

        for (const cornerId of tile.corners) {
            const corner = findCorner(G, cornerId);
            if (corner.player) {
                const player = findPlayer(G, corner.player);
                if (!tile.type) {
                    // TODO: make type required
                    throw new Error(`Tile ${tile.id} has no type`);
                }
                player.hand[tile.type as keyof Hand] +=
                    corner.building === "settlement" ? 1 : 2;
                console.log(`Giving ${tile.type} to player ${player.id}`);
            }
        }
    }
}

function yieldResourcesFromTiles(
    G: GameState,
    tileIds: string[],
    player: Player
) {
    tileIds.forEach((tileId) => {
        const tile = findTile(G, tileId);
        if (!tile.type) {
            throw new Error(`Tile ${tile.id} is missing type`);
        }
        if (!(tile.type in player.hand)) return;
        player.hand[tile.type as keyof Hand]++;
    });
}

/**
 * @returns false if invalid move
 */
function placeSettlement(
    G: GameState,
    cornerId: string,
    player: Player
): boolean {
    if (!isCorner(cornerId)) return false;

    const corner = findCorner(G, cornerId);

    if (corner.player) {
        return false;
    }

    // TODO: settlement must be two places away from any others

    corner.player = player.id;
    corner.building = "settlement";
    player.settlements.push(corner.id!);

    return true;
}

/**
 * @returns false if invalid move
 */
function placeRoad(
    G: GameState,
    edgeId: string,
    player: Player,
    adjacentCorner?: Corner
): boolean {
    if (!isEdge(edgeId)) return false;
    const edge = findEdge(G, edgeId);

    if (edge.player) {
        return false;
    }

    if (adjacentCorner) {
        if (!isEdgeAdjacentToCorner(edge, adjacentCorner)) {
            return false;
        }
    }

    edge.player = player.id;
    player.roads.push(edge.id!);
    return true;
}

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
                        if (!placeSettlement(G, id, player))
                            return INVALID_MOVE;
                    } else {
                        if (
                            !placeRoad(
                                G,
                                id,
                                player,
                                findCorner(G, player.settlements[0])
                            )
                        )
                            return INVALID_MOVE;
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
                        if (!placeSettlement(G, id, player))
                            return INVALID_MOVE;

                        // give last player their resources
                        // given a corner, find all adjacent tiles and yield resources
                        const corner = findCorner(G, id);
                        yieldResourcesFromTiles(G, corner.tiles, player);
                    } else {
                        if (
                            !placeRoad(
                                G,
                                id,
                                player,
                                findCorner(G, player.settlements[1])
                            )
                        )
                            return INVALID_MOVE;
                    }
                },
            },
        },
        main: {
            moves: {
                rollDice: ({ G, playerID, random }) => {
                    if (G.diceRoll.length !== 0) return INVALID_MOVE;
                    G.diceRoll = random.D6(2);
                    const diceTotal = G.diceRoll[0] + G.diceRoll[1];
                    console.log(`Rolled ${diceTotal}`);

                    // hand out all resources
                    distributeResources(G, diceTotal);
                },
                endTurn: ({ G, playerId, events }) => {
                    if (G.diceRoll.length === 0) return INVALID_MOVE;
                    G.diceRoll = [];
                    events.endTurn();
                },
            },
        },
    },
};
