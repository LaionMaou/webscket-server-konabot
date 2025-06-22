const http = require("http");
const WebSocket = require("ws");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  console.log("🔌 Cliente conectado");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      // Reenvía a todos menos al emisor
      for (let client of clients) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      }
    } catch (err) {
      console.error("Mensaje inválido:", err);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("❌ Cliente desconectado");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server activo en puerto ${PORT}`);
});
