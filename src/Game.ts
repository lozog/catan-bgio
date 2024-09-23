import { Game } from "boardgame.io";
import { Scenario, ScenarioBuilder } from "./lib/ScenarioBuilder";

export interface GameState {
    scenario: Scenario;
}

export const HexGame: Game<GameState> = {
    setup: () => {
        const scenarioBuilder = new ScenarioBuilder();
        const scenario = scenarioBuilder.getScenario(); // TODO it's the whole gamestate actually

        return { scenario };
    },
    turn: {
        minMoves: 1,
        maxMoves: 1,
    },

    phases: {
        setupForward: {
            start: true,
            moves: {
                clickCorner: ({ G, playerID }, id) => {
                    console.log(`clicked ${id}`);
                    const corner = G.scenario.board.corners.find(
                        (c) => c.id === id
                    );
                    if (!corner) {
                        console.log("corner undefined");
                        return;
                    }
                    corner.player = playerID;
                },
            },
        },
    },
};
