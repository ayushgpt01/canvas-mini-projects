// canvas setup
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("slider");
const showGameSpeed = document.getElementById("showGameSpeed");
const CANAVS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);

// Game constants
const MAX_GAME_SPEED = 20;
const MIN_GAME_SPEED = 0;
let gameSpeed = 2;

// Background layers
const backgroundLayer1 = new Image();
backgroundLayer1.src = "assets/layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "assets/layer-2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "assets/layer-3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "assets/layer-4.png";
const backgroundLayer5 = new Image();
backgroundLayer5.src = "assets/layer-5.png";

class Layer {
  constructor(image, speedModifier) {
    this.image = image;
    this.speedModifier = speedModifier;
    this.x = 0;
    this.y = 0;
    this.width = 2400;
    this.height = 700;
    this.speed = gameSpeed * this.speedModifier;
  }
  update() {
    this.speed = gameSpeed * this.speedModifier;
    if (this.x <= -this.width) {
      this.x = 0;
    }
    this.x = Math.floor(this.x - this.speed);
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

window.addEventListener("load", () => {
  // slider
  showGameSpeed.innerText = gameSpeed;
  slider.value = gameSpeed;

  // event listeners
  slider.addEventListener("change", (event) => {
    gameSpeed = event.target.value;
    showGameSpeed.innerText = gameSpeed;
  });
  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "+":
        gameSpeed++;
        if (gameSpeed > MAX_GAME_SPEED) gameSpeed = MAX_GAME_SPEED;
        slider.value = gameSpeed;
        showGameSpeed.innerText = gameSpeed;
        break;
      case "-":
        gameSpeed--;
        if (gameSpeed < MIN_GAME_SPEED) gameSpeed = MIN_GAME_SPEED;
        slider.value = gameSpeed;
        showGameSpeed.innerText = gameSpeed;
        break;
      default:
    }
  });

  // Setting up background layers
  const backgoundLayers = [];

  function init() {
    backgoundLayers.length = 0;
    backgoundLayers.push(new Layer(backgroundLayer1, 0.2));
    backgoundLayers.push(new Layer(backgroundLayer2, 0.4));
    backgoundLayers.push(new Layer(backgroundLayer3, 0.6));
    backgoundLayers.push(new Layer(backgroundLayer4, 0.8));
    backgoundLayers.push(new Layer(backgroundLayer5, 1));
  }

  // Animation function
  function animate() {
    ctx.clearRect(0, 0, CANAVS_WIDTH, CANVAS_HEIGHT);
    backgoundLayers.forEach((layer) => {
      layer.update();
      layer.draw();
    });
    requestAnimationFrame(animate);
  }

  init();
  animate();
});
