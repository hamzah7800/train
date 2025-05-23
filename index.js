document.addEventListener("DOMContentLoaded", () => {
  const game = new TrainGame();
  game.start();

  document.getElementById("leftBtn").addEventListener("touchstart", () => game.moveTrain("left"));
  document.getElementById("rightBtn").addEventListener("touchstart", () => game.moveTrain("right"));
});