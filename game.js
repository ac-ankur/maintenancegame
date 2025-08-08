const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let cols = gridSize;
let rows = gridSize;
let cellSize;

let snake, direction, food, score, intervalId;
const maxLength = 20;

// 🔁 Responsive Canvas Setup
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientWidth; // keep it square
  cellSize = canvas.width / gridSize;
}

resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  draw(); // redraw after resize
});

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function randomPosition() {
  return {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
  };
}

function initGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  food = randomPosition();
  score = 0;
  document.getElementById("score").innerText = `Score: ${score}`;
  document.getElementById("overlay").style.display = "none";

  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(gameLoop, 150);
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((seg, idx) => {
    drawPixel(seg.x, seg.y, idx === 0 ? "#fff" : "#ccc");
  });

  drawPixel(food.x, food.y, "#fff");
  document.getElementById("score").innerText = `Score: ${score}`;
}

function update() {
  let head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // Wall wrap
  if (head.x < 0) head.x = cols - 1;
  if (head.x >= cols) head.x = 0;
  if (head.y < 0) head.y = rows - 1;
  if (head.y >= rows) head.y = 0;

  // Self collision
  if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
    showOverlay(`💀 Game Over\nFinal Score: ${score}`);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomPosition();
    if (snake.length >= maxLength) {
      showOverlay(`🎉 You Win!\nFinal Score: ${score}`);
      return;
    }
  } else {
    snake.pop();
  }
}

function gameLoop() {
  update();
  draw();
}

function restartGame() {
  initGame();
}

function showOverlay(message) {
  clearInterval(intervalId);
  document.getElementById("gameMessage").innerText = message;
  document.getElementById("overlay").style.display = "block";
}

// 🎮 Keyboard controls
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// 📱 Touch controls
let touchStartX = 0,
  touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
});

canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    const t = e.touches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && direction.x === 0) direction = { x: 1, y: 0 };
      else if (dx < 0 && direction.x === 0) direction = { x: -1, y: 0 };
    } else {
      if (dy > 0 && direction.y === 0) direction = { x: 0, y: 1 };
      else if (dy < 0 && direction.y === 0) direction = { x: 0, y: -1 };
    }
  },
  { passive: false }
);

initGame();
