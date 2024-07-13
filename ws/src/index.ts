import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const rooms: { [key: string]: { userId: string, ws: WebSocket }[] } = {};
const users: { [key: string]: { roomId: string, ws: WebSocket } } = {};

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    const { type, roomId, userId, targetuserId } = data;

    switch (type) {
      case "join-room":
        if (!rooms[roomId]) rooms[roomId] = [];
        if (!rooms[roomId].some(user => user.userId === userId)) {
          rooms[roomId].push({ userId, ws });
          users[userId] = { roomId, ws };
        }
        break;
      case "ping":
        if (users[targetuserId] && users[targetuserId].roomId === roomId) {
          users[targetuserId].ws.send(JSON.stringify({ type: "ping", from: userId }));
        }
        break;
    }
  });

  ws.on("close", () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(user => user.ws !== ws);
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

