const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerId = `player_${Math.floor(Math.random() * 10000)}`;
const db = window.firebaseDB;
const ref = window.firebaseRef;
const set = window.firebaseSet;
const onValue = window.firebaseOnValue;

let players = {};

const train = {
  x: Math.random() * 600 + 100,
  y: Math.random() * 400 + 100,
  vx: 0,
  vy: 0,
  speed: 2
};

function syncPosition() {
  set(ref(db, `players/${playerId}`), {
    x: train.x,
    y: train.y
  });
}

onValue(ref(db, "players"), (snapshot) => {
  players = snapshot.val() || {};
});

function drawTrain(x, y, isSelf = false) {
  ctx.fillStyle = isSelf ? "red" : "blue";
  ctx.fillRect(x - 20, y - 10, 40, 20);
}

function update() {
  train.x += train.vx * train.speed;
  train.y += train.vy * train.speed;
  syncPosition();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const id in players) {
    const p = players[id];
    drawTrain(p.x, p.y, id === playerId);
  }
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

new VirtualJoystick(document.getElementById("joystickContainer"), (dir) => {
  train.vx = dir.x;
  train.vy = dir.y;
});

gameLoop();
