import { log } from "console";
import { logger } from "../logger";
import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";


const wsl = require('ws');
let wss: any;
let actives: Set<any> = new Set();
let em: ScriptModules["eventManager"];
let ip,port;

export function initWebsocket({
    wsIpAddress,
    wsPort,
    eventManager
}: {
    wsIpAddress?: string;
    wsPort?: number;
    eventManager?: ScriptModules["eventManager"];
}) {
    wss = new wsl.WebSocketServer({ port: wsPort, host: wsIpAddress });
    if (eventManager) {
        em = eventManager;
    }
    if (wsIpAddress){
        ip = wsIpAddress;
    }
    if (wsPort){
        port = wsPort;
    }

    em.triggerEvent("ws", "server-on", {});

    wss.on('listening', () => {
        logger.info('WebSocket server is listening on ' + wsIpAddress + ':' + wsPort + '!');
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
            em.triggerEvent("ws", "received-message", {message: translated??""});
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
            initWebsocket({});
        }
}

export function checkWebsocket() {
    if (!wss && em) {
        initWebsocket({});
    }
}

export function closeWebsocket() {
    if(wss) {
        em.triggerEvent("ws", "server-off", {});
        wss.close();
        actives.clear();
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
export function sendMessage({message}: {message: string}) {
    for (let ws of actives) {
        ws.send(message);
    }
}