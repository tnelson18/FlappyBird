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

const pipes = []; // Array to store pipe objects
const pipeWidth = 50; // Width of the pipes
const pipeGap = 225; // Gap between top and bottom pipes
const pipeSpeed = 2; // Speed at which pipes move to the left
const pipeFrequency = 90; // Frames between spawning new pipes
let frameCount = 0; // Frame counter for controlling pipe spawn rate

let playerScore = 0;

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
  }

  // Update pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= pipeSpeed; // Move pipe to the left

    if (pipes[i].scored == false && pipes[i].x + pipeWidth < bird.x) {
      playerScore++; 
      pipes[i].scored = true;
    }

    // Remove pipes that are off-screen
    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1);
    }
  }

  // Spawn new pipes at intervals
  if (frameCount % pipeFrequency === 0) {
    const pipeTopY = Math.random() * (canvas.height - pipeGap - 50) + 25; // Random position for top pipe
    const pipeBottomY = pipeTopY + pipeGap; // Bottom pipe starts after the gap

    // Add the top pipe
    pipes.push({
      x: canvas.width,
      y: 0,
      width: pipeWidth,
      height: pipeTopY,
      scored: false,
    });

    // Add the bottom pipe
    pipes.push({
      x: canvas.width,
      y: pipeBottomY,
      width: pipeWidth,
      height: canvas.height - pipeBottomY,
    });
  }

  frameCount++;
}

function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  for (const pipe of pipes) {
    if (pipe.y === 0) {
      ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    } else {
      ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    }
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Score: ${playerScore}`, canvas.width - 10, 30); // Top-right corner
}

function killBird() {
  for (const pipe of pipes) { // Check if bird hits any of the pipes on screen
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      bird.y < pipe.y + pipe.height &&
      bird.y + bird.height > pipe.y
    ) {
      bird.y = canvas.height / 2;
      bird.velocity = 0;
      pipes.length = 0;
      frameCount = 0;
      playerScore = 0
      // console.log("Bird hit pipe");
    } else if ( // Check if bird hits the pipe above
      bird.y < 0 &&
      bird.x + bird.width > pipe.x
    ) {
      bird.y = canvas.height / 2;
      bird.velocity = 0;
      pipes.length = 0;
      frameCount = 0;
      playerScore = 0
      // console.log("Hit the pipe above");
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawBird();
  drawPipes();
  drawScore();
  killBird();
  requestAnimationFrame(gameLoop);
}

// This should hopefully start the game when the canvas is loaded
birdImage.onload = () => {
  gameLoop();
};
