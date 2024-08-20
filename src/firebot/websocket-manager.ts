import { log } from "console";
import { logger } from "../logger";
import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";


const wsl = require('ws');
let wss: any;
let actives: Set<any> = new Set();
let em: ScriptModules["eventManager"];
let ip: string, port: number;

export function setWSSettings({
    wsIpAddress,
    wsPort,
    eventManager
}: {
    wsIpAddress: string;
    wsPort: number;
    eventManager?: ScriptModules["eventManager"];
}) {
    ip = wsIpAddress;
    port = wsPort;
    if (eventManager)
        em = eventManager;
}


export function initWebsocket() {
    if (wss) {
        logger.info('WebSocket server is already running!');
    }
    else {
        runWebsocket()
    }

}

function runWebsocket() {
    wss = new wsl.WebSocketServer({ port: port, host: ip });
    em.triggerEvent("ws", "server-on", {});

    wss.on('listening', () => {
        logger.info('WebSocket server is listening on ' + ip + ':' + port + '!');
    });
    wss.on('close', () => {
        logger.info('WebSocket server is closed!');
        wss = null;
    });
    wss.on('connection', function connection(ws: any) {
        const clientAddress = ws._socket.remoteAddress;
        const clientPort = ws._socket.remotePort;

        registerWebSocket(ws);

        logger.info(`WebSocket client connected: ${clientAddress}:${clientPort}`);

        ws.on('open', function open() {
            logger.info(`Websocket connected: ${clientAddress}:${clientPort}!`);
        });

        ws.on('error', function error() {
            logger.info(`Websocket errored: ${clientAddress}:${clientPort}!`);
        });

        ws.on('close', function close() {
            logger.info(`Websocket closed: ${clientAddress}:${clientPort}!`);
            unregisterWebSocket(ws);
        });

        ws.on('message', function message(data: any) {
            logger.info(`Data received from websocket: ${data}`);
            const translated: string = data.toString();
            em.triggerEvent("ws", "received-message", { message: translated ?? "" });
        });
    });
}

export function getWebsocketCount() {
    let count = 0;
    if (wss) {
        count = wss.clients.size;
    }
    return count;
}

export function toggleWebsocket() {
    if (wss) {
        closeWebsocket();
    } else {
        initWebsocket();
    }
}

export function closeWebsocket() {
    if (wss) {
        em.triggerEvent("ws", "server-off", {});
        wss.close();
        actives.clear();
    }
    else {
        logger.info('WebSocket server is not running!');
    }
}

function registerWebSocket(ws: any) {
    actives.add(ws);
    em.triggerEvent("ws", "connected", {});
}

function unregisterWebSocket(ws: any) {
    actives.delete(ws);
    em.triggerEvent("ws", "disconnected", {});
}
export function sendMessage({ message }: { message: string }) {
    for (let ws of actives) {
        ws.send(message);
    }
}