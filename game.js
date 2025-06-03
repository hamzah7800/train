const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let train = [{ x: 100, y: 100 }];
let direction = 'right';
let cargo = spawnCargo();
let score = 0;

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
    case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
    case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
    case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
  }
});

function gameLoop() {
  moveTrain();
  if (checkCollision()) return gameOver();

  if (train[0].x === cargo.x && train[0].y === cargo.y) {
    train.push({ ...train[train.length - 1] });
    cargo = spawnCargo();
    score++;
  }

  draw();
  setTimeout(gameLoop, 150);
}

function moveTrain() {
  const head = { ...train[0] };
  switch (direction) {
    case 'up': head.y -= 20; break;
    case 'down': head.y += 20; break;
    case 'left': head.x -= 20; break;
    case 'right': head.x += 20; break;
  }

  train.unshift(head);
  train.pop();
}

function spawnCargo() {
  return {
    x: Math.floor(Math.random() * 40) * 20,
    y: Math.floor(Math.random() * 30) * 20,
  };
}

function checkCollision() {
  const [head, ...body] = train;
  return head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
    body.some(segment => segment.x === head.x && segment.y === head.y);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'lime';
  train.forEach(segment => ctx.fillRect(segment.x, segment.y, 18, 18));

  ctx.fillStyle = 'gold';
  ctx.fillRect(cargo.x, cargo.y, 18, 18);

  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameOver() {
  ctx.fillStyle = '#f00';
  ctx.font = '40px Arial';
  ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
  ctx.font = '20px Arial';
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 30);
}

gameLoop();
