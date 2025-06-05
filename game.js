<!DOCTYPE html>
<html>
<head>
  <title>Train Defense Game</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      touch-action: none;
    }
    canvas {
      display: block;
      background: #228B22; /* green background */
    }
  </style>
</head>
<body>
  <canvas id="game"></canvas>
  <script>
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let paused = false;

    const player = {
      x: 100,
      y: canvas.height / 2,
      vx: 0,
      vy: 0,
      speed: 2,
      coins: 0,
      armor: 5,
      turretLevel: 1,
      health: 5,
    };

    let bullets = [];
    let enemies = [];
    let bulletCount = 64;
    let canShoot = true;
    let level = 1;
    let enemiesToSpawn = 5;
    let bossSpawned = false;

    const joystick = {
      baseX: 80,
      baseY: canvas.height - 80,
      radius: 40,
      stickX: 80,
      stickY: canvas.height - 80,
      active: false,
    };

    function shoot() {
      if (canShoot && bulletCount > 0) {
        bullets.push({ x: player.x + 20, y: player.y + 10, vx: 6 });
        bulletCount--;
        canShoot = false;
        setTimeout(() => canShoot = true, 1000);
      }
    }

    function reload() {
      bulletCount = 64;
    }

    function spawnEnemy() {
      enemies.push({
        x: canvas.width,
        y: Math.random() * canvas.height,
        hp: 2,
        speed: 1 + Math.random(),
      });
      enemiesToSpawn--;
      if (enemiesToSpawn > 0) {
        setTimeout(spawnEnemy, 2000);
      } else if (!bossSpawned) {
        enemies.push({
          x: canvas.width,
          y: Math.random() * canvas.height,
          hp: 10,
          speed: 0.6,
          boss: true
        });
        bossSpawned = true;
      }
    }

    function update() {
      if (paused) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "32px sans-serif";
        ctx.fillText("Paused - Press ESC", canvas.width / 2 - 120, canvas.height / 2);
        requestAnimationFrame(update);
        return;
      }

      ctx.fillStyle = "#228B22"; // green background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      player.x += player.vx;
      player.y += player.vy;

      // Draw player
      ctx.fillStyle = "blue";
      ctx.fillRect(player.x, player.y, 30, 20);

      // Draw bullets
      ctx.fillStyle = "yellow";
      bullets.forEach((b, i) => {
        b.x += b.vx;
        ctx.fillRect(b.x, b.y, 5, 2);
        if (b.x > canvas.width) bullets.splice(i, 1);
      });

      // Draw enemies
      enemies.forEach((e, i) => {
        e.x -= e.speed;
        ctx.fillStyle = e.boss ? "purple" : "red";
        ctx.fillRect(e.x, e.y, 20, 20);

        bullets.forEach((b, j) => {
          if (Math.hypot(b.x - e.x, b.y - e.y) < 15) {
            e.hp--;
            bullets.splice(j, 1);
          }
        });

        if (e.hp <= 0) {
          player.coins += e.boss ? 5 : 1;
          enemies.splice(i, 1);
          if (e.boss) {
            level++;
            enemiesToSpawn = 5 + level * 2;
            bossSpawned = false;
            setTimeout(spawnEnemy, 1000);
          }
        }
      });

      // Draw UI
      ctx.fillStyle = "white";
      ctx.font = "16px sans-serif";
      ctx.fillText("Ammo: " + bulletCount, canvas.width - 120, canvas.height - 80);
      ctx.fillText("Coins: " + player.coins, 10, 20);
      ctx.fillText("Health: " + player.armor, 10, 40);
      ctx.fillText("Level: " + level, 10, 60);

      // Shoot button
      ctx.fillStyle = "red";
      ctx.fillRect(canvas.width - 120, canvas.height - 60, 100, 30);
      ctx.fillStyle = "white";
      ctx.fillText("Shoot", canvas.width - 90, canvas.height - 40);

      // Reload button
      ctx.fillStyle = "blue";
      ctx.fillRect(canvas.width - 120, canvas.height - 25, 100, 25);
      ctx.fillStyle = "white";
      ctx.fillText("Reload", canvas.width - 95, canvas.height - 10);

      // Draw joystick
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath();
      ctx.arc(joystick.baseX, joystick.baseY, joystick.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.arc(joystick.stickX, joystick.stickY, 20, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(update);
    }

    canvas.addEventListener("touchstart", (e) => {
      for (let t of e.touches) {
        let dx = t.clientX - joystick.baseX;
        let dy = t.clientY - joystick.baseY;
        let dist = Math.hypot(dx, dy);
        if (dist < joystick.radius + 30) {
          joystick.active = true;
          joystick.stickX = t.clientX;
          joystick.stickY = t.clientY;
        }

        // Shoot
        if (t.clientX > canvas.width - 120 && t.clientY > canvas.height - 60 && t.clientY < canvas.height - 30)
          shoot();
        // Reload
        if (t.clientX > canvas.width - 120 && t.clientY > canvas.height - 30)
          reload();
      }
    });

    canvas.addEventListener("touchmove", (e) => {
      if (!joystick.active) return;
      let touch = e.touches[0];
      joystick.stickX = touch.clientX;
      joystick.stickY = touch.clientY;

      let dx = joystick.stickX - joystick.baseX;
      let dy = joystick.stickY - joystick.baseY;
      let dist = Math.min(Math.hypot(dx, dy), joystick.radius);
      let angle = Math.atan2(dy, dx);

      player.vx = Math.cos(angle) * (dist / joystick.radius) * player.speed;
      player.vy = Math.sin(angle) * (dist / joystick.radius) * player.speed;
    });

    canvas.addEventListener("touchend", () => {
      joystick.active = false;
      joystick.stickX = joystick.baseX;
      joystick.stickY = joystick.baseY;
      player.vx = 0;
      player.vy = 0;
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") paused = !paused;
    });

    spawnEnemy();
    update();
  </script>
</body>
</html>
