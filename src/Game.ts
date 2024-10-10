import { Game } from "boardgame.io";
import { ScenarioBuilder } from "./lib/ScenarioBuilder";
import { Building, Corner, GameState, Hand, Player } from "./lib/types";
import { INVALID_MOVE } from "boardgame.io/core";
import {
    getCorner,
    getEdge,
    getPlayer,
    findTile,
    isCorner,
    isEdge,
    isEdgeAdjacentToCorner,
} from "./lib/helpers";
import { BUILDING_COSTS } from "./constants";

/**
 * Given a dice roll, find all tiles with same value
 * and yield resources to players with adjacent settlements/cities
 */
function distributeResources(G: GameState, roll: number) {
    for (const tile of G.board.tiles) {
        if (!(tile.value === roll)) continue;

        for (const cornerId of tile.corners) {
            const corner = getCorner(G, cornerId);
            if (corner.player) {
                const player = getPlayer(G, corner.player);
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

    const corner = getCorner(G, cornerId);

    if (corner.player) {
        return false;
    }

    for (const adjacentCornerId of corner.adjacentCorners) {
        const adjacentCorner = getCorner(G, adjacentCornerId);
        if (adjacentCorner.player) return false;
    }

    corner.player = player.id;
    corner.building = "settlement";
    player.settlements.push(corner.id!);

    return true;
}

/**
 * @returns false if invalid move
 */
function placeCity(G: GameState, cornerId: string, player: Player): boolean {
    if (!isCorner(cornerId)) return false;

    const corner = getCorner(G, cornerId);

    if (corner.player !== player.id) {
        return false;
    }

    if (corner.building !== "settlement") {
        return false;
    }

    corner.player = player.id;
    corner.building = "city";
    player.cities.push(corner.id!);

    return true;
}

/**
 *
 * @param G
 * @param edgeId
 * @param player
 * @param playerEdges list of edge Ids currently owned by player. edgeId must be adjacent to one of these
 * @param adjacentCorner used for setup phases - edge must be adjacent to corner if passed
 * @returns true if road was successfully placed, false otherwise
 */
function placeRoad(
    G: GameState,
    edgeId: string,
    player: Player,
    playerEdges: string[],
    adjacentCorner?: Corner
): boolean {
    if (!isEdge(edgeId)) return false;
    const edge = getEdge(G, edgeId);

    if (edge.player) {
        console.log(`edge ${edgeId} already owned`);
        return false;
    }

    if (adjacentCorner) {
        if (!isEdgeAdjacentToCorner(edge, adjacentCorner)) {
            console.log(
                `edge ${edgeId} not adjacent to corner ${adjacentCorner.id}`
            );
            return false;
        }
    }

    if (playerEdges.length > 0) {
        const isThisEdgeAdjacentToPlayerEdges = playerEdges.find((id) => {
            const e = getEdge(G, id);
            return !!e.adjacentEdges.find((id) => id === edgeId);
        });

        if (!isThisEdgeAdjacentToPlayerEdges) {
            console.log(`edge ${edgeId} not adjacent to any player edges`);
            return false;
        }
    }

    edge.player = player.id;
    player.roads.push(edge.id!);
    return true;
}

function purchaseIfSufficientResources(
    G: GameState,
    player: Player,
    building: Building
): boolean {
    const building_cost =
        BUILDING_COSTS[building as keyof typeof BUILDING_COSTS];

    // TODO: clean this up
    if (
        player.hand["wood"] >= building_cost["wood"] &&
        player.hand["wheat"] >= building_cost["wheat"] &&
        player.hand["brick"] >= building_cost["brick"] &&
        player.hand["ore"] >= building_cost["ore"] &&
        player.hand["sheep"] >= building_cost["sheep"]
    ) {
        player.hand["wood"] -= building_cost["wood"];
        player.hand["wheat"] -= building_cost["wheat"];
        player.hand["brick"] -= building_cost["brick"];
        player.hand["ore"] -= building_cost["ore"];
        player.hand["sheep"] -= building_cost["sheep"];
        return true;
    }
    console.log(`insufficient resources to build ${building}`);
    return false;
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
                    first: () => 0,
                    next: ({ ctx }) => (ctx.playOrderPos + 1) % ctx.numPlayers,
                },
                minMoves: 2,
                maxMoves: 2,
            },
            endIf: ({ G, ctx }) => ctx.turn > ctx.numPlayers,
            moves: {
                buildSettlement: ({ G, playerID }, id) => {
                    console.log(`clicked ${id}`);

                    const player = getPlayer(G, playerID);

                    if (player.settlements.length !== 0) return INVALID_MOVE;
                    if (!placeSettlement(G, id, player)) return INVALID_MOVE;
                },
                buildRoad: ({ G, playerID }, id) => {
                    console.log(`clicked ${id}`);

                    const player = getPlayer(G, playerID);

                    if (player.settlements.length === 0) return INVALID_MOVE;
                    if (
                        !placeRoad(
                            G,
                            id,
                            player,
                            [],
                            getCorner(G, player.settlements[0])
                        )
                    )
                        return INVALID_MOVE;
                },
            },
        },
        setupReverse: {
            next: "main",
            turn: {
                order: {
                    first: ({ ctx }) => ctx.numPlayers - 1,
                    next: ({ ctx }) => (ctx.playOrderPos - 1) % ctx.numPlayers,
                },
                minMoves: 2,
                maxMoves: 2,
            },
            endIf: ({ ctx }) => ctx.playOrderPos < 0,
            moves: {
                buildSettlement: ({ G, playerID }, id) => {
                    console.log(`clicked ${id}`);

                    const player = getPlayer(G, playerID);

                    if (player.settlements.length !== 1) return INVALID_MOVE;
                    if (!placeSettlement(G, id, player)) return INVALID_MOVE;

                    // give last player their resources
                    // given a corner, find all adjacent tiles and yield resources
                    const corner = getCorner(G, id);
                    yieldResourcesFromTiles(G, corner.tiles, player);
                },
                buildRoad: ({ G, playerID }, id) => {
                    console.log(`clicked ${id}`);

                    const player = getPlayer(G, playerID);

                    if (player.settlements.length === 1) return INVALID_MOVE;
                    if (
                        !placeRoad(
                            G,
                            id,
                            player,
                            [],
                            getCorner(G, player.settlements[1])
                        )
                    )
                        return INVALID_MOVE;
                },
            },
        },
        main: {
            moves: {
                rollDice: ({ G, random }) => {
                    if (G.diceRoll.length !== 0) return INVALID_MOVE;
                    G.diceRoll = random.D6(2);
                    const diceTotal = G.diceRoll[0] + G.diceRoll[1];
                    console.log(`Rolled ${diceTotal}`);

                    // hand out all resources
                    distributeResources(G, diceTotal);
                },
                endTurn: ({ G, events }) => {
                    console.log(G.diceRoll.length);
                    if (G.diceRoll.length === 0) return INVALID_MOVE;
                    G.diceRoll = [];
                    console.log("ending turn");

                    events.endTurn();
                },
                buildSettlement: ({ G, playerID }, id) => {
                    if (G.diceRoll.length === 0) return INVALID_MOVE;
                    console.log(`clicked ${id}`);

                    const player = getPlayer(G, playerID);

                    if (!purchaseIfSufficientResources(G, player, "settlement"))
                        return INVALID_MOVE;

                    if (!placeSettlement(G, id, player)) return INVALID_MOVE;
                },
                buildRoad: ({ G, playerID }, id) => {
                    if (G.diceRoll.length === 0) return INVALID_MOVE;
                    console.log(`clicked ${id}`);

                    const player = getPlayer(G, playerID);

                    if (!purchaseIfSufficientResources(G, player, "road"))
                        return INVALID_MOVE;

                    if (!placeRoad(G, id, player, player.roads))
                        return INVALID_MOVE;
                },
                buildCity: ({ G, playerID }, id) => {
                    if (G.diceRoll.length === 0) return INVALID_MOVE;
                    console.log(`clicked ${id}`);

                    const player = getPlayer(G, playerID);

                    if (!purchaseIfSufficientResources(G, player, "city"))
                        return INVALID_MOVE;

                    if (!placeCity(G, id, player)) return INVALID_MOVE;
                },
            },
        },
    },
};
