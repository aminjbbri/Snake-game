const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Game configuration
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;
const gridSize = 20;
let score = 0;

// Snake configuration
let snake = [{ x: 160, y: 160 }];
let dx = gridSize; // X-axis movement
let dy = 0;        // Y-axis movement
let food = generateFood();  // Initial food position
let changingDirection = false;  // Prevent multiple direction changes at once
let gameInterval;

// Variables to track touch positions
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Start the game loop
function startGame() {
  gameInterval = setInterval(updateGame, 100);
}

function updateGame() {
  if (checkSelfCollision()) {
    clearInterval(gameInterval);  // Stop the game loop
    alert("Game Over! Your score was " + score);
    resetGame();
    return;
  }

  changingDirection = false;  // Reset the direction change lock
  moveSnake();
  if (checkFoodCollision()) {
    score += 10;
    scoreDisplay.innerText = "Score: " + score;
    food = generateFood();  // New food location
  }
  drawGame();
}

// Draw the entire game (snake and food)
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  drawSnake();
}

// Draw the snake on the canvas
function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    ctx.strokeStyle = '#2ecc71';
    ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
  });
}

// Move the snake in the current direction
function moveSnake() {
  let head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Wrap around the canvas when the snake goes through the walls
  if (head.x >= canvasSize) {
    head.x = 0;  // Appears on the left side if it crosses the right wall
  } else if (head.x < 0) {
    head.x = canvasSize - gridSize;  // Appears on the right side if it crosses the left wall
  }

  if (head.y >= canvasSize) {
    head.y = 0;  // Appears on the top if it crosses the bottom wall
  } else if (head.y < 0) {
    head.y = canvasSize - gridSize;  // Appears on the bottom if it crosses the top wall
  }

  snake.unshift(head);  // Add new head to the snake

  if (head.x === food.x && head.y === food.y) {
    // Do not remove the tail if food is eaten (snake grows)
  } else {
    snake.pop();  // Remove the last part of the snake (move effect)
  }
}

// Draw the food on the canvas
function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Check if the snake has eaten the food
function checkFoodCollision() {
  const head = snake[0];
  return head.x === food.x && head.y === food.y;
}

// Check for collision with itself (snake bites itself)
function checkSelfCollision() {
  const head = snake[0];

  // Check if the head collides with any part of the body (excluding the head itself)
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;  // Self-collision detected
    }
  }
  return false;  // No self-collision
}

// Generate a new random position for the food
function generateFood() {
  const foodX = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
  const foodY = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
  return { x: foodX, y: foodY };
}

// Reset the game state
function resetGame() {
  score = 0;
  scoreDisplay.innerText = "Score: " + score;
  snake = [{ x: 160, y: 160 }];
  dx = gridSize;
  dy = 0;
  food = generateFood();
  startGame();
}

// Detect touch gestures for mobile play (Swipe Controls)
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

// Capture the starting point of the touch
function handleTouchStart(evt) {
  const firstTouch = evt.touches[0];
  touchStartX = firstTouch.clientX;
  touchStartY = firstTouch.clientY;
}

// Capture the ending point and determine the direction of the swipe
function handleTouchMove(evt) {
  if (!touchStartX || !touchStartY) {
    return;
  }

  touchEndX = evt.touches[0].clientX;
  touchEndY = evt.touches[0].clientY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (changingDirection) return;

  // Determine whether the swipe was horizontal or vertical
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Swipe was horizontal
    if (diffX > 0 && dx === 0) {
      // Right swipe
      dx = gridSize;
      dy = 0;
    } else if (diffX < 0 && dx === 0) {
      // Left swipe
      dx = -gridSize;
      dy = 0;
    }
  } else {
    // Swipe was vertical
    if (diffY > 0 && dy === 0) {
      // Down swipe
      dx = 0;
      dy = gridSize;
    } else if (diffY < 0 && dy === 0) {
      // Up swipe
      dx = 0;
      dy = -gridSize;
    }
  }

  // Reset starting positions after the swipe is processed
  touchStartX = 0;
  touchStartY = 0;
  changingDirection = true;
}

// Start the game for the first time
resetGame();
