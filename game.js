const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const socket = new WebSocket('ws://localhost:3000');

let scene, camera, playerMesh, joystick, trainMesh;

function createScene() {
  scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3.Black();

  camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 2, -10), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);

  playerMesh = BABYLON.MeshBuilder.CreateBox("player", { size: 1 }, scene);
  playerMesh.position.y = 1;

  trainMesh = BABYLON.MeshBuilder.CreateBox("train", { width: 4, height: 2, depth: 8 }, scene);
  trainMesh.position.set(0, 1, 50);

  setupJoystick();
  setupTouchLook();

  return scene;
}

function setupJoystick() {
  joystick = new JoystickController("joystick", 64, 8);
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
  if (trainMesh.position.z < -50) {
    trainMesh.position.z = 50;
  }
}

function checkCollision() {
  return playerMesh.intersectsMesh(trainMesh, false);
}

function updatePlayer() {
  const { dx, dy } = joystick;
  let dir = new BABYLON.Vector3(dx, 0, dy);
  dir = BABYLON.Vector3.TransformCoordinates(dir, BABYLON.Matrix.RotationY(camera.rotation.y));
  dir.scaleInPlace(0.1);
  playerMesh.moveWithCollisions(dir);
}

function gameLoop() {
  updatePlayer();
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
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  }
};

// Multiplayer basic party handler
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'party') {
    console.log(`🧑 Joined party: ${data.partyId}`);
  }
};

socket.onopen = () => {
  socket.send(JSON.stringify({ type: 'join', name: prompt("Enter name:") }));
};
