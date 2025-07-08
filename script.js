const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
const rows = canvas.width / box;

let snake, direction, food, score, interval;
let highScore = localStorage.getItem('highScore') || 0;

document.getElementById('high-score').textContent = highScore;

document.addEventListener('keydown', handleKey);

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('stop-btn').addEventListener('click', stopGame);

function resetGame() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = 'RIGHT';
  food = randomFood();
  score = 0;
  document.getElementById('score').textContent = score;
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * rows) * box,
    y: Math.floor(Math.random() * rows) * box
  };
}

function handleKey(e) {
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = '#ff4757';
  ctx.fillRect(food.x, food.y, box, box);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#00ff99' : '#2ed573';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Move snake
  let head = { ...snake[0] };
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'DOWN') head.y += box;

  // Collision check
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    stopGame();
    alert('Game Over! 😵');
    return;
  }

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    food = randomFood();
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      document.getElementById('high-score').textContent = highScore;
    }
    document.getElementById('score').textContent = score;
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

function startGame() {
  stopGame(); // Ensure only one interval runs
  resetGame();
  interval = setInterval(draw, 100);
}

function stopGame() {
  clearInterval(interval);
}
