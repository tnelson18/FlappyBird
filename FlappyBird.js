const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let showEndScreen = false;
let gameOver = false; 
let paused = true;

let playerScore = 0;
let highScore = 0;

// Set the canvas size to match viewport
const canvasSize = window.innerHeight; 
canvas.width = canvasSize;
canvas.height = canvasSize;

// Using the Image class
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
const birdImage = new Image();
birdImage.src = "images/bird.png";

// Terrain image def
const backgroundImage = new Image();
backgroundImage.src = "images/background.png";
let backgroundX = 0; // Starting x val for wrapping background
const backgroundSpeed = 1;

const groundImage = new Image();
groundImage.src = "images/ground.png";
let groundX = 0; 
const groundHeight = 85;

// Pipe image def
const pipeCapImage = new Image();
pipeCapImage.src = "images/pipeCap.png";

const pipeBodyImage = new Image();
pipeBodyImage.src = "images/pipeBody.png"; 


// Player class
const bird = {
  x: canvas.width * (1/3),
  y: canvas.height / 2,
  width: 100,
  height: 68,
  gravity: 0.5,
  lift: -10,
  velocity: 0,
};

// Pipe vars
const pipes = []; // Pipes list
const pipeWidth = 75;
const pipeGap = 250;
const pipeSpeed = 4;
const minHeight = 150;
const maxHeight = 50;

// Count frames between since last spawn of new pipe
let frameCount = 0;
const pipeFrequency = 125; // Frames between pipes


// Listener for jumping
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (showEndScreen) {
      resetGame(); // Reset the game if on the end screen
    } else if (paused) {
      paused = false;
    } 
    // Removed else statment to avoid the need to spam space when game begins
    bird.velocity = bird.lift; // Applies upward velocity
  }
});


// Listener for pausing game
document.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    if (paused) {
      paused = false;
    } else {
      paused = true;
    }
  }
});

// Main Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!paused && !showEndScreen) {
    update();
    drawObjects();
    drawScore();
    killBird();
  } else if (showEndScreen) {
    drawObjects();
    drawEndScreen();
  } else {
    drawObjects();
    drawScore();
    drawPauseScreen();
  }
  requestAnimationFrame(gameLoop);
}

// Called every frame, handles moving bird, moving pipes and spawning pipes
function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Moves existing pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= pipeSpeed;

    // Gives player score if pipe has not been scored and is past bird
    if (pipes[i].scored == false && pipes[i].x + pipeWidth < bird.x) {
      playerScore++; 
      highScore = Math.max(playerScore, highScore);
      pipes[i].scored = true;
    }

    // Remove pipes that move off the screen
    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1);
    }
  }

  // Spawn new pipes
  if (frameCount % pipeFrequency === 0) {
    // Pick lengths of pipes
    const pipeTopY = Math.random() * (canvas.height - pipeGap - minHeight) + maxHeight;
    const pipeBottomY = pipeTopY + pipeGap;

    // Top pipe
    pipes.push({
      x: canvas.width,
      y: 0,
      width: pipeWidth,
      height: pipeTopY,
      scored: false, // Tracks if player has passed this pipe
    });

    // Bottom pipe
    pipes.push({
      x: canvas.width,
      y: pipeBottomY,
      width: pipeWidth,
      height: canvas.height - pipeBottomY,
    });
  }

  frameCount++;
}

function drawObjects() {
  drawBackground();
  drawPipes();
  drawGround();
  drawBird();
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);

  // Calculate angle based on bird's velocity
  const downRotate = -.75;
  const upRotate = 1
  const angle = Math.min(Math.max(bird.velocity / 10, downRotate), upRotate);
  ctx.rotate(angle);

  ctx.drawImage(birdImage, -bird.width / 2, -bird.height / 2, bird.width, bird.height);

  // Removes rotation effect for future draws
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

