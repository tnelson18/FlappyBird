// Select the canvas element
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// Set the canvas size to match the height of the viewport (making it a square)
const canvasSize = window.innerHeight; 
canvas.width = canvasSize;
canvas.height = canvasSize;

// Using the Image class
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
const birdImage = new Image();
birdImage.src = "images/birb.png";

const backgroundImage = new Image();
backgroundImage.src = "images/background.png"; // Replace with your background image path

let backgroundX = 0; // Initial x-coordinate for the background
const backgroundSpeed = 1; // Adjust the speed of the background movement

const groundImage = new Image();
groundImage.src = "images/ground.png";
let groundX = 0; 



const bird = {
  x: canvas.width * (1/3),
  y: canvas.height / 2,
  width: 100,
  height: 100,
  gravity: 0.5,
  lift: -10,
  velocity: 0,
};

const pipes = []; // Array to store pipe objects
const pipeWidth = 75; // Width of the pipes
const pipeGap = 250; // Gap between top and bottom pipes
const pipeSpeed = 4; // Speed at which pipes move to the left
const pipeFrequency = 125; // Frames between spawning new pipes
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
    const pipeTopY = Math.random() * (canvas.height - pipeGap - 100) + 25; // Random position for top pipe
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

// function drawBird() {
//   ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
// }

function drawBird() {
  // Save the current canvas context state
  ctx.save();

  // Move the canvas origin to the bird's position
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);

  // Calculate the angle based on the bird's velocity (you can tweak this multiplier for desired effect)
  const angle = Math.min(Math.max(bird.velocity / 10, -.75), 1); // Limits the rotation between -1 and 1
  ctx.rotate(angle);  // Rotate the canvas based on the bird's velocity

  // Draw the bird (drawImage will now take the rotated context into account)
  ctx.drawImage(birdImage, -bird.width / 2, -bird.height / 2, bird.width, bird.height);

  // Restore the original canvas context (removes the rotation effect)
  ctx.restore();
}


function drawPipes() {
  ctx.fillStyle = "green";
  for (const pipe of pipes) {
    if (pipe.y === 0) {
      ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
      ctx.fillRect(pipe.x-5, pipe.height, pipe.width+10, 20);
    } else {
      ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
      ctx.fillRect(pipe.x-5, pipe.y, pipe.width+10, -20);
    }
  }
}

function drawScore() {
  ctx.font = "50px Arial";
  ctx.textAlign = "right";

  ctx.strokeStyle = "black";
  ctx.lineWidth = 5; 
  ctx.strokeText(`Score: ${playerScore}`, canvas.width - 25, 60); 

  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${playerScore}`, canvas.width - 25, 60); 
}

function drawBackground() {
  // Draw the first instance of the background
  ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);

  // Draw the second instance of the background right after the first one
  ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);

  // Update the background position
  backgroundX -= backgroundSpeed;

  // Reset the position when the first image is completely off-screen
  if (backgroundX <= -canvas.width) {
    backgroundX = 0;
  }
}
function drawGround() {
  const groundHeight = 85; // Set the height of the ground (adjust as needed)

  // Draw the first instance of the ground image
  ctx.drawImage(groundImage, groundX, canvas.height - groundHeight, canvas.width, groundHeight);

  // Draw the second instance of the ground image for seamless scrolling
  ctx.drawImage(groundImage, groundX + canvas.width, canvas.height - groundHeight, canvas.width, groundHeight);

  // Update the ground's horizontal position
  groundX -= pipeSpeed;

  // Reset the background position when the first image is completely off-screen
  if (groundX <= -canvas.width) {
    groundX = 0;
  }
}



function killBird() {
  if (bird.y + bird.height >= canvas.height - 85) {
    bird.y = canvas.height / 2; // Reset bird's position
    bird.velocity = 0;
    pipes.length = 0; // Clear pipes
    frameCount = 0; // Reset frame count
    playerScore = 0; // Reset score
    return; // End the function early as the bird is already "dead"
  }

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
  drawBackground();
  drawPipes();
  drawGround();
  drawBird();
  drawScore();
  killBird();
  requestAnimationFrame(gameLoop);
}


// This should hopefully start the game when the canvas is loaded
birdImage.onload = () => {
  gameLoop();
};
