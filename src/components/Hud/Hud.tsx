import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import { GameState, Hand } from "../../lib/types";

import { getPlayer } from "../../lib/helpers";
import { useState } from "react";
import { TradeWindow } from "../TradeWindow/TradeWindow";
import { Controls, Container, PlayerResource, TurnInfo } from "./styles";
import { TradeConfirmationMenu } from "../TradeConfirmationMenu/TradeConfirmationMenu";

export function Hud({ ctx, G, moves, playerID }: BoardProps<GameState>) {
    const [isTradeWindowOpen, setIsTradeWindowOpen] = useState(false);

    const onOfferTrade = (offer: Hand) => {
        moves.offerTrade(playerID, offer);
    };

    const onAcceptTrade = () => {
        moves.acceptTrade(playerID);
    };

    const onRejectTrade = () => {
        moves.rejectTrade(playerID);
    };

    let viewPlayer;
    if (!playerID) {
        // spectator mode
        viewPlayer = getPlayer(G, ctx.currentPlayer);
    } else {
        viewPlayer = getPlayer(G, playerID);
    }

    return (
        <Container>
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
                    Toggle trade menu
                </button>
                <button
                    disabled={G.diceRoll.length === 0}
                    onClick={() => moves.endTurn()}
                >
                    End turn
                </button>
                {!!G.tradeOffer && G.tradeOffer.playerID !== viewPlayer.id && (
                    <TradeConfirmationMenu
                        tradeOffer={G.tradeOffer}
                        onAcceptTrade={onAcceptTrade}
                        onRejectTrade={onRejectTrade}
                    />
                )}
                {!G.tradeOffer || // ugh
                    (G.tradeOffer &&
                        G.tradeOffer.playerID === viewPlayer.id &&
                        isTradeWindowOpen && (
                            <TradeWindow onOfferTrade={onOfferTrade} />
                        ))}
            </Controls>
            <TurnInfo>
                <div>Current phase: {ctx.phase}</div>
                <div>currently viewing player: {viewPlayer.id}</div>

                <div>
                    Roll:{" "}
                    {G.diceRoll.length ? G.diceRoll[0] + G.diceRoll[1] : "--"}
                </div>
                <PlayerResource>wood: {viewPlayer.hand["wood"]}</PlayerResource>
                <PlayerResource>
                    brick: {viewPlayer.hand["brick"]}
                </PlayerResource>
                <PlayerResource>
                    sheep: {viewPlayer.hand["sheep"]}
                </PlayerResource>
                <PlayerResource>
                    wheat: {viewPlayer.hand["wheat"]}
                </PlayerResource>
                <PlayerResource>ore: {viewPlayer.hand["ore"]}</PlayerResource>
            </TurnInfo>
        </Container>
    );
}
