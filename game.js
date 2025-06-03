const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
let scene, camera, playerMesh, trainMesh;

function createScene() {
  scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3.Black();

  // Light
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.9;

  // Camera
  camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 3, -10), scene);
  camera.setTarget(new BABYLON.Vector3(0, 1, 0));
  camera.attachControl(canvas, true);

  // Ground
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);

  // Player
  playerMesh = BABYLON.MeshBuilder.CreateBox("player", { size: 1 }, scene);
  playerMesh.position.y = 1;

  // Train
  trainMesh = BABYLON.MeshBuilder.CreateBox("train", { width: 4, height: 2, depth: 8 }, scene);
  trainMesh.position.set(0, 1, 50);

  // Joystick
  setupJoystick();
  setupTouchLook();

  return scene;
}

function setupJoystick() {
  new JoyStick("joystickZone", {}, (stickData) => {
    const speed = 0.1;
    let forward = stickData.y / 100;
    let strafe = stickData.x / 100;
    let dir = new BABYLON.Vector3(strafe, 0, forward);
    dir = BABYLON.Vector3.TransformCoordinates(dir, BABYLON.Matrix.RotationY(camera.rotation.y));
    playerMesh.moveWithCollisions(dir.scale(speed));
  });
}

function setupTouchLook() {
  let lastX;
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      let deltaX = e.touches[0].clientX - (lastX ?? e.touches[0].clientX);
      camera.rotation.y -= deltaX * 0.005;
      lastX = e.touches[0].clientX;
    }
  });
  canvas.addEventListener('touchend', () => { lastX = null; });
}

function moveTrain() {
  trainMesh.position.z -= 0.3;
  if (trainMesh.position.z < -50) trainMesh.position.z = 50;
}

function checkCollision() {
  return playerMesh.intersectsMesh(trainMesh, false);
}

function gameLoop() {
  moveTrain();
  if (checkCollision()) {
    alert("💥 You were hit by a train!");
    location.reload();
  }
}

scene = createScene();
engine.runRenderLoop(() => {
  scene.render();
  gameLoop();
});

window.addEventListener('resize', () => engine.resize());

document.getElementById("fullscreenBtn").onclick = () => {
  if (!document.fullscreenElement) canvas.requestFullscreen();
};
