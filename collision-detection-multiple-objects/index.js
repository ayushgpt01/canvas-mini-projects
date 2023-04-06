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

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 */

function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 */

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

//Constants
const colors = ["#F2385A", "#F5A503", "#4AD9D9", "#36B1BF"];
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
class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5,
    };
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;
  }

  draw = () => {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
  };

  update = (particles) => {
    this.draw();
    for (let i = 0; i < particles.length; i++) {
      if (this === particles[i]) continue;
      if (
        getDistance(this.x, this.y, particles[i].x, particles[i].y) <
        2 * this.radius
      ) {
        resolveCollision(this, particles[i]);
      }
    }

    if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
      this.velocity.y = -this.velocity.y;
    }

    if (
      getDistance(this.x, this.y, mouse.x, mouse.y) < 120 &&
      this.opacity < 0.4
    ) {
      this.opacity += 0.02;
    } else if (this.opacity > 0) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };
}

const particles = [];

// init and animate functions
const init = () => {
  particles.length = 0;
  const radius = 15;
  for (let i = 0; i < 200; i++) {
    let x = randomIntFromRange(radius, innerWidth - radius);
    let y = randomIntFromRange(radius, innerHeight - radius);
    const color = randomColor(colors);

    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (getDistance(x, y, particles[j].x, particles[j].y) < 2 * radius) {
          x = randomIntFromRange(radius, innerWidth - radius);
          y = randomIntFromRange(radius, innerHeight - radius);
          j = -1;
        }
      }
    }

    particles.push(new Particle(x, y, radius, color));
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  particles.forEach((particle) => {
    particle.update(particles);
  });
};

init();
animate();
