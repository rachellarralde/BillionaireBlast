// Main game file - coordinates all game modules

// Game variables
let canvas;
let player;
let buildings = [];
let enemies = [];
let bullets = [];
let enemyBullets = [];
let enemyImages = {};
let enemyTypes = ['elon', 'jef', 'zuk', 'trump'];
let gunImage;
let splashImage;
let score = 0;
let killCount = 0;
let health = 100;
let gameState = 'intro'; // intro, playing, paused, gameOver
let pointerLocked = false;

// UI elements
let crosshair;
let healthBar;
let ammoCounter;
let gameMessage;

// Preload assets
function preload() {
  // Load enemy images - with error handling
  try {
    enemyImages.elon = loadImage('assets/elon.png');
    enemyImages.jef = loadImage('assets/jef.png');
    enemyImages.zuk = loadImage('assets/zuk.png');
    enemyImages.trump = loadImage('assets/trump.png');
    
    // Load gun image
    gunImage = loadImage('assets/gun.png');
    
    // Load splash image
    splashImage = loadImage('assets/splash.png');
  } catch (e) {
    console.log("Error loading images:", e);
  }
}

// Setup function
function setup() {
  // Create canvas
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Make sure the main element exists before trying to set it as parent
  let mainElement = document.querySelector('main');
  if (mainElement) {
    canvas.parent(mainElement);
  } else {
    // If main doesn't exist, append to body
    canvas.parent(document.body);
  }
  
  // Create player
  player = new Player();
  
  // Generate environment
  generateEnvironment();
  
  // Create UI elements
  crosshair = new Crosshair();
  healthBar = new HealthBar();
  ammoCounter = new AmmoCounter();
  gameMessage = new GameMessage();
  
  // Set up pointer lock event listeners
  document.addEventListener('pointerlockchange', pointerLockChange, false);
  document.addEventListener('mozpointerlockchange', pointerLockChange, false);
  document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
  
  // Add click event to canvas for pointer lock
  canvas.mouseClicked(function() {
    if (gameState === 'playing' && !pointerLocked) {
      lockPointer();
    }
  });
  
  // Spawn initial enemies
  spawnEnemies(5);
  
  // Set initial game state
  gameState = 'intro';
}

// Draw function - main game loop
function draw() {
  // Clear background
  background(0);
  
  // Basic error handling
  try {
    // Update based on game state
    switch (gameState) {
      case 'intro':
        // Simple intro screen
        push();
        fill(0, 0, 0, 200);
        translate(0, 0, -500);
        plane(width, height);
        
        fill(255, 0, 0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("BILLIONAIRE BLAST", 0, -50);
        
        fill(255);
        textSize(16);
        text("Click to start", 0, 50);
        pop();
        
        // Start game on click
        if (mouseIsPressed && mouseButton === LEFT) {
          gameState = 'playing';
          lockPointer();
        }
        break;
        
      case 'playing':
        // Update player
        player.update();
        
        // Draw environment
        drawEnvironment();
        
        // Update and draw enemies
        updateEnemies();
        
        // Update and draw bullets
        updateBullets();
        updateEnemyBullets();
        
        // Draw gun
        drawGun();
        
        // Update and draw UI
        updateUI();
        
        // Check if player is dead
        if (health <= 0) {
          gameState = 'gameOver';
          document.exitPointerLock();
        }
        break;
        
      case 'paused':
        // Draw environment (static)
        drawEnvironment();
        
        // Draw enemies (static)
        for (let enemy of enemies) {
          enemy.display();
        }
        
        // Draw bullets (static)
        for (let bullet of bullets) {
          bullet.display();
        }
        
        // Draw enemy bullets (static)
        for (let bullet of enemyBullets) {
          bullet.display();
        }
        
        // Draw gun (static)
        drawGun();
        
        // Draw pause screen
        push();
        fill(0, 0, 0, 150);
        translate(0, 0, -500);
        plane(width, height);
        
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("PAUSED", 0, 0);
        pop();
        break;
        
      case 'gameOver':
        // Draw game over screen
        push();
        fill(0, 0, 0, 200);
        translate(0, 0, -500);
        plane(width, height);
        
        fill(255, 0, 0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("GAME OVER", 0, -50);
        
        fill(255);
        textSize(16);
        text("Score: " + score, 0, 0);
        text("Click to restart", 0, 50);
        pop();
        
        // Restart game on click
        if (mouseIsPressed && mouseButton === LEFT) {
          resetGame();
          gameState = 'playing';
          lockPointer();
        }
        break;
    }
  } catch (e) {
    // If there's an error, show a simple error message
    console.error("Game error:", e);
    background(0);
    push();
    fill(255, 0, 0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Error: " + e.message, 0, 0);
    pop();
  }
}

// Reset game function
function resetGame() {
  // Reset game variables
  score = 0;
  killCount = 0;
  health = 100;
  
  // Reset player position
  player.position = createVector(0, 0, 0);
  player.direction = createVector(0, 0, -1);
  
  // Clear enemies and bullets
  enemies = [];
  bullets = [];
  enemyBullets = [];
  
  // Spawn initial enemies
  spawnEnemies(5);
}

// Mouse pressed event
function mousePressed() {
  if (gameState === 'playing' && mouseButton === LEFT) {
    shoot();
  }
}

// Key event handlers are now in player.js

// Window resize event
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Draw gun
function drawGun() {
  if (gameState !== 'playing') return;
  
  push();
  // Position gun in front of camera
  translate(50, 50, -100);
  
  if (gunImage) {
    // Use texture if available
    texture(gunImage);
    plane(100, 50);
  } else {
    // Fallback to a simple rectangle
    fill(100);
    noStroke();
    plane(100, 50);
  }
  pop();
}
