let paused = false;

let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

let player = {
  x: 100,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  speed: 2,
  coins: 0,
  armor: 5,
  turretLevel: 1,
  speedLevel: 1,
  health: 5,
  weapon: 'basic'
};

let enemies = [];
let bullets = [];
let level = 1;
let enemiesToSpawn = 5;
let bossSpawned = false;

let passengers = [
  { id: 1, x: 120, y: 100, alive: true },
  { id: 2, x: 160, y: 100, alive: true }
];

let sounds = {
  shoot: new Audio('shoot.wav'),
  hit: new Audio('hit.wav'),
  gameover: new Audio('gameover.wav')
};

function upgradeTurret() {
  if (player.coins >= 5) {
    player.turretLevel++;
    player.coins -= 5;
  }
}
function upgradeArmor() {
  if (player.coins >= 3) {
    player.armor += 2;
    player.coins -= 3;
  }
}
function upgradeSpeed() {
  if (player.coins >= 4) {
    player.speed += 0.5;
    player.coins -= 4;
  }
}
function changeWeapon() {
  if (player.coins >= 6) {
    player.weapon = player.weapon === 'basic' ? 'rapid' : 'basic';
    player.coins -= 6;
  }
}

function saveGame() {
  const state = { player, level };
  localStorage.setItem('trainSave', JSON.stringify(state));
}
function loadGame() {
  const data = localStorage.getItem('trainSave');
  if (data) {
    const state = JSON.parse(data);
    Object.assign(player, state.player);
    level = state.level || 1;
  }
}

function spawnEnemy() {
  const types = ['basic', 'fast', 'tank'];
  const type = types[Math.floor(Math.random() * types.length)];
  let speed = 1.2, hp = 1;
  if (type === 'fast') speed = 2.5;
  if (type === 'tank') hp = 3;
  enemies.push({ x: canvas.width, y: Math.random() * canvas.height, type, speed, hp });
  enemiesToSpawn--;
  if (enemiesToSpawn > 0) {
    setTimeout(spawnEnemy, 2000);
  } else if (!bossSpawned) {
    enemies.push({ x: canvas.width, y: Math.random() * canvas.height, type: 'boss', speed: 0.8, hp: 10 });
    bossSpawned = true;
  }
}

function drawUI() {
  ctx.fillStyle = 'white';
  ctx.font = '16px sans-serif';
  ctx.fillText('Level: ' + level, 10, canvas.height - 60);
  ctx.fillText('Coins: ' + player.coins, 10, canvas.height - 40);
  ctx.fillText('Health: ' + player.armor, 10, canvas.height - 20);
}

function drawEnemy(enemy) {
  passengers.forEach(p => {
    if (p.alive && Math.abs(enemy.x - p.x) < 15 && Math.abs(enemy.y - p.y) < 15) {
      p.alive = false;
    }
  });
  ctx.fillStyle = enemy.type === 'tank' ? 'gray' : enemy.type === 'fast' ? 'orange' : enemy.type === 'boss' ? 'purple' : 'red';
  ctx.fillRect(enemy.x, enemy.y, 20, 20);
  let target = player;
  let dx = target.x - enemy.x;
  let dy = target.y - enemy.y;
  let len = Math.hypot(dx, dy);
  let spd = enemy.speed || 1.2;
  enemy.x += (dx / len) * spd;
  enemy.y += (dy / len) * spd;

  if (Math.hypot(enemy.x - player.x, enemy.y - player.y) < 25) {
    player.health -= 0.05;
  }
}

function drawBullet(b) {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(b.x, b.y, 4, 2);
  b.x += b.vx;
}

function update() {
  if (paused) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '32px sans-serif';
    ctx.fillText('Paused - Press ESC to resume', canvas.width / 2 - 150, canvas.height / 2);
    requestAnimationFrame(update);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.x += player.vx;
  player.y += player.vy;

  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, 30, 20);

  passengers.forEach(p => {
    if (p.alive) {
      ctx.fillStyle = 'pink';
      ctx.fillRect(p.x, p.y, 10, 10);
    }
  });

  bullets.forEach(drawBullet);

  enemies.forEach(e => {
    drawEnemy(e);
    let hit = bullets.find(b => Math.hypot(b.x - e.x, b.y - e.y) < 10);
    if (hit) {
      e.hp -= 1;
      if (e.hp <= 0) {
        if (e.type === 'boss') {
          level++;
          enemiesToSpawn = 5 + level * 2;
          bossSpawned = false;
          setTimeout(spawnEnemy, 1000);
        }
        player.coins += 1;
        enemies.splice(enemies.indexOf(e), 1);
      }
      bullets.splice(bullets.indexOf(hit), 1);
    }
  });

  if (player.weapon === 'rapid' && Math.random() < 0.2) {
    bullets.push({ x: player.x, y: player.y, vx: 7 });
    sounds.shoot.play();
  } else if (player.weapon === 'basic' && Math.random() < 0.05 * player.turretLevel) {
    bullets.push({ x: player.x, y: player.y, vx: 5 * player.turretLevel });
    sounds.shoot.play();
  }

  drawUI();

  if (player.health <= 0 || passengers.every(p => !p.alive)) {
    sounds.gameover.play();
    ctx.fillStyle = 'red';
    ctx.font = '48px sans-serif';
    ctx.fillText('GAME OVER - ESC to reset', canvas.width / 2 - 200, canvas.height / 2);
    return;
  }

  requestAnimationFrame(update);
}

canvas.addEventListener('touchstart', e => {
  let touch = e.touches[0];
  player.vx = touch.clientX < canvas.width / 2 ? -player.speed : player.speed;
  player.vy = touch.clientY < canvas.height / 2 ? -player.speed : player.speed;
});

canvas.addEventListener('touchend', () => {
  player.vx = 0;
  player.vy = 0;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    paused = !paused;
  }
});

window.addEventListener('beforeunload', saveGame);
loadGame();
spawnEnemy();
update();
