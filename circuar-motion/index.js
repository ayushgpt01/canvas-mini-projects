const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

// Utility functions
const randomIntFromRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomColor = (colors) => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const distance = (x1, y1, x2, y2) => {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
};

//Constants
const colors = ["#F2385A", "#F5A503", "#E9F1DF", "#4AD9D9", "#36B1BF"];
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

//Event listeners
addEventListener("resize", () => {
  canvas.height = innerHeight;
  canvas.width = innerWidth;

  init();
});

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// Class
class Particle {
  constructor(x, y, velocity, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.angle = Math.random() * Math.PI * 2;
    this.distance = randomIntFromRange(90, 150);
    this.lastMouse = { x: x, y: y };
  }

  draw(lastPoint) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.radius;
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.closePath();
  }

  update() {
    const lastPoint = { x: this.x, y: this.y };
    this.angle += this.velocity;

    // drag effect
    this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
    this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

    this.x = this.lastMouse.x + Math.sin(this.angle) * this.distance;
    this.y = this.lastMouse.y + Math.cos(this.angle) * this.distance;

    this.draw(lastPoint);
  }
}

const particles = [];

// init and animate functions
const init = () => {
  particles.length = 0;
  for (let i = 0; i < 100; i++) {
    const radius = randomIntFromRange(3, 4);
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const xSpeed = 0.05;
    const particle = new Particle(x, y, xSpeed, radius, randomColor(colors));
    particles.push(particle);
  }
};

const animate = () => {
  ctx.fillStyle = "rgba(255,255,255, 0.05)";
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  particles.forEach((particle) => {
    particle.update();
  });
  requestAnimationFrame(animate);
};

init();
animate();
