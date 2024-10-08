import { useState } from "react";
import { RESOURCES } from "../../constants";
import {
    Container,
    Label,
    LabelContainer,
    OfferContainer,
    Receive,
    ResourceContainer,
} from "./styles";
import { TradeResource } from "./TradeResource/TradeResource";
import { Resource } from "../../lib/types";

export function TradeWindow() {
    // positive numbers buy, negative numbers sell
    const [offer, setOffer] = useState({
        wood: 0,
        wheat: 0,
        sheep: 0,
        brick: 0,
        ore: 0,
    });

    const changeOffer = (resource: Resource, amount: number) => {
        setOffer({ ...offer, [resource]: offer[resource] + amount });
    };

    const renderTradeResources = () => {
        return RESOURCES.map((resource) => {
            return (
                <TradeResource
                    key={resource}
                    resource={resource}
                    offer={offer[resource]}
                    changeOffer={changeOffer}
                />
            );
        });
    };

    return (
        <Container>
            <OfferContainer>
                <LabelContainer>
                    <Label>You offer:</Label>
                    <Label>
                        <Receive>You receive:</Receive>
                    </Label>
                </LabelContainer>
                <ResourceContainer>{renderTradeResources()}</ResourceContainer>
            </OfferContainer>
            <button>Offer trade</button>
        </Container>
    );
}
