// Game constants
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const gameWidth = canvas.width;
const gameHeight = canvas.height;

// Player constants
const playerRadius = 20;
const playerSpeed = 8;
const bulletRadius = 5;
const bulletSpeed = 10;
let playerX = (gameWidth - playerRadius) / 2;
let playerY = gameHeight - playerRadius;
let playerHealth = 3;
let score = 0;

// Base constants
const baseWidth = 100;
const baseHeight = 50;
const baseX = (gameWidth - baseWidth) / 2;
const baseY = gameHeight - baseHeight - 10;
let baseHealth = 10;

// Bot constants
const botWidth = 40;
const botHeight = 40;
const botSpeed = 3;
const botSpawnRate = 1000; // In milliseconds
let bots = [];

// Game variables
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;
let bullets = [];
let gameover = false;
let intervalId = null;

// Keyboard event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
    if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    } else if (event.key === ' ') {
        spacePressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    } else if (event.key === ' ') {
        spacePressed = false;
    }
}

// Spawn a bot
function spawnBot() {
    const botX = Math.random() * (gameWidth - botWidth);
    const botY = 0;
    const bot = { x: botX, y: botY, health: 1 };
    bots.push(bot);
}

// Update the player position
function updatePlayer() {
    if (leftPressed && playerX > 0) {
        playerX -= playerSpeed;
    } else if (rightPressed && playerX + playerRadius < gameWidth) {
        playerX += playerSpeed;
    }
}

// Update the bullets position and check for collisions
function updateBullets() {
    bullets = bullets.filter((bullet) => bullet.y > 0); // Remove bullets outside the canvas

    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.y -= bulletSpeed;

        // Check for collision with bots
        for (let j = 0; j < bots.length; j++) {
            const bot = bots[j];
            if (
                bullet.x > bot.x &&
                bullet.x < bot.x + botWidth &&
                bullet.y > bot.y &&
                bullet.y < bot.y + botHeight
            ) {
                // Bullet hit a bot
                bullets.splice(i, 1);
                bot.health--;
                if (bot.health <= 0) {
                    bots.splice(j, 1);
                    score++;
                }
                break;
            }
        }

        // Check for collision with the base
        if (
            bullet.x > baseX &&
            bullet.x < baseX + baseWidth &&
            bullet.y > baseY &&
            bullet.y < baseY + baseHeight
        ) {
            // Bullet hit the base
            bullets.splice(i, 1);
            baseHealth--;
            if (baseHealth <= 0) {
                gameover = true;
                clearInterval(intervalId);
                alert('Game Over! Bots destroyed your base.');
            }
        }
    }
}

// Update the bots position and check for collisions
function updateBots() {
    for (let i = 0; i < bots.length; i++) {
        const bot = bots[i];
        bot.y += botSpeed;

        // Check for collision with the player
        if (
            playerX < bot.x + botWidth &&
            playerX + playerRadius > bot.x &&
            playerY < bot.y + botHeight &&
            playerY + playerRadius > bot.y
        ) {
            // Player collided with a bot
            playerHealth--;
            if (playerHealth <= 0) {
                gameover = true;
                clearInterval(intervalId);
                alert('Game Over! You were killed by a bot.');
            }
            bots.splice(i, 1);
        }

        // Check if the bot reached the base
        if (bot.y + botHeight > baseY) {
            bots.splice(i, 1);
            baseHealth--;
            if (baseHealth <= 0) {
                gameover = true;
                clearInterval(intervalId);
                alert('Game Over! Bots destroyed your base.');
            }
        }
    }
}

// Draw the game objects on the canvas
function draw() {
    context.clearRect(0, 0, gameWidth, gameHeight); // Clear the canvas

    // Draw the player
    context.fillStyle = 'blue';
    context.beginPath();
    context.arc(playerX + playerRadius, playerY + playerRadius, playerRadius, 0, Math.PI * 2);
    context.fill();
    context.closePath();

    // Draw the base
    context.fillStyle = 'green';
    context.fillRect(baseX, baseY, baseWidth, baseHeight);

    // Draw the bullets
    context.fillStyle = 'red';
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        context.beginPath();
        context.arc(bullet.x, bullet.y, bulletRadius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    }

    // Draw the bots
    context.fillStyle = 'black';
    for (let i = 0; i < bots.length; i++) {
        const bot = bots[i];
        context.fillRect(bot.x, bot.y, botWidth, botHeight);
    }

    // Draw the score
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.fillText('Score: ' + score, 10, 20);

    // Draw the player health
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.fillText('Player Health: ' + playerHealth + ' / 3', 10, 40);

    // Draw the base health
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.fillText('Base Health: ' + baseHealth + ' / 10', 10, 60);
}

// Game loop
function gameLoop() {
    if (!gameover) {
        updatePlayer();
        if (spacePressed) {
            fireBullet();
        }
        updateBullets();
        updateBots();
        draw();
    }
}

// Fire a bullet
// Fire a bullet
function fireBullet() {
  const bulletX = playerX + playerRadius - bulletRadius;
  const bulletY = playerY;
  const bullet = { x: bulletX, y: bulletY };
  bullets.push(bullet);
}

// Update the bullets position and check for collisions
function updateBullets() {
  bullets = bullets.filter((bullet) => bullet.y > 0); // Remove bullets outside the canvas

  for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i];
      bullet.y -= bulletSpeed;

      // Check for collision with bots
      for (let j = 0; j < bots.length; j++) {
          const bot = bots[j];
          if (
              bullet.x > bot.x &&
              bullet.x < bot.x + botWidth &&
              bullet.y > bot.y &&
              bullet.y < bot.y + botHeight
          ) {
              // Bullet hit a bot
              bullets.splice(i, 1);
              bot.health--;
              if (bot.health <= 0) {
                  bots.splice(j, 1);
                  score++;
              }
              break;
          }
      }
  }
}


// Start the game
intervalId = setInterval(gameLoop, 20);
setInterval(spawnBot, botSpawnRate);
