import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { initLogger } from "./logger";
import { closeWebsocket, initWebsocket, setWSSettings } from "./firebot/websocket-manager";
import { WebsocketEvents } from "./firebot/events/websocket-events";
import { SendMessage } from "./firebot/effects/websocket-send";
import { WebsocketMessage } from "./firebot/variables/websocket-message";
import { WebsocketUserCount } from "./firebot/variables/websocket-user-count";
import { WebsocketServerState } from "./firebot/effects/websocket-server-state";

interface Params {
  wsIpAddress: string;
  wsPort: number;
  onStart: boolean;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Firebot Websocket",
      description: "A websocket for firebot.",
      author: "Shuisho",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      wsIpAddress: {
        type: "string",
        description: "Websocket's IP Address",
        default: "localhost"
      },
      wsPort: {
        type: "number",
        description: "Websocket's Port",
        default: 9005
      },
      onStart: {
        type: "boolean",
        description: "Start the websocket server on script start",
        default: true
      }
    };
  },
  run: (runRequest) => {
    const { logger, eventManager, effectManager, replaceVariableManager } = runRequest.modules;
    eventManager.registerEventSource(WebsocketEvents)
    effectManager.registerEffect(SendMessage);
    effectManager.registerEffect(WebsocketServerState);
    replaceVariableManager.registerReplaceVariable(WebsocketMessage)
    replaceVariableManager.registerReplaceVariable(WebsocketUserCount)
    initLogger(logger);
    setWSSettings({
      wsIpAddress: runRequest.parameters.wsIpAddress,
      wsPort: runRequest.parameters.wsPort,
      eventManager: eventManager
    });
    if (runRequest.parameters.onStart) {
      initWebsocket();
    }
  },
  parametersUpdated: (parameters) => {
    closeWebsocket();
    setWSSettings({
      wsIpAddress: parameters.wsIpAddress,
      wsPort: parameters.wsPort
    });
    initWebsocket();
  }
};

export default script;
