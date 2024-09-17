import { Coordinates, MathHelper } from "./MathHelper";
import _ from "lodash";

interface Edge {
    id?: string;
    center: Coordinates;
    ends: Coordinates[];
}

interface Tile {
    id: string;
    center: Coordinates;
    type?: string;
    value?: number;
    tileType?: string;
}

interface Corner {
    id?: string;
    center: Coordinates;
}

interface Layout {
    players: {
        min: number;
        max: number;
    };
    numberTokens: number[];
    terrainTiles: string;
    tiles: string[];
}

interface Allowance {
    roads: number;
    settlements: number;
    cities: number;
}

// TODO: rename
interface ScenarioInput {
    name: string;
    victoryPoints: number;
    allowance: Allowance;
    layouts: Layout[];
}

interface Board {
    // hex: ScenarioBuilder;
    height: number;
    width: number;
    tiles: Tile[];
    corners: Corner[];
    edges: Edge[];
}

export interface Scenario {
    allowance: Allowance;
    board: Board;
    victoryPoints: number;
}

const DEFAULT_SCENARIO: ScenarioInput = {
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

const SINGLE_HEX_SCENARIO: ScenarioInput = {
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
    private players: number;
    private scenario: any; // TODO
    private circumradius = 50;
    private apothem = Math.sqrt(
        Math.pow(this.circumradius, 2) - Math.pow(this.circumradius / 2, 2)
    );

    constructor() {
        // let defaults = {
        //     shuffleTerrainTiles: true,
        //     shuffleNumberTokens: false,
        // };

        this.players = 3;
        this.scenario = DEFAULT_SCENARIO;
    }

    getCircumradius() {
        return this.circumradius;
    }

    getLayout() {
        return this.scenario.layouts.find(
            (layout: Layout) =>
                layout.players.min === this.players ||
                layout.players.max >= this.players
        );
    }

    getTileLayout(layout: Layout) {
        let circumradius = this.circumradius;
        let apothem = this.apothem;

        let tiles = layout.tiles.map((row) => row.split(","));

        let counts = tiles.map((row) => row.length);

        let max = Math.max(...counts);
        let maxIndex = counts.indexOf(max) % 2;

        tiles.forEach(function (row, index) {
            let length = index % 2 === maxIndex ? max : max - 1;
            let add = length - row.length;
            for (let i = 0; i < add; i++) {
                row.push("-");
            }
        });

        let boardHeight = apothem * (tiles.length + 1);
        let boardWidth = (max * 2 + (max - 1)) * this.circumradius;
        let maxOffsetX = -(boardWidth / 2 - circumradius);
        let minOffsetX = circumradius * 1.5 + maxOffsetX;
        let offsetX = [
            maxIndex === 0 ? maxOffsetX : minOffsetX,
            maxIndex === 1 ? maxOffsetX : minOffsetX,
        ];
        let offsetY = -(boardHeight / 2 - apothem);

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
        let corners1 = _.chain(corners)
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
            let cornerId = "C" + (index + 1);
            board.corners.push({
                id: cornerId,
                center: corner.point,
            });
        });
    }

    processEdges(board: Board, edges: Edge[]) {
        let edges1 = _.chain(edges)
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
            let edgeId = "E" + (index + 1);
            board.edges.push({
                id: edgeId,
                center: edge.center,
                ends: edge.ends,
            });
        });
    }

    getScenario(): Scenario {
        let circumradius = this.circumradius;
        let apothem = this.apothem;
        let layout = this.getLayout();
        let numberTokens = layout.numberTokens;
        let terrainTiles = layout.terrainTiles.split(",");
        let tileLayout = this.getTileLayout(layout);
        let seaTiles: Tile[] = [];
        let resourceTiles: Tile[] = [];
        let tileId = 0;
        let desert = 0;
        let corners: Coordinates[] = []; // TODO: these not being typed as Corner is confusing
        let edges: Edge[] = [];

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
                let x = tileLayout.offsetX[i % 2] + circumradius * 3 * j;
                let y = apothem * i + tileLayout.offsetY;
                let center = {
                    x: MathHelper.round(x, 3),
                    y: MathHelper.round(y, 3),
                };

                if (tile.startsWith("t")) {
                    let tileNo = -1 + parseInt(tile.substring(1), 10);
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

        let board: Board = {
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
                corners.push(
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

        this.processCorners(board, corners);
        this.processEdges(board, edges);

        return {
            allowance: this.scenario.allowance,
            board,
            victoryPoints: this.scenario.victoryPoints,
        };
    }
}
