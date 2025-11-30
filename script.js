const scoreElement = document.getElementById("scoreBoard");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingQuality = "high";
canvas.width = 1080;
canvas.height = 1280;
let pipes = [];
let pipeWidth = 100;
let pipeSpwanTimer = 0;
let birdY = 20;
let birdX = 50;
let birdWidth = 80;
let birdHeight = 150;
let birdVelocity = 0;
let score = 0;
let dead = false;
let animationId = null;
const gravity = 0.2;
const jumpForce = -5;

const pipeImg = new Image();
pipeImg.src = "./images/image.png";

const BiirdImg = new Image();
BiirdImg.src = "./images/harshbhaiya.png";

function spawnPipe() {
  const gap = 400;
  const minTop = 80;
  const maxTop = canvas.height - gap - 80;

  const topHeight = Math.floor(Math.random() * (maxTop - minTop) + minTop);

  pipes.push({
    x: canvas.width,
    topHeight: topHeight,
    gap: gap,
    counted: false,
  });
}
function resetGame() {
  // reset game state
  pipes = [];
  pipeSpwanTimer = 0;
  birdY = 20;
  birdX = 50;
  birdVelocity = 0;
  score = 0;
  dead = false;
  scoreElement.innerText = score;
  gameOverScreen.classList.add("hidden");
}

function gameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameOverScreen.classList.remove("hidden");
  scoreElement.classList.add("hidden");
  finalScore.innerText = `Your final score is: ${score}`;
  cancelAnimationFrame(animationId);

  restartBtn.onclick = function () {
    resetGame();
    loop();
  };
}

function isColliding(
  aLeft,
  aTop,
  aWidth,
  aHeight,
  bLeft,
  bTop,
  bWidth,
  bHeight
) {
  aRight = aLeft + aWidth;
  aBottom = aTop + aHeight;
  bRight = bLeft + bWidth;
  bBottom = bTop + bHeight;
  const offset = 10; // optional offset to make collision less sensitive
  return (
    aLeft + offset < bRight &&
    aRight - offset > bLeft + offset &&
    aTop + offset < bBottom &&
    aBottom - offset > bTop
  );
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // DRAW BIRD
  ctx.fillStyle = "transparent";
  ctx.drawImage(BiirdImg, birdX, birdY, birdWidth, birdHeight);

  // UPDATE BIRD
  birdVelocity += gravity;
  birdY += birdVelocity;

  // UPDATE + DRAW PIPES
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    pipe.x -= 1.5;

    // draw
    ctx.fillStyle = "green";
    ctx.drawImage(pipeImg, pipe.x, 0, pipeWidth, pipe.topHeight);

    let bottomY = pipe.topHeight + pipe.gap;
    ctx.drawImage(pipeImg, pipe.x, bottomY, pipeWidth, canvas.height - bottomY);

    // scoring
    if (!pipe.counted && !dead && pipe.x + pipeWidth < birdX) {
      score++;
      scoreElement.innerText = `Score: ${score}`;
      pipe.counted = true;
    }

    // remove offscreen pipes
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(i, 1);
      i--;
    }

    // collision check
    if (
      isColliding(
        birdX,
        birdY,
        birdWidth,
        birdHeight,
        pipe.x,
        0,
        pipeWidth,
        pipe.topHeight
      ) ||
      isColliding(
        birdX,
        birdY,
        birdWidth,
        birdHeight,
        pipe.x,
        bottomY,
        pipeWidth,
        canvas.height - bottomY
      )
    ) {
      dead = true;
    }
  }
  // boundary check AFTER all pipe logic
  if (birdY < 0 || birdY + birdHeight >= canvas.height + 10) {
    dead = true;
  }

  // game-over trigger
  if (dead) {
    gameOver();
    return;
  }

  // spawn new pipe
  pipeSpwanTimer++;
  if (pipeSpwanTimer > 180) {
    spawnPipe();
    pipeSpwanTimer = 0;
  }

  animationId = requestAnimationFrame(loop);
}

window.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    birdVelocity = jumpForce;
  }
});

window.addEventListener("keydown", function (e) {
  if (e.code === "ArrowLeft") {
    birdX = birdX - 10;
  }
  if (e.code === "ArrowRight") {
    birdX = birdX + 10;
  }
});

loop();
