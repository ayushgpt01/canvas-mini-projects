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

const getDistance = (x1, y1, x2, y2) => {
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
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.height = innerHeight;
  canvas.width = innerWidth;

  init();
});

// Class
class Circle {
  constructor(x, y, xSpeed, ySpeed, radius, color) {
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
  }
}

// const circles = [];
let circle1;
let circle2;

// init and animate functions
const init = () => {
  circle1 = new Circle(
    canvas.width / 2,
    canvas.height / 2,
    0,
    0,
    200,
    "orange"
  );
  circle2 = new Circle(400, 300, 0, 0, 50, "#00bbff");
};

const animate = () => {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  circle1.update();
  circle2.x = mouse.x;
  circle2.y = mouse.y;
  circle2.update();
  if (
    getDistance(circle1.x, circle1.y, circle2.x, circle2.y) <=
    circle1.radius + circle2.radius
  ) {
    circle1.color = "green";
  } else {
    circle1.color = "orange";
  }
};

init();
animate();
