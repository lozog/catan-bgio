import { Game } from "boardgame.io";
import { Scenario, ScenarioBuilder } from "./lib/ScenarioBuilder";

export interface GameState {
    scenario: Scenario;
}

export const HexGame: Game<GameState> = {
    setup: () => {
        const scenarioBuilder = new ScenarioBuilder();
        const scenario = scenarioBuilder.getScenario();

        return { scenario };
    },
    turn: {
        minMoves: 1,
        maxMoves: 1,
    },

    moves: {
        clickTile: ({ G, playerID }, id) => {
            console.log(`clicked tile ${id}`);
        },
    },
};
