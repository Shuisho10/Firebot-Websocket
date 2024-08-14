import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { sendMessage } from "../websocket-manager";

type Params = {
    message: string;
};

export const SendMessage: Firebot.EffectType<Params> = {
    definition:{
        id: "ws:send-message",
        name: "Send Message to Websocket",
        description: "Send a message to all users connected to the websocket.",
        icon: "fad fa-paper-plane",
        categories: ["common","integrations","advanced","scripting"]
    },
    optionsTemplate: `
        <eos-container header="message" pad-top="true">
            <div class="form-group">
                <label>Message</label>
                <input type="text" class="form-control" ng-model="effect.message">
        </eos-container>
    `,
    onTriggerEvent: async event => {
        await sendMessage({message: event.effect.message});
        return true;
    }
};