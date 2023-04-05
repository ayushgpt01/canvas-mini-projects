import utils from "./utils.js";

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};
const gravity = 1;
const friction = 0.56;

const colors = ["#F2385A", "#F5A503", "#E9F1DF", "#4AD9D9", "#36B1BF"];

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.height = innerHeight;
  canvas.width = innerWidth;

  init();
});

addEventListener("click", () => {
  init();
});

class Ball {
  constructor(x, y, radius, color, xVelocity, yVelocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
  update() {
    if (this.y + this.radius + this.yVelocity > canvas.height) {
      this.yVelocity = -this.yVelocity * friction;
      this.xVelocity *= friction;
    } else {
      this.yVelocity += gravity;
    }

    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.xVelocity = -this.xVelocity * friction;
    }

    this.y += this.yVelocity;
    this.x += this.xVelocity;
    this.draw();
  }
}

const balls = [];

const init = () => {
  balls.length = 0;
  for (let i = 0; i < 400; i++) {
    const radius = utils.randomIntFromRange(10, 30);
    const ball = new Ball(
      utils.randomIntFromRange(radius, canvas.width - radius),
      utils.randomIntFromRange(radius, canvas.height - radius),
      radius,
      utils.randomColor(colors),
      utils.randomIntFromRange(-2, 2),
      utils.randomIntFromRange(1, 3)
    );
    balls.push(ball);
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls.forEach((ball) => {
    ball.update();
  });
};

init();
animate();
