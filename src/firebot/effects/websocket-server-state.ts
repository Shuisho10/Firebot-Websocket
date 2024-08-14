import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { checkWebsocket, closeWebsocket, toggleWebsocket } from "../websocket-manager";

type Params = {
    state: string;
};

export const WebsocketServerState: Firebot.EffectType<Params> = {
    definition:{
        id: "ws:send-message",
        name: "Send Message to Websocket",
        description: "Send a message to all users connected to the websocket.",
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
                checkWebsocket();
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