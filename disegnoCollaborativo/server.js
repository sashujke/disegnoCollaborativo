const { WebSocketServer } = require('ws');

const port = Number(process.env.PORT) || 4242;
const server = new WebSocketServer({ port });

server.on("listening", () => {
    console.log("Server ws in ascolto su ws://localhost:" + port);
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error("Porta " + port + " gia in uso. Chiudi l'altro server o cambia PORT.");
        return;
    }
    console.error("Errore WebSocket server:", err.message);
});

const shapes = [];

server.on("connection", (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log("Nuova connessione da "+clientIp);

    if (shapes.length > 0) {
        ws.send(JSON.stringify(shapes));
    }

    ws.on("message", async data => {
        const newElement = JSON.parse(data);
        shapes.push(newElement);

        const state = JSON.stringify(shapes);
        server.clients.forEach(socket => socket.send(state));
    });

    ws.on("close", () => {
        console.log("Client disconnesso: " + clientIp);
    });
});