// Game variables
let gameRunning = false;
let score = 0;
let gameSpeed = 2;
let obstacleSpeed = 5;
let obstacleInterval = 1500;
let coinInterval = 1000;
let lastObstacleTime = 0;
let lastCoinTime = 0;
let playerPosition = 170;
let obstacles = [];
let coins = [];
let animationId;

// DOM elements
const gameContainer = document.getElementById('game-container');
const playerCar = document.getElementById('player-car');
const scoreDisplay = document.getElementById('score-display');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

// Event listeners
document.addEventListener('keydown', handleKeyPress);
restartBtn.addEventListener('click', restartGame);
startBtn.addEventListener('click', startGame);

// Game functions
function startGame() {
    startScreen.style.display = 'none';
    gameRunning = true;
    score = 0;
    gameSpeed = 2;
    obstacleSpeed = 5;
    obstacleInterval = 1500;
    coinInterval = 1000;
    lastObstacleTime = 0;
    lastCoinTime = 0;
    playerPosition = 170;
    obstacles = [];
    coins = [];
    
    // Clear all existing obstacles and coins
    document.querySelectorAll('.obstacle, .coin').forEach(el => el.remove());
    
    scoreDisplay.textContent = `Score: ${score}`;
    playerCar.style.left = `${playerPosition}px`;
    
    animationId = requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (!gameRunning) return;
    
    // Spawn obstacles
    if (timestamp - lastObstacleTime > obstacleInterval) {
        spawnObstacle();
        lastObstacleTime = timestamp;
        
        // Increase difficulty
        if (score % 10 === 0 && score > 0) {
            gameSpeed += 0.2;
            obstacleSpeed += 0.5;
            if (obstacleInterval > 800) {
                obstacleInterval -= 100;
            }
            if (coinInterval > 500) {
                coinInterval -= 50;
            }
        }
    }
    
    // Spawn coins
    if (timestamp - lastCoinTime > coinInterval) {
        spawnCoin();
        lastCoinTime = timestamp;
    }
    
    // Move obstacles
    moveObstacles();
    
    // Move coins
    moveCoins();
    
    // Check collisions
    checkCollisions();
    
    animationId = requestAnimationFrame(gameLoop);
}

function spawnObstacle() {
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    const lane = Math.floor(Math.random() * 3);
    const positions = [70, 170, 270];
    obstacle.style.left = `${positions[lane]}px`;
    obstacle.style.top = '-80px';
    gameContainer.appendChild(obstacle);
    obstacles.push({
        element: obstacle,
        y: -80,
        lane: lane
    });
}

function spawnCoin() {
    const coin = document.createElement('div');
    coin.className = 'coin';
    const lane = Math.floor(Math.random() * 3);
    const positions = [90, 190, 290];
    coin.style.left = `${positions[lane]}px`;
    coin.style.top = '-20px';
    gameContainer.appendChild(coin);
    coins.push({
        element: coin,
        y: -20,
        lane: lane
    });
}

function moveObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += obstacleSpeed;
        obstacle.element.style.top = `${obstacle.y}px`;
        
        // Remove obstacle if it's off screen
        if (obstacle.y > 600) {
            obstacle.element.remove();
            obstacles = obstacles.filter(o => o !== obstacle);
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
        }
    });
}

function moveCoins() {
    coins.forEach(coin => {
        coin.y += obstacleSpeed;
        coin.element.style.top = `${coin.y}px`;
        
        // Remove coin if it's off screen
        if (coin.y > 600) {
            coin.element.remove();
            coins = coins.filter(c => c !== coin);
        }
    });
}

function checkCollisions() {
    const playerRect = playerCar.getBoundingClientRect();
    
    // Check obstacle collisions
    for (const obstacle of obstacles) {
        const obstacleRect = obstacle.element.getBoundingClientRect();
        
        if (
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top
        ) {
            gameOver();
            return;
        }
    }
    
    // Check coin collisions
    for (const coin of coins) {
        const coinRect = coin.element.getBoundingClientRect();
        
        if (
            playerRect.left < coinRect.right &&
            playerRect.right > coinRect.left &&
            playerRect.top < coinRect.bottom &&
            playerRect.bottom > coinRect.top
        ) {
            coin.element.remove();
            coins = coins.filter(c => c !== coin);
            score += 5;
            scoreDisplay.textContent = `Score: ${score}`;
        }
    }
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    finalScoreDisplay.textContent = `Score: ${score}`;
    gameOverScreen.style.display = 'flex';
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    startGame();
}

function handleKeyPress(e) {
    if (!gameRunning) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            if (playerPosition > 70) {
                playerPosition -= 100;
                playerCar.style.left = `${playerPosition}px`;
            }
            break;
        case 'ArrowRight':
            if (playerPosition < 270) {
                playerPosition += 100;
                playerCar.style.left = `${playerPosition}px`;
            }
            break;
    }
}
