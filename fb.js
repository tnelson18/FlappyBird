// Select the canvas element
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
const birdImage = new Image();
birdImage.src = "bird.png"; // Replace with your single bird image URL

const bird = {
  x: 100,
  y: canvas.height / 2,
  width: 34, // Width of the bird image
  height: 24, // Height of the bird image
  gravity: 0.6,
  lift: -10,
  velocity: 0,
};

// Key events for jumping
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    bird.velocity = bird.lift; // Make the bird jump
  }
});

// Update game logic
function update() {
  bird.velocity += bird.gravity; // Apply gravity
  bird.y += bird.velocity; // Update bird position

  // Prevent the bird from going off-screen
  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    bird.velocity = 0;
  } else if (bird.y < 0) {
    bird.y = 0;
    bird.velocity = 0;
  }
}

// Draw the bird
function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  update(); // Update game logic
  drawBird(); // Draw the bird
  requestAnimationFrame(gameLoop); // Loop the game
}

// Start the game when the bird image is loaded
birdImage.onload = () => {
  gameLoop();
};
