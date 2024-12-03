//We need to select the canvas elemnt we created in index
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Using the Image class
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
const birdImage = new Image();
birdImage.src = "images/Mike.png";

const bird = {
  x: 100,
  y: canvas.height / 2,
  width: 100,
  height: 80,
  gravity: 0.5,
  lift: -10,
  velocity: 0,
};

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    bird.velocity = bird.lift;
  }
});

function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // TODO Update to kill bird when it hits the ground
  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    bird.velocity = 0;
  } else if (bird.y < 0) {
    bird.y = 0;
    bird.velocity = 0;
  }
}

function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function killBird() {

}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawBird();
  requestAnimationFrame(gameLoop);
}

// This should hopefully start the game when the canvas is loaded
birdImage.onload = () => {
  gameLoop();
};
