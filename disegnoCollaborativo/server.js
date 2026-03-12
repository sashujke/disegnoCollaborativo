const { WebSocketServer } = require('ws');

const port = 4242;
const server = new WebSocketServer({ port });

console.log("Server ws in ascolto su ws://localhost:"+port);

server.on("connection", (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log("Nuova connessione da "+clientIp);
    ws.send("Benvenuto");

    ws.on("message", async data => {
        console.log("Ricevuto "+data+"da"+clientIp);
        server.clients.forEach(cli => {
            if (cli !== ws) cli.send(data, { binary: false });
        });
    });

    ws.on("close", data => {
        ws.send("Client disconnesso: " + clientIp);
    });
});