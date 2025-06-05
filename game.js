let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isHost = false;
let peer;

// Simple player state
let player = { x: 100, y: 100, color: 'blue' };
let otherPlayer = { x: 200, y: 100, color: 'red' };

// Joystick movement
let move = { x: 0, y: 0 };
document.getElementById('joystickArea').addEventListener('touchmove', e => {
  let t = e.touches[0];
  move.x = (t.clientX - 70) * 0.1;
  move.y = (t.clientY - canvas.height + 170) * 0.1;
});

function update() {
  player.x += move.x;
  player.y += move.y;

  // Send our state
  if (peer && peer.connected) {
    peer.send(JSON.stringify(player));
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer(player);
  drawPlayer(otherPlayer);
}

function drawPlayer(p) {
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
  ctx.fill();
}

// Multiplayer
function startHost() {
  isHost = true;
  peer = new SimplePeer({ initiator: true, trickle: false });

  peer.on('signal', data => {
    document.getElementById('signalData').value = JSON.stringify(data);
  });

  peer.on('data', d => {
    otherPlayer = JSON.parse(d);
  });
}

function joinGame() {
  isHost = false;
  peer = new SimplePeer({ initiator: false, trickle: false });

  peer.on('signal', data => {
    document.getElementById('signalData').value = JSON.stringify(data);
  });

  peer.on('data', d => {
    otherPlayer = JSON.parse(d);
  });
}

function connectPeers() {
  let input = document.getElementById('signalData').value;
  if (input && peer) {
    peer.signal(JSON.parse(input));
  }
}

update();
