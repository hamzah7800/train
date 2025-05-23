document.addEventListener("DOMContentLoaded", () => {
  const game = new TrainGame();
  game.start();

  // Touch buttons
  document.getElementById("leftBtn").addEventListener("touchstart", () => game.moveTrain("left"));
  document.getElementById("rightBtn").addEventListener("touchstart", () => game.moveTrain("right"));
  document.getElementById("upBtn").addEventListener("touchstart", () => game.moveTrain("up"));
  document.getElementById("downBtn").addEventListener("touchstart", () => game.moveTrain("down"));

  // Swipe support
  let startX = 0, startY = 0;
  let endX = 0, endY = 0;

  window.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    // Fullscreen on first touch
    const canvas = document.getElementById("gameCanvas");
    if (canvas.requestFullscreen) canvas.requestFullscreen();
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
  }, { once: true });

  window.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    const dx = endX - startX;
    const dy = endY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 50) game.moveTrain("right");
      else if (dx < -50) game.moveTrain("left");
    } else {
      if (dy > 50) game.moveTrain("down");
      else if (dy < -50) game.moveTrain("up");
    }
  });
});

