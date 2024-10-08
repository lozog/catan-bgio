import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { GameState } from "../../lib/types";
import { getPlayer } from "../../lib/helpers";
import { useState } from "react";
import { TradeWindow } from "../TradeWindow/TradeWindow";
import { Container, Controls, Hud, PlayerResource, TurnInfo } from "./styles";
import { Board } from "../Board/Board";

export function GameArea(props: BoardProps<GameState>) {
    const { ctx, G, moves, playerID } = props;
    const [isTradeWindowOpen, setIsTradeWindowOpen] = useState(false);

    let currentPlayer;
    if (!playerID) {
        // spectator mode
        currentPlayer = getPlayer(G, ctx.currentPlayer);
    } else {
        currentPlayer = getPlayer(G, playerID);
    }

    return (
        <Container>
            <Board {...props} />

            <Hud>
                <Controls>
                    <button
                        disabled={G.diceRoll.length !== 0} // TODO: create isValidMove function
                        onClick={() => moves.rollDice()}
                    >
                        Roll dice
                    </button>
                    <button
                        disabled={G.diceRoll.length === 0}
                        onClick={() => {
                            setIsTradeWindowOpen(!isTradeWindowOpen);
                        }}
                    >
                        Open trade menu
                    </button>
                    <button
                        disabled={G.diceRoll.length === 0}
                        onClick={() => moves.endTurn()}
                    >
                        End turn
                    </button>
                    {isTradeWindowOpen && <TradeWindow />}
                </Controls>
                <TurnInfo>
                    <div>Current phase: {ctx.phase}</div>
                    <div>player: {currentPlayer.id}</div>

                    <div>
                        Roll:{" "}
                        {G.diceRoll.length
                            ? G.diceRoll[0] + G.diceRoll[1]
                            : "--"}
                    </div>
                    <PlayerResource>
                        wood: {currentPlayer.hand["wood"]}
                    </PlayerResource>
                    <PlayerResource>
                        brick: {currentPlayer.hand["brick"]}
                    </PlayerResource>
                    <PlayerResource>
                        sheep: {currentPlayer.hand["sheep"]}
                    </PlayerResource>
                    <PlayerResource>
                        wheat: {currentPlayer.hand["wheat"]}
                    </PlayerResource>
                    <PlayerResource>
                        ore: {currentPlayer.hand["ore"]}
                    </PlayerResource>
                </TurnInfo>
            </Hud>
        </Container>
    );
}