// Pipe body is drawn until height is reached, then cap is drawn on top
function drawPipes() {
  pipeCapImageHeight = 30;
  // Loop through all pipes within list
  for (const pipe of pipes) {
    if (pipe.y === 0) { // Top pipe
      let remainingHeight = pipe.height - pipeCapImageHeight;
      // Loop through height until height for pipe is less than pipe body's height
      for (let y = 0; y < remainingHeight; y += pipeBodyImage.height) {
        const sliceHeight = Math.min(pipeBodyImage.height, remainingHeight - y);
        ctx.drawImage(pipeBodyImage, 0, 0, pipeBodyImage.width, sliceHeight, pipe.x, y, pipe.width, sliceHeight);
      }
      // Draw the cap over tiled pipe body
      ctx.drawImage(pipeCapImage, pipe.x-5, pipe.height - pipeCapImageHeight, pipe.width+10, pipeCapImageHeight);
    } 
    else { // Bottom pipe
      let remainingHeight = pipe.height - pipeCapImageHeight;
      for (let y = pipe.y + pipeCapImageHeight; y < pipe.y + pipe.height; y += pipeBodyImage.height) {
        const sliceHeight = Math.min(pipeBodyImage.height, remainingHeight - (y - pipe.y - pipeCapImageHeight));
        ctx.drawImage(pipeBodyImage, 0, 0, pipeBodyImage.width, sliceHeight, pipe.x, y, pipe.width, sliceHeight);
      }
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
  // Draw first background image
  ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);

  // Draw second background image to the right of the first image
  ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);


  if (!paused){
    backgroundX -= backgroundSpeed;

    // Reset position of background when image is off screened
    if (backgroundX <= -canvas.width) {
      backgroundX = 0;
    }
  }
}

// Cannot be drawn with background because ground needs to be drawn above/after pipes
function drawGround() {
  // Draw first ground images
  ctx.drawImage(groundImage, groundX, canvas.height - groundHeight, canvas.width, groundHeight);
  ctx.drawImage(groundImage, groundX + canvas.width, canvas.height - groundHeight, canvas.width, groundHeight);

  if(!paused){
    groundX -= pipeSpeed;

    if (groundX <= -canvas.width) {
      groundX = 0;
    }
  }
}

// Display end screen with Game Over text, and players current and high scores
function drawEndScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;

  ctx.strokeText("Game Over", canvas.width / 2, canvas.height / 3);
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 3);

  ctx.font = "40px Arial";
  ctx.strokeText(`Score: ${playerScore}`, canvas.width / 2, canvas.height / 2 - 25);
  ctx.fillText(`Score: ${playerScore}`, canvas.width / 2, canvas.height / 2 - 25);

  ctx.font = "40px Arial";
  ctx.strokeText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 25);
  ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 25);

  ctx.font = "30px Arial";
  ctx.strokeText("Press Space to Restart", canvas.width / 2, canvas.height * (2 / 3));
  ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height * (2 / 3));
}

// Display end screen with Game Over text, and players current and high scores
function drawPauseScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.strokeStyle = "black";

  ctx.lineWidth = 5;
  ctx.strokeText("Press Space to Start", canvas.width / 2, canvas.height / 3);

  ctx.fillStyle = "white";
  ctx.fillText("Press Space to Start", canvas.width / 2, canvas.height / 3);
}

function killBird() {
  // Check for ground collision
  if (bird.y + bird.height >= canvas.height - groundHeight) {
    endGame();
    return;
  }

  // Check for bird entering volume of any pipe
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

    // Check to make sure player is not above top pipe
    if (bird.y < 0 && bird.x > pipe.x && !pipe.passed) {
      endGame();
      return;
    }
  }
}

function endGame() {
  paused = true;
  showEndScreen = true;
}

function resetGame() {
  showEndScreen = false;
  paused = true;

  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes.length = 0; // Clear pipes
  frameCount = 0;
  playerScore = 0;
  
}

// Start the game when canvas is loaded
birdImage.onload = () => {
  gameLoop();
};
