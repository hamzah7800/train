const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

let clients = [];

server.on('connection', socket => {
  socket.on('message', msg => {
    const data = JSON.parse(msg);
    if (data.type === 'join') {
      const partyId = Math.floor(Math.random() * 10000);
      clients.push({ id: partyId, socket });
      socket.send(JSON.stringify({ type: 'party', partyId }));
    }
  });

  socket.on('close', () => {
    clients = clients.filter(c => c.socket !== socket);
  });
});
