const { WebSocketServer } = require('ws');

const port = 4242;
const server = new WebSocketServer({ port });

console.log("Server ws in ascolto su ws://localhost:"+port);

const shapes = [];

server.on("connection", (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log("Nuova connessione da "+clientIp);

    // invia la storia dei rettangoli al nuovo client
    if (shapes.length > 0) {
        ws.send(JSON.stringify(shapes));
    }

    ws.on("message", async data => {
        console.log("Ricevuto "+data+" da "+clientIp);
        try {
            const rect = JSON.parse(data);
            shapes.push(rect);
        } catch (_) {}
        server.clients.forEach(cli => {
            if (cli !== ws) cli.send(data, { binary: false });
        });
    });

    ws.on("close", () => {
        console.log("Client disconnesso: " + clientIp);
    });
});