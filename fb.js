// We need to select the canvas elment to change the game
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameOver = false;


//pretty sure we can use this stack overflow link to size ourt canvaas
https://stackoverflow.com/questions/43436661/how-to-scale-canvas-on-mobile-and-desktop-devices
const canvasSize = window.innerHeight; 
canvas.width = canvasSize;
canvas.height = canvasSize;

// Using the Image class
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
const birdImage = new Image();
birdImage.src = "images/birb.png";

//For all the background elemtns, we can just reload them repeatedly making it look like an infinite background
const backgroundImage = new Image();
backgroundImage.src = "images/background.png";
let backgroundX = 0;
const backgroundSpeed = 1;

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

const pipes = [];
const pipeWidth = 75;
const pipeGap = 250;
const pipeSpeed = 4;
const pipeFrequency = 125;
let frameCount = 0;

let playerScore = 0;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (paused) {
      paused = false;
    } else {
      bird.velocity = bird.lift;
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    if (paused) {
      paused = false;
    } else {
      paused = true;
    }
  }
});

function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // TODO Update to kill bird when it hits the ground
  //Im actually going to do this later because it will be better that way you idiot :)
  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    bird.velocity = 0;
  }

  // Update pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= pipeSpeed;

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
  ctx.save();
//I think we can just rotate the image using the built in rotate methods
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate
//This will make the bird look like it odes in the actual game
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
  const angle = Math.min(Math.max(bird.velocity / 10, -.75), 1);
  ctx.rotate(angle);


  ctx.drawImage(birdImage, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
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
  ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);

  if (!paused){
    backgroundX -= backgroundSpeed;
    if (backgroundX <= -canvas.width) {
      backgroundX = 0;
    }
  }
}


function drawGround() {
  const groundHeight = 85;
  ctx.drawImage(groundImage, groundX, canvas.height - groundHeight, canvas.width, groundHeight);
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
  }
}

function endGame() {
  paused = true;
  showEndScreen = true;
}

function resetGame() {
  // Reset game variables
  bird.y = canvas.height / 2; 
  bird.velocity = 0;
  pipes.length = 0;
  frameCount = 0;
  playerScore = 0;
  showEndScreen = false;
  paused = true;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (showEndScreen) {
      resetGame();
    } else if (paused) {
      paused = false;
    } else {
      bird.velocity = bird.lift;
    }
  }
});

function drawEndScreen() {
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
  ctx.strokeText(`Score: ${playerScore}`, canvas.width / 2, canvas.height / 2);
  ctx.fillText(`Score: ${playerScore}`, canvas.width / 2, canvas.height / 2);

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
    drawEndScreen();
  } else {
    drawBackground();
    drawPipes();
    drawGround();
    drawBird();
    drawScore();

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
