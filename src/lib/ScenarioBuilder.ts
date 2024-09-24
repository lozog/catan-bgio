import { Coordinates, MathHelper } from "./MathHelper";
import _ from "lodash";
import {
    Board,
    Edge,
    Layout,
    GameState,
    Scenario,
    Tile,
    Player,
} from "./types";
import { PLAYER_COLORS } from "../constants";

const DEFAULT_SCENARIO: Scenario = {
    name: "Base game",
    victoryPoints: 10,
    allowance: {
        roads: 15,
        settlements: 5,
        cities: 4,
    },
    layouts: [
        {
            players: {
                min: 3,
                max: 4,
            },
            numberTokens: [
                5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11,
            ],
            terrainTiles: "o,g,l,o,g,w,g,w,l,b,d,b,w,w,l,b,o,l,g",
            tiles: [
                "-,s",
                "-,s,s",
                "s,t3,s",
                "s,t4,t2,s",
                "t5,t14,t1",
                "s,t15,t13,s",
                "t6,t19,t12",
                "s,t16,t18,s",
                "t7,t17,t11",
                "s,t8,t10,s",
                "s,t9,s",
                "-,s,s",
                "-,s",
            ],
        },
    ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SINGLE_HEX_SCENARIO: Scenario = {
    name: "One tile game",
    victoryPoints: 10,
    allowance: {
        roads: 15,
        settlements: 5,
        cities: 4,
    },
    layouts: [
        {
            players: {
                min: 3,
                max: 4,
            },
            numberTokens: [5],
            terrainTiles: "o,g,l,o,g,w,g,w,l",
            tiles: ["-,s", "-,s,s", "-,t9", "-,s,s", "-,s"],
        },
    ],
};

// adapted from https://github.com/sibartlett/colonizers
export class ScenarioBuilder {
    private numPlayers: number;
    private scenario: Scenario;
    private circumradius = 50;
    private apothem = Math.sqrt(
        Math.pow(this.circumradius, 2) - Math.pow(this.circumradius / 2, 2)
    );

    constructor(numPlayers: number) {
        // const defaults = {
        //     shuffleTerrainTiles: true,
        //     shuffleNumberTokens: false,
        // };

        this.numPlayers = numPlayers;
        this.scenario = DEFAULT_SCENARIO;
    }

    getLayout(): Layout {
        const res = this.scenario.layouts.find(
            (layout: Layout) =>
                layout.players.min === this.numPlayers ||
                layout.players.max >= this.numPlayers
        );

        if (!res) {
            throw new Error(
                "Could not find layout suitable for this number of players"
            );
        }
        return res;
    }

    getTileLayout(layout: Layout) {
        const tiles = layout.tiles.map((row) => row.split(","));
        const counts = tiles.map((row) => row.length);
        const max = Math.max(...counts);
        const maxIndex = counts.indexOf(max) % 2;

        tiles.forEach(function (row, index) {
            const length = index % 2 === maxIndex ? max : max - 1;
            const add = length - row.length;
            for (let i = 0; i < add; i++) {
                row.push("-");
            }
        });

        const boardHeight = this.apothem * (tiles.length + 1);
        const boardWidth = (max * 2 + (max - 1)) * this.circumradius;
        const maxOffsetX = -(boardWidth / 2 - this.circumradius);
        const minOffsetX = this.circumradius * 1.5 + maxOffsetX;
        const offsetX = [
            maxIndex === 0 ? maxOffsetX : minOffsetX,
            maxIndex === 1 ? maxOffsetX : minOffsetX,
        ];
        const offsetY = -(boardHeight / 2 - this.apothem);

        return {
            firstRowIsMax: maxIndex === 0,
            firstRowIsMin: maxIndex === 1,
            rows: tiles.length,
            maxRowLength: max,
            evenRowLength: maxIndex === 0 ? max : max - 1,
            oddRowLength: maxIndex === 1 ? max : max - 1,
            tiles: tiles,
            boardHeight: boardHeight,
            boardWidth: boardWidth,
            offsetX: offsetX,
            offsetY: offsetY,
        };
    }

    processCorners(board: Board, corners: Coordinates[]) {
        const corners1 = _.chain(corners)
            .map(function (corner) {
                return {
                    point: corner,
                    x: MathHelper.round(corner.x, 0),
                    y: MathHelper.round(corner.y, 0),
                };
            })
            .uniqBy(function (corner) {
                return corner.x + "," + corner.y;
            })
            .sortBy(function (corner) {
                return corner.x;
            })
            .sortBy(function (corner) {
                return corner.y;
            })
            .value();

        corners1.forEach(function (corner, index) {
            const cornerId = "C" + (index + 1);
            board.corners.push({
                id: cornerId,
                center: corner.point,
            });
        });
    }

    processEdges(board: Board, edges: Omit<Edge, "id">[]) {
        const edges1 = _.chain(edges)
            .map(function (edge) {
                return {
                    center: edge.center,
                    ends: edge.ends,
                    x: MathHelper.round(edge.center.x, 0),
                    y: MathHelper.round(edge.center.y, 0),
                };
            })
            .uniqBy(function (edge) {
                return edge.x + "," + edge.y;
            })
            .sortBy(function (edge) {
                return edge.x;
            })
            .sortBy(function (edge) {
                return edge.y;
            })
            .value();

        edges1.forEach(function (edge, index) {
            const edgeId = "E" + (index + 1);
            board.edges.push({
                id: edgeId,
                center: edge.center,
                ends: edge.ends,
            });
        });
    }

    buildGameState(): GameState {
        const circumradius = this.circumradius;
        const apothem = this.apothem;
        const layout = this.getLayout();
        const numberTokens = layout.numberTokens;
        const terrainTiles = layout.terrainTiles.split(",");
        const tileLayout = this.getTileLayout(layout);
        const seaTiles: Tile[] = [];
        const resourceTiles: Tile[] = [];
        let tileId = 0;
        let desert = 0;
        const cornerCenters: Coordinates[] = [];
        const edges: Omit<Edge, "id">[] = [];

        // if (this.options.shuffleNumberTokens) {
        //   numberTokens = _.shuffle(numberTokens);
        // }

        // if (this.options.shuffleTerrainTiles) {
        //   terrainTiles = _.shuffle(terrainTiles);
        // }

        tileLayout.tiles.forEach(function (tiles, i) {
            tiles.forEach(function (tile, j) {
                if (tile === "" || tile === "-") {
                    return;
                }

                tileId++;
                const x = tileLayout.offsetX[i % 2] + circumradius * 3 * j;
                const y = apothem * i + tileLayout.offsetY;
                const center = {
                    x: MathHelper.round(x, 3),
                    y: MathHelper.round(y, 3),
                };

                if (tile.startsWith("t")) {
                    const tileNo = -1 + parseInt(tile.substring(1), 10);
                    resourceTiles[tileNo] = {
                        id: "T" + tileId,
                        center: center,
                    };
                } else {
                    seaTiles.push({
                        id: "T" + tileId,
                        center: center,
                    });
                }
            });
        });

        const board: Board = {
            // hex: this,
            height: tileLayout.boardHeight,
            width: tileLayout.boardWidth,
            tiles: [],
            corners: [],
            edges: [],
        };

        seaTiles.forEach(function (tile) {
            board.tiles.push({
                id: tile.id,
                center: tile.center,
                type: "sea",
                value: 0,
            });
        });

        resourceTiles.forEach(function (tile, index) {
            switch (terrainTiles[index]) {
                case "d":
                    tile.tileType = "desert";
                    break;
                case "b":
                    tile.tileType = "brick";
                    break;
                case "g":
                    tile.tileType = "wheat";
                    break;
                case "l":
                    tile.tileType = "wood";
                    break;
                case "o":
                    tile.tileType = "ore";
                    break;
                case "w":
                    tile.tileType = "sheep";
            }

            let value = 0;
            let angle;

            if (tile.tileType === "desert") {
                desert += 1;
            } else {
                value = numberTokens[index - desert];
            }

            for (angle = 0; angle <= 300; angle += 60) {
                cornerCenters.push(
                    MathHelper.getEndpoint(tile.center, angle, circumradius)
                );
            }

            for (angle = 30; angle <= 330; angle += 60) {
                edges.push({
                    center: MathHelper.getEndpoint(tile.center, angle, apothem),
                    ends: [
                        MathHelper.getEndpoint(
                            tile.center,
                            angle - 30,
                            circumradius
                        ),
                        MathHelper.getEndpoint(
                            tile.center,
                            angle + 30,
                            circumradius
                        ),
                    ],
                });
            }

            board.tiles.push({
                id: tile.id,
                center: tile.center,
                type: tile.tileType,
                value: value,
            });
        });

        this.processCorners(board, cornerCenters);
        this.processEdges(board, edges);

        const players: Player[] = [];
        for (let i = 0; i < this.numPlayers; i++) {
            players.push({
                id: i.toString(),
                color: PLAYER_COLORS[i],
                settlements: [],
                roads: [],
                hand: {
                    wood: 0,
                    brick: 0,
                    ore: 0,
                    wheat: 0,
                    sheep: 0,
                },
            });
        }

        return {
            allowance: this.scenario.allowance,
            board,
            victoryPoints: this.scenario.victoryPoints,
            players,
        };
    }
}
