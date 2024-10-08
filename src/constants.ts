export const RESOURCES = ["wood", "brick", "ore", "wheat", "sheep"] as const;

export enum Color {
    wood = "#385626",
    brick = "#b33e27",
    ore = "#aa998f",
    sea = "#3777bb",
    wheat = "#f7bc36",
    sheep = "#92bb50",
    desert = "#c79f56",
    road = "#b57112",
    hover = "#efefef",
    player1 = "red",
    player2 = "blue",
    player3 = "green",
    player4 = "orange",
    player5 = "white",
}

export const TILE_COLORS = {
    wood: Color.wood,
    brick: Color.brick,
    ore: Color.ore,
    sea: Color.sea,
    wheat: Color.wheat,
    sheep: Color.sheep,
    desert: Color.desert,
};

export const PLAYER_COLORS = [
    Color.player1,
    Color.player2,
    Color.player3,
    Color.player4,
    Color.player5,
];

export const BUILDING_COSTS = {
    settlement: {
        wood: 1,
        wheat: 1,
        sheep: 1,
        brick: 1,
        ore: 0,
    },
    road: {
        wood: 1,
        brick: 1,
        wheat: 0,
        sheep: 0,
        ore: 0,
    },
    city: {
        wood: 0,
        brick: 0,
        wheat: 2,
        sheep: 0,
        ore: 3,
    },
};

export const BOARD_OFFSET = 300;

export const HEXAGON_SIZE = 100;
export const CORNER_SIZE = HEXAGON_SIZE / 5;
export const ROAD_WIDTH = 8;
