"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const rooms = {};
const users = {};
wss.on("connection", (ws) => {
    ws.on("error", console.error);
    ws.on("message", (message) => {
        const data = JSON.parse(message.toString());
        const { type, roomId, userId, targetuserId, username } = data;
        switch (type) {
            case "join-room":
                if (!rooms[roomId])
                    rooms[roomId] = [];
                if (!rooms[roomId].some((user) => user.userId === userId)) {
                    rooms[roomId].push({ userId, ws });
                    users[userId] = { roomId, ws, username };
                }
                rooms[roomId].forEach((user) => {
                    if (user.userId !== userId) {
                        user.ws.send(JSON.stringify({
                            type: "join-room",
                            user: userId,
                            username: username,
                        }));
                    }
                });
                break;
            case "ping":
                if (users[targetuserId] && users[targetuserId].roomId === roomId) {
                    users[targetuserId].ws.send(JSON.stringify({ type: "ping", user: userId }));
                }
                break;
        }
    });
    ws.on("close", () => {
        for (const roomId in rooms) {
            rooms[roomId] = rooms[roomId].filter((user) => user.ws !== ws);
            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            }
        }
        for (const userId in users) {
            if (users[userId].ws === ws) {
                delete users[userId];
                break;
            }
        }
    });
});
