import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";

export const WebsocketEvents: EventSource = {
    id: "ws",
    name: "Websocket",
    events: [
        {
            id: "received-message",
            name: "Message Received",
            description: "Fires when a message is received from the websocket.",
            cached: false,
            manualMetadata: {
                message: "websocket message test"
            }
        },
        {
            id: "client-connected",
            name: "Client Connected",
            description: "Fires when a message is received from the websocket.",
            cached: false,
            manualMetadata: {
            }
        },
        {
            id: "client-disconnected",
            name: "Client Disconnected",
            description: "Fires when a message is received from the websocket.",
            cached: false,
            manualMetadata: {
            }
        },
        {
            id: "server-on",
            name: "Server on-line",
            description: "Fires when a message is received from the websocket.",
            cached: false,
            manualMetadata: {
            }
        },
        {
            id: "server-off",
            name: "Server off-line",
            description: "Fires when a message is received from the websocket.",
            cached: false,
            manualMetadata: {
            }
        },
    ]
};