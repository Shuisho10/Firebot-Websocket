import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";

export const WebsocketMessage: ReplaceVariable = {
    definition: {
        handle: "wsMessage",
        description: "The message received from the websocket.",
        possibleDataOutput: ["text"],
    },
    evaluator: (trigger) => {
        let message = "";
        
        if (trigger.type === "manual"|| trigger.type === "event")
            message = (trigger.metadata.eventData as { message: string }).message;
        else if (trigger.metadata.message)
            message = trigger.metadata.message as string;

        return message;
    }
}