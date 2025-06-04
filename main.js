
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Simple player controlled by joystick
let player = { x: 100, y: 100, size: 20, color: "white", speed: 2 };
let input = { x: 0, y: 0 };

// Joystick setup
const joystick = new JoystickController({
    zone: document.getElementById("joystickZone"),
    size: 100,
    onMove: (data) => {
        input.x = data.x;
        input.y = data.y;
    }
});

// Fullscreen toggle
document.getElementById("fullscreenBtn").onclick = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move player
    player.x += input.x * player.speed;
    player.y += input.y * player.speed;

    // Draw player
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(gameLoop);
}
gameLoop();
