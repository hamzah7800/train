let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let peer;
let isHost = false;

let player = { x: 100, y: 100, color: 'blue', coins: 0, turretLevel: 1, armor: 1, speed: 2 };
let otherPlayer = { x: 200, y: 100, color: 'red', coins: 0, turretLevel: 1, armor: 1, speed: 2 };
let enemies = [];
let bullets = [];
let move = { x: 0, y: 0 };

// Touch joystick
document.getElementById('joystickArea').addEventListener('touchmove', e => {
  let t = e.touches[0];
  move.x = (t.clientX - 70) * 0.1;
  move.y = (t.clientY - canvas.height + 170) * 0.1;
});

// AI targeting
function closestPlayer(enemy) {
  let dist1 = Math.hypot(enemy.x - player.x, enemy.y - player.y);
  let dist2 = Math.hypot(enemy.x - otherPlayer.x, enemy.y - otherPlayer.y);
  return dist1 < dist2 ? player : otherPlayer;
}

function update() {
  player.x += move.x * player.speed;
  player.y += move.y * player.speed;

  bullets.forEach(b => b.x += b.vx);
  bullets = bullets.filter(b => b.x < canvas.width && b.x > 0);

  enemies.forEach(enemy => {
    let target = closestPlayer(enemy);
    let dx = target.x - enemy.x;
    let dy = target.y - enemy.y;
    let len = Math.hypot(dx, dy);
    if (len > 0) {
      enemy.x += (dx / len) * 1.2;
      enemy.y += (dy / len) * 1.2;
    }
  });

  enemies = enemies.filter(e => {
    let hit = bullets.find(b => Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 20);
    if (hit) {
      player.coins += 1;
      bullets.splice(bullets.indexOf(hit), 1);
      return false;
    }
    return true;
  });

  // Shoot turrets
  if (Math.random() < 0.05 * player.turretLevel) {
    bullets.push({ x: player.x, y: player.y, vx: 5 * player.turretLevel });
  }

  if (peer && peer.connected) {
    peer.send(JSON.stringify({ player, enemies }));
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer(player);
  drawPlayer(otherPlayer);
  enemies.forEach(drawEnemy);
  bullets.forEach(b => {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(b.x, b.y, 5, 5);
  });
  drawUI();
}

function drawPlayer(p) {
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'gray';
  ctx.fillRect(p.x - 5, p.y - 30, 10, 20);
}

function drawEnemy(e) {
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.arc(e.x, e.y, 15, 0, Math.PI * 2);
  ctx.fill();
}

function drawUI() {
  ctx.fillStyle = 'white';
  ctx.font = '16px sans-serif';
  ctx.fillText('Coins: ' + player.coins, 10, canvas.height - 20);
}

function upgradeTurret() {
  if (player.coins >= 5) {
    player.turretLevel += 1;
    player.coins -= 5;
  }
}

function upgradeArmor() {
  if (player.coins >= 3) {
    player.armor += 1;
    player.coins -= 3;
  }
}

function upgradeSpeed() {
  if (player.coins >= 4) {
    player.speed += 0.5;
    player.coins -= 4;
  }
}

function spawnEnemy() {
  enemies.push({ x: canvas.width, y: Math.random() * canvas.height });
  setTimeout(spawnEnemy, 2000);
}

function startHost() {
  isHost = true;
  peer = new SimplePeer({ initiator: true, trickle: false });
  peer.on('signal', data => {
    document.getElementById('signalData').value = JSON.stringify(data);
  });
  peer.on('data', d => {
    const data = JSON.parse(d);
    otherPlayer = data.player;
    enemies = data.enemies;
  });
  spawnEnemy();
}

function joinGame() {
  isHost = false;
  peer = new SimplePeer({ initiator: false, trickle: false });
  peer.on('signal', data => {
    document.getElementById('signalData').value = JSON.stringify(data);
  });
  peer.on('data', d => {
    const data = JSON.parse(d);
    otherPlayer = data.player;
    enemies = data.enemies;
  });
}

function connectPeers() {
  let input = document.getElementById('signalData').value;
  if (input && peer) {
    peer.signal(JSON.parse(input));
  }
}

update();