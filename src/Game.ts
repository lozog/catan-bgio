import { Game } from "boardgame.io";
import { Scenario, ScenarioBuilder } from "./lib/ScenarioBuilder";

export interface GameState {
    cells: Array<string | null>;
    scenario: Scenario;
}

// Return true if `cells` is in a winning configuration.
function IsVictory(cells: Array<string | null>): boolean {
    const positions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const isRowComplete = (row: number[]) => {
        const symbols = row.map((i) => cells[i]);
        return symbols.every((i) => i !== null && i === symbols[0]);
    };

    return positions.map(isRowComplete).some((i) => i === true);
}

// Return true if all `cells` are occupied.
function IsDraw(cells: Array<string | null>): boolean {
    return cells.filter((c) => c === null).length === 0;
}

export const TicTacToe: Game<GameState> = {
    setup: () => {
        const scenarioBuilder = new ScenarioBuilder();
        const scenario = scenarioBuilder.getScenario();

        return { cells: Array(9).fill(null), scenario };
    },
    turn: {
        minMoves: 1,
        maxMoves: 1,
    },

    moves: {
        clickCell: ({ G, playerID }, id) => {
            console.log(`clicked tile ${id}`);
        },
    },

    endIf: ({ G, ctx }) => {
        if (IsVictory(G.cells)) {
            return { winner: ctx.currentPlayer };
        }
        if (IsDraw(G.cells)) {
            return { draw: true };
        }
    },
};
