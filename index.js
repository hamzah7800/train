document.addEventListener("DOMContentLoaded", () => {
  const game = new TrainGame();
  game.start();

  document.getElementById("upBtn").addEventListener("touchstart", () => game.moveTrain("up"));
  document.getElementById("downBtn").addEventListener("touchstart", () => game.moveTrain("down"));
});