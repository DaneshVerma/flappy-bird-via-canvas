const canvas = document.getElementById("game");
const scoreElement = document.getElementById("score");
const ctx = canvas.getContext("2d");
let pipes = [];
let pipeSpwanTimer = 0;
let birdY = 20;
let birdX = 50;
let birdWidth = 20;
let birdHeight = 20;
let birdVelocity = 0; // initial vertical velocity
let score = 0;
let dead = false;
const gravity = 0.2;
const jumpForce = -2;

function spawnPipe() {
  const gap = 70;
  const minTop = 40;
  const maxTop = 100;

  const topHeight = Math.floor(Math.random() * (maxTop - minTop) + minTop);

  pipes.push({
    x: canvas.width,
    topHeight: topHeight,
    gap: gap,
    counted: false,
  });
}
function gameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  alert("Game Over! Your score: " + score);
  score = 0;
  scoreElement.innerText = score;
  pipes = [];
  birdY = 20;
  birdVelocity = 0;
  pipeSpwanTimer = 0;
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
  const offset = 4; // optional offset for more forgiving collision
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
  ctx.fillStyle = "yellow";
  ctx.fillRect(birdX, birdY, birdWidth, birdHeight);

  // UPDATE BIRD
  birdVelocity += gravity;
  birdY += birdVelocity;

  dead = false;

  // UPDATE + DRAW PIPES
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    pipe.x -= 1.5;

    // draw
    ctx.fillStyle = "green";
    ctx.fillRect(pipe.x, 0, 40, pipe.topHeight);

    let bottomY = pipe.topHeight + pipe.gap;
    ctx.fillRect(pipe.x, bottomY, 40, canvas.height - bottomY);

    // scoring
    if (!pipe.counted && pipe.x + 40 < birdX) {
      score++;
      scoreElement.innerText = score;
      pipe.counted = true;
    }

    // cleanup
    if (pipe.x + 40 < 0) {
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
        40,
        pipe.topHeight
      ) ||
      isColliding(
        birdX,
        birdY,
        birdWidth,
        birdHeight,
        pipe.x,
        bottomY,
        40,
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

  // SINGLE game-over trigger
  if (dead) {
    gameOver();
  }

  // spawn new pipe
  pipeSpwanTimer++;
  if (pipeSpwanTimer > 60) {
    spawnPipe();
    pipeSpwanTimer = 0;
  }

  requestAnimationFrame(loop);
}

window.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    birdVelocity = jumpForce;
  }
});

window.addEventListener("keydown", function (e) {
  if (e.code === "ArrowLeft") {
    birdX = birdX - 5;
  }
  if (e.code === "ArrowRight") {
    birdX = birdX + 5;
  }
});

loop();
