import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { closeWebsocket, initWebsocket, toggleWebsocket } from "../websocket-manager";
import { logger } from "../../logger";

type Params = {
    state: string;
};

export const WebsocketServerState: Firebot.EffectType<Params> = {
    definition:{
        id: "ws:state",
        name: "Set Websocket State",
        description: "Sets the state of the websocket server.",
        icon: "fad fa-paper-plane",
        categories: ["common","integrations","advanced","scripting"]
    },
    optionsTemplate: `
        <eos-container header="State" pad-top="true">
            <dropdown-select options="['on', 'off', 'toggle']" selected="effect.state"></dropdown-select>
        </eos-container>
    `,
    onTriggerEvent: async event => {
        switch(event.effect.state) {
            case "on":
                initWebsocket();
                break;
            case "off":
                closeWebsocket();
                break;
            case "toggle":
                toggleWebsocket();
                break;
        }
        return true;
    }
};