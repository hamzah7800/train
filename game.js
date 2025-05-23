class TrainGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.trainX = 100;
    this.trainY = 180;
    this.trainSpeed = 3;
    this.trainWidth = 40;
    this.trainHeight = 40;
    this.obstacles = [];
    this.score = 0;
    this.trackTop = 80;
    this.trackBottom = 280;

    this.spawnObstacle();
    this.bindKeys();
  }

  bindKeys() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.moveTrain("left");
      if (e.key === "ArrowRight") this.moveTrain("right");
    });
  }

  moveTrain(direction) {
    if (direction === "left" && this.trainX > 0) this.trainX -= 40;
    if (direction === "right" && this.trainX + this.trainWidth < this.canvas.width) this.trainX += 40;
  }

  spawnObstacle() {
    setInterval(() => {
      const y = Math.floor(Math.random() * (this.trackBottom - this.trackTop) + this.trackTop);
      this.obstacles.push({ x: this.canvas.width, y });
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
        obs.x < this.trainX + this.trainWidth &&
        obs.x + 40 > this.trainX &&
        Math.abs(obs.y - this.trainY) < this.trainHeight
      ) {
        alert("Crashed! Final score: " + this.score);
        document.location.reload();
      }
    }

    // Check if train is on track
    if (this.trainY < this.trackTop || this.trainY > this.trackBottom) {
      alert("Off the tracks! Game over.");
      document.location.reload();
    }

    this.score++;
  }

  drawTracks() {
    this.ctx.fillStyle = "#999";
    this.ctx.fillRect(0, this.trackTop - 10, this.canvas.width, this.trackBottom - this.trackTop + 20);
    this.ctx.strokeStyle = "#333";
    for (let i = this.trackTop; i <= this.trackBottom; i += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvas.width, i);
      this.ctx.stroke();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawTracks();

    // Draw train
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(this.trainX, this.trainY, this.trainWidth, this.trainHeight);

    // Draw obstacles
    this.ctx.fillStyle = "red";
    for (let obs of this.obstacles) {
      this.ctx.fillRect(obs.x, obs.y, 40, 40);
    }

    // Draw score
    this.ctx.fillStyle = "black";
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Score: " + this.score, 10, 30);
  }
}