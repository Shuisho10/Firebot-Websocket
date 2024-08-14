import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { get } from "http";
import { getWebsocketCount } from "../websocket-manager";

export const WebsocketUserCount: ReplaceVariable = {
    definition: {
        handle: "wsUserCount",
        description: "The ammount of websockets connected.",
        possibleDataOutput: ["number"],
    },
    evaluator: () => {
        return getWebsocketCount();
    }
}