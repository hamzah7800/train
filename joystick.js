class VirtualJoystick {
  constructor(container, onMove) {
    this.container = container;
    this.onMove = onMove;

    this.joystick = document.createElement("div");
    this.stick = document.createElement("div");

    this.joystick.style.cssText = `
      width: 100px; height: 100px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      position: relative;
      touch-action: none;
    `;

    this.stick.style.cssText = `
      width: 50px; height: 50px;
      background: #fff;
      border-radius: 50%;
      position: absolute;
      top: 25px; left: 25px;
    `;

    this.joystick.appendChild(this.stick);
    this.container.appendChild(this.joystick);

    this.active = false;
    this.center = { x: 0, y: 0 };

    this.stick.addEventListener("touchstart", e => this.start(e));
    this.stick.addEventListener("touchmove", e => this.move(e));
    this.stick.addEventListener("touchend", () => this.end());

    this.stick.addEventListener("mousedown", e => this.start(e));
    window.addEventListener("mousemove", e => this.active && this.move(e));
    window.addEventListener("mouseup", () => this.end());
  }

  start(e) {
    this.active = true;
    const rect = this.joystick.getBoundingClientRect();
    this.center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    e.preventDefault();
  }

  move(e) {
    let x, y;
    if (e.touches) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    let dx = x - this.center.x;
    let dy = y - this.center.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let maxDist = 40;
    if (distance > maxDist) {
      dx = (dx / distance) * maxDist;
      dy = (dy / distance) * maxDist;
    }

    this.stick.style.left = `${25 + dx}px`;
    this.stick.style.top = `${25 + dy}px`;

    const normalized = { x: dx / maxDist, y: dy / maxDist };
    this.onMove(normalized);
  }

  end() {
    this.active = false;
    this.stick.style.left = "25px";
    this.stick.style.top = "25px";
    this.onMove({ x: 0, y: 0 });
  }
}
