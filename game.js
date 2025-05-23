class TrainGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.trainX = 100;
    this.trainY = 180;
    this.trainSpeed = 3;
    this.obstacles = [];
    this.score = 0;

    this.spawnObstacle();
    this.bindKeys();
  }

  bindKeys() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") this.moveTrain("up");
      if (e.key === "ArrowDown") this.moveTrain("down");
    });
  }

  moveTrain(direction) {
    if (direction === "up" && this.trainY > 0) this.trainY -= 40;
    if (direction === "down" && this.trainY < this.canvas.height - 40) this.trainY += 40;
  }

  spawnObstacle() {
    setInterval(() => {
      this.obstacles.push({ x: this.canvas.width, y: Math.floor(Math.random() * 10) * 40 });
    }, 2000);
  }

  start() {
    this.loop();
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  update() {
    for (let obs of this.obstacles) {
      obs.x -= this.trainSpeed;
    }

    this.obstacles = this.obstacles.filter(obs => obs.x > -40);

    for (let obs of this.obstacles) {
      if (
        obs.x < this.trainX + 40 &&
        obs.x + 40 > this.trainX &&
        obs.y === this.trainY
      ) {
        alert("Game Over! Your score: " + this.score);
        document.location.reload();
      }
    }

    this.score++;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(this.trainX, this.trainY, 40, 40);

    this.ctx.fillStyle = "red";
    for (let obs of this.obstacles) {
      this.ctx.fillRect(obs.x, obs.y, 40, 40);
    }

    this.ctx.fillStyle = "black";
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Score: " + this.score, 10, 30);
  }
}