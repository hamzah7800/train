document.addEventListener("DOMContentLoaded", () => {
  const game = new TrainGame();
  game.start();

  document.getElementById("leftBtn").addEventListener("touchstart", () => game.moveTrain("left"));
  document.getElementById("rightBtn").addEventListener("touchstart", () => game.moveTrain("right"));
  document.getElementById("upBtn").addEventListener("touchstart", () => game.moveTrain("up"));
  document.getElementById("downBtn").addEventListener("touchstart", () => game.moveTrain("down"));
});
