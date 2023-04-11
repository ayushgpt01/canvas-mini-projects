const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let amplitude = 90;
let wavelength = 0.01;
let frequency = 0.02;

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.03)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  frequency += 0.01;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  for (let i = 0; i < canvas.width; i++) {
    ctx.lineTo(
      i,
      canvas.height / 2 +
        Math.sin(i * wavelength - frequency) * amplitude * Math.sin(frequency)
    );
  }
  ctx.strokeStyle = `hsl(${Math.abs(40 * Math.sin(frequency))}, 84%, 55%)`;
  ctx.stroke();
  ctx.closePath();
  requestAnimationFrame(animate);
}

animate();
