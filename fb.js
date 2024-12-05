// Select the canvas element
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameOver = false; // To track if the game is over


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

const pipeCapImage = new Image();
pipeCapImage.src = "images/pipeCap.png";

const pipeBodyImage = new Image();
pipeBodyImage.src = "images/pipeBody.png"; 


const bird = {
  x: canvas.width * (1/3),
  y: canvas.height / 2,
  width: 100,
  height: 68,
  gravity: 0.5,
  lift: -10,
  velocity: 0,
};

let paused = true;

const pipes = []; // Array to store pipe objects
const pipeWidth = 75; // Width of the pipes
const pipeGap = 250; // Gap between top and bottom pipes
const pipeSpeed = 4; // Speed at which pipes move to the left
const pipeFrequency = 125; // Frames between spawning new pipes
let frameCount = 0; // Frame counter for controlling pipe spawn rate

let playerScore = 0;
let highScore = 0;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (paused) {
      paused = false; // Unpause the game
    } else {
      bird.velocity = bird.lift; // Make the bird jump
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    if (paused) {
      paused = false; // Unpause the game
    } else {
      paused = true;
    }
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
      highScore = Math.max(playerScore, highScore);
      pipes[i].scored = true;
    }

    // Remove pipes that are off-screen
    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1);
    }
  }

  // Spawn new pipes at intervals
  if (frameCount % pipeFrequency === 0) {
    const pipeTopY = Math.random() * (canvas.height - pipeGap - 150) + 50; // Random position for top pipe
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


// function drawPipes() {
//   ctx.fillStyle = "green";
//   for (const pipe of pipes) {
//     if (pipe.y === 0) {
//       ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
//       ctx.fillRect(pipe.x-5, pipe.height, pipe.width+10, 20);
//     } else {
//       ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
//       ctx.fillRect(pipe.x-5, pipe.y, pipe.width+10, -20);
//     }
//   }
// }

function drawPipes() {
  pipeCapImageHeight = 30
  for (const pipe of pipes) {
    if (pipe.y === 0) {
      // Top pipe
      let remainingHeight = pipe.height - pipeCapImageHeight;
      for (let y = 0; y < remainingHeight; y += pipeBodyImage.height) {
        const sliceHeight = Math.min(pipeBodyImage.height, remainingHeight - y);
        ctx.drawImage(pipeBodyImage, 0, 0, pipeBodyImage.width, sliceHeight, pipe.x, y, pipe.width, sliceHeight);
      }
      // Draw the cap
      ctx.drawImage(pipeCapImage, pipe.x-5, pipe.height - pipeCapImageHeight, pipe.width+10, pipeCapImageHeight);
    } else {
      // Bottom pipe
      let remainingHeight = pipe.height - pipeCapImageHeight;
      for (let y = pipe.y + pipeCapImageHeight; y < pipe.y + pipe.height; y += pipeBodyImage.height) {
        const sliceHeight = Math.min(pipeBodyImage.height, remainingHeight - (y - pipe.y - pipeCapImageHeight));
        ctx.drawImage(pipeBodyImage, 0, 0, pipeBodyImage.width, sliceHeight, pipe.x, y, pipe.width, sliceHeight);
      }
      // Draw the cap
      ctx.drawImage(pipeCapImage, pipe.x-5, pipe.y, pipe.width+10, pipeCapImageHeight);
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

  if (!paused){
    // Update the background position
    backgroundX -= backgroundSpeed;

    // Reset the position when the first image is completely off-screen
    if (backgroundX <= -canvas.width) {
      backgroundX = 0;
    }
  }
}


function drawGround() {
  const groundHeight = 85; // Set the height of the ground (adjust as needed)

  // Draw the first instance of the ground image
  ctx.drawImage(groundImage, groundX, canvas.height - groundHeight, canvas.width, groundHeight);

  // Draw the second instance of the ground image for seamless scrolling
  ctx.drawImage(groundImage, groundX + canvas.width, canvas.height - groundHeight, canvas.width, groundHeight);

  if(!paused){
    groundX -= pipeSpeed;

    if (groundX <= -canvas.width) {
      groundX = 0;
    }
  }
}



let showEndScreen = false;

function killBird() {
  if (bird.y + bird.height >= canvas.height - 85) {
    endGame();
    return;
  }

  for (const pipe of pipes) {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      bird.y < pipe.y + pipe.height &&
      bird.y + bird.height > pipe.y
    ) {
      endGame();
      return;
    }

    if (bird.y < 0 && bird.x > pipe.x && !pipe.passed) {
      pipe.passed = true;
      endGame();
      return;
    }
  }
}

function endGame() {
  paused = true; // Pause the game
  showEndScreen = true; // Show the end game screen
}

function resetGame() {
  // Reset game variables
  bird.y = canvas.height / 2; // Reset bird's position
  bird.velocity = 0;
  pipes.length = 0; // Clear pipes
  frameCount = 0; // Reset frame count
  playerScore = 0; // Reset score
  showEndScreen = false; // Hide end game screen
  paused = true; // Keep the game paused
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (showEndScreen) {
      resetGame(); // Reset the game if on the end screen
    } else if (paused) {
      paused = false; // Start or resume the game
    } else {
      bird.velocity = bird.lift; // Make the bird jump
    }
  }
});

function drawEndScreen() {
  // Draw a semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Display "Game Over" text
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;

  ctx.strokeText("Game Over", canvas.width / 2, canvas.height / 3);
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 3);

  // Display the player's score
  ctx.font = "40px Arial";
  ctx.strokeText(`Score: ${playerScore}`, canvas.width / 2, canvas.height / 2 - 25);
  ctx.fillText(`Score: ${playerScore}`, canvas.width / 2, canvas.height / 2 - 25);

  // Display the player's high score
  ctx.font = "40px Arial";
  ctx.strokeText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 25);
  ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 25);

  // Display restart instructions
  ctx.font = "30px Arial";
  ctx.strokeText("Press Space to Restart", canvas.width / 2, canvas.height * (2 / 3));
  ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height * (2 / 3));
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!paused && !showEndScreen) {
    update();
    drawBackground();
    drawPipes();
    drawGround();
    drawBird();
    drawScore();
    killBird();
  } else if (showEndScreen) {
    drawBackground();
    drawPipes();
    drawGround();
    drawBird();
    drawEndScreen(); // Draw the end screen when the game is over
  } else {
    drawBackground();
    drawPipes();
    drawGround();
    drawBird();
    drawScore();

    // Draw the paused screen overlay
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = "black";

    ctx.lineWidth = 5;
    ctx.strokeText("Press Space to Start", canvas.width / 2, canvas.height * (1 / 3));

    ctx.fillStyle = "white";
    ctx.fillText("Press Space to Start", canvas.width / 2, canvas.height * (1 / 3));
  }
  requestAnimationFrame(gameLoop);
}

// This should hopefully start the game when the canvas is loaded
birdImage.onload = () => {
  gameLoop();
};
