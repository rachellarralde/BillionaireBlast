// Game state variables
let gameState = 'intro'; // intro, playing, paused, gameOver
let player;
let enemies = [];
let bullets = [];
let enemyBullets = [];
let buildings = [];
let pointerLocked = false;
let health = 100;
let score = 0;
let killCount = 0;

// Assets
let gunImage;
let enemyImages = [];
let enemyTypes = ['zuk', 'trump', 'elon', 'jef'];
let splashImage;
let gameFont;

// UI Elements
let crosshair;
let healthBar;
let ammoCounter;
let gameMessage;

// Preload assets
function preload() {
  // Load images
  gunImage = loadImage('assets/POV-gun.png');
  enemyImages[0] = loadImage('assets/zuk.png');
  enemyImages[1] = loadImage('assets/trump.png');
  enemyImages[2] = loadImage('assets/elon.png');
  enemyImages[3] = loadImage('assets/jef.png');
  splashImage = loadImage('assets/splash.png');
  
  // Load font
  gameFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noCursor();
  
  // Set the font
  textFont(gameFont);
  
  // Initialize player
  player = new Player();
  
  // Create UI elements
  createUI();
  
  // Generate urban environment
  generateEnvironment();
  
  // Add event listeners for pointer lock
  document.addEventListener('click', lockPointer);
  document.addEventListener('pointerlockchange', pointerLockChange);
}

function draw() {
  background(100);
  
  switch(gameState) {
    case 'intro':
      drawIntroScreen();
      break;
    case 'playing':
      updateGame();
      break;
    case 'paused':
      updateGame();
      drawPauseScreen();
      break;
    case 'gameOver':
      drawGameOverScreen();
      break;
  }
}

function createUI() {
  // Create crosshair
  crosshair = createDiv('+');
  crosshair.class('crosshair');
  
  // Create health bar
  healthBar = createDiv();
  healthBar.class('health-bar');
  let healthFill = createDiv();
  healthFill.class('health-fill');
  healthBar.child(healthFill);
  
  // Create ammo counter
  ammoCounter = createDiv('30 / 120');
  ammoCounter.class('ammo-counter');
  
  // Create game message container (for intro and game over)
  gameMessage = createDiv();
  gameMessage.class('game-message');
  
  // Initially hide UI elements
  healthBar.hide();
  ammoCounter.hide();
}

function drawIntroScreen() {
  // Clear any previous content
  gameMessage.html('');
  
  // Add intro content
  let title = createElement('h1', 'BILLIONAIRE BLAST');
  let description = createP('Take down the tech billionaires in this urban warfare simulator!<br>WASD to move, Mouse to aim, Left Click to shoot<br>ESC to lock/unlock mouse, SPACE to pause');
  let startButton = createButton('START GAME');
  
  // Add elements to the game message
  gameMessage.child(title);
  gameMessage.child(description);
  gameMessage.child(startButton);
  
  // Show the game message
  gameMessage.show();
  
  // Start button event
  startButton.mousePressed(() => {
    gameState = 'playing';
    gameMessage.hide();
    healthBar.show();
    ammoCounter.show();
    
    // Spawn initial enemies
    spawnEnemies(5);
  });
  
  // Display splash image
  push();
  translate(0, 0, -500);
  texture(splashImage);
  plane(width, height);
  pop();
}

function drawPauseScreen() {
  // Darken the screen
  push();
  translate(0, 0, -100);
  fill(0, 0, 0, 150);
  plane(width * 2, height * 2);
  pop();
  
  // Display pause message
  push();
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  text('GAME PAUSED', 0, 0);
  textSize(16);
  text('Press SPACE to resume', 0, 40);
  pop();
}

function drawGameOverScreen() {
  // Clear any previous content
  gameMessage.html('');
  
  // Add game over content
  let title = createElement('h1', 'GAME OVER');
  let scoreText = createP(`Score: ${score}<br>Billionaires Eliminated: ${killCount}`);
  let restartButton = createButton('PLAY AGAIN');
  
  // Add elements to the game message
  gameMessage.child(title);
  gameMessage.child(scoreText);
  gameMessage.child(restartButton);
  
  // Show the game message
  gameMessage.show();
  
  // Restart button event
  restartButton.mousePressed(() => {
    resetGame();
    gameState = 'playing';
    gameMessage.hide();
    healthBar.show();
    ammoCounter.show();
  });
}

function updateGame() {
  // Update player
  player.update();
  
  // Update and render environment
  drawEnvironment();
  
  // Update and render enemies
  updateEnemies();
  
  // Update and render bullets
  updateBullets();
  
  // Update UI
  updateUI();
  
  // Draw gun
  drawGun();
  
  // Check for game over
  if (health <= 0 && gameState === 'playing') {
    gameState = 'gameOver';
    healthBar.hide();
    ammoCounter.hide();
  }
  
  // Spawn new enemies if needed
  if (enemies.length < 5 && random() < 0.01 && gameState === 'playing') {
    spawnEnemies(1);
  }
}

function drawGun() {
  push();
  translate(100, 100, 200);
  texture(gunImage);
  plane(300, 200);
  pop();
}

function updateUI() {
  // Update health bar
  select('.health-fill').style('width', `${health}%`);
  
  // Update ammo counter (placeholder values)
  ammoCounter.html('30 / 120');
}

function generateEnvironment() {
  // Create buildings for urban environment
  for (let i = 0; i < 30; i++) {
    let x = random(-2000, 2000);
    let z = random(-2000, 2000);
    
    // Don't place buildings too close to player spawn
    if (dist(x, z, 0, 0) > 300) {
      let w = random(100, 300);
      let h = random(100, 500);
      let d = random(100, 300);
      buildings.push({ x, z, w, h, d, color: color(random(50, 150)) });
    }
  }
  
  // Add ground
  buildings.push({ x: 0, z: 0, w: 4000, h: 1, d: 4000, color: color(80, 80, 80), isGround: true });
}

function drawEnvironment() {
  // Set ambient light
  ambientLight(60, 60, 60);
  
  // Add directional light
  directionalLight(255, 255, 255, 0.5, 1, -0.5);
  
  // Draw buildings
  for (let building of buildings) {
    push();
    translate(building.x, -building.h/2, building.z);
    fill(building.color);
    noStroke();
    
    if (building.isGround) {
      // Draw ground plane
      rotateX(HALF_PI);
      plane(building.w, building.d);
    } else {
      // Draw building
      box(building.w, building.h, building.d);
    }
    pop();
  }
}

function spawnEnemies(count) {
  for (let i = 0; i < count; i++) {
    let x = random(-1500, 1500);
    let z = random(-1500, 1500);
    
    // Make sure enemy is not too close to player
    while (dist(x, z, player.position.x, player.position.z) < 500) {
      x = random(-1500, 1500);
      z = random(-1500, 1500);
    }
    
    let enemyType = floor(random(enemyTypes.length));
    enemies.push(new Enemy(x, z, enemyType));
  }
}

function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].display();
    
    // Check if enemy is dead
    if (enemies[i].health <= 0) {
      score += 100;
      killCount++;
      enemies.splice(i, 1);
    }
  }
}

function updateBullets() {
  // Update player bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();
    
    // Check for collision with enemies
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (bullets[i] && bullets[i].hits(enemies[j])) {
        enemies[j].health -= 25;
        bullets.splice(i, 1);
        break;
      }
    }
    
    // Remove bullets that are out of bounds
    if (bullets[i] && bullets[i].isOffScreen()) {
      bullets.splice(i, 1);
    }
  }
  
  // Update enemy bullets
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    enemyBullets[i].update();
    enemyBullets[i].display();
    
    // Check for collision with player
    if (enemyBullets[i].hitsPlayer()) {
      health -= 10;
      enemyBullets.splice(i, 1);
    } else if (enemyBullets[i].isOffScreen()) {
      enemyBullets.splice(i, 1);
    }
  }
}

function resetGame() {
  // Reset game variables
  health = 100;
  score = 0;
  killCount = 0;
  
  // Clear arrays
  enemies = [];
  bullets = [];
  enemyBullets = [];
  
  // Reset player position
  player.position = createVector(0, 0, 0);
  
  // Spawn initial enemies
  spawnEnemies(5);
}

// Renamed to avoid conflict with p5.js
function lockPointer() {
  if (gameState === 'playing' && !pointerLocked) {
    let pointerLockRequest = canvas.requestPointerLock || 
                          canvas.mozRequestPointerLock || 
                          canvas.webkitRequestPointerLock;
    pointerLockRequest.call(canvas);
  }
}

function pointerLockChange() {
  if (document.pointerLockElement === canvas || 
      document.mozPointerLockElement === canvas || 
      document.webkitPointerLockElement === canvas) {
    pointerLocked = true;
  } else {
    pointerLocked = false;
  }
}

function keyPressed() {
  // Pause game with spacebar
  if (keyCode === 32 && (gameState === 'playing' || gameState === 'paused')) {
    gameState = gameState === 'playing' ? 'paused' : 'playing';
  }
  
  // Lock/unlock pointer with ESC
  if (keyCode === 27) {
    if (pointerLocked) {
      document.exitPointerLock();
    } else {
      lockPointer();
    }
  }
}

function mousePressed() {
  // Shoot when left mouse button is clicked
  if (mouseButton === LEFT && gameState === 'playing') {
    shoot();
  }
}

function shoot() {
  // Create a new bullet
  let bullet = new Bullet(
    player.position.x, 
    player.position.y, 
    player.position.z, 
    player.direction.x, 
    player.direction.y, 
    player.direction.z
  );
  bullets.push(bullet);
  
  // Play gunshot sound effect (using standard Web Audio API)
  playGunshot();
}

// Simple function to play gunshot sound using Web Audio API
function playGunshot() {
  try {
    // Create audio context if it doesn't exist
    if (!window.audioContext) {
      window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Create oscillator for a quick sound effect
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (e) {
    console.log("Audio error:", e);
  }
}

// Player class
class Player {
  constructor() {
    this.position = createVector(0, 0, 0);
    this.direction = createVector(0, 0, -1);
    this.up = createVector(0, 1, 0);
    this.speed = 5;
    this.sensitivity = 0.002;
    this.height = -50; // Eye level
    this.isMoving = false;
  }
  
  update() {
    if (gameState !== 'playing') return;
    
    // Handle mouse look
    if (pointerLocked) {
      this.look(movedX, movedY);
    }
    
    // Handle keyboard movement
    this.move();
    
    // Update camera
    camera(
      this.position.x, this.position.y + this.height, this.position.z,
      this.position.x + this.direction.x, this.position.y + this.height + this.direction.y, this.position.z + this.direction.z,
      this.up.x, this.up.y, this.up.z
    );
  }
  
  look(deltaX, deltaY) {
    // Horizontal rotation (fixed to be non-inverted)
    let rotY = deltaX * this.sensitivity;
    let cosY = cos(rotY);
    let sinY = sin(rotY);
    
    let newDirectionX = this.direction.x * cosY - this.direction.z * sinY;
    let newDirectionZ = this.direction.x * sinY + this.direction.z * cosY;
    
    this.direction.x = newDirectionX;
    this.direction.z = newDirectionZ;
    
    // Vertical rotation (fixed to be non-inverted)
    let rotX = deltaY * this.sensitivity;
    let newDirectionY = this.direction.y + rotX;
    
    // Limit vertical look to prevent flipping
    if (newDirectionY < 0.99 && newDirectionY > -0.99) {
      this.direction.y = newDirectionY;
      // Normalize direction vector
      this.direction.normalize();
    }
  }
  
  move() {
    let moveX = 0;
    let moveZ = 0;
    this.isMoving = false;
    
    // Forward/backward (W/S)
    if (keyIsDown(87)) { // W key
      moveZ -= this.speed;
      this.isMoving = true;
    }
    if (keyIsDown(83)) { // S key
      moveZ += this.speed;
      this.isMoving = true;
    }
    
    // Left/right (A/D)
    if (keyIsDown(65)) { // A key
      moveX -= this.speed;
      this.isMoving = true;
    }
    if (keyIsDown(68)) { // D key
      moveX += this.speed;
      this.isMoving = true;
    }
    
    // Calculate movement vector based on player's direction
    if (moveX !== 0 || moveZ !== 0) {
      // Forward/backward movement
      let forwardVector = createVector(this.direction.x, 0, this.direction.z).normalize();
      
      // Strafe movement (perpendicular to forward)
      let rightVector = createVector(forwardVector.z, 0, -forwardVector.x);
      
      // Combine movements
      let movement = createVector(
        rightVector.x * moveX + forwardVector.x * moveZ,
        0,
        rightVector.z * moveX + forwardVector.z * moveZ
      );
      
      // Apply movement
      this.position.add(movement);
      
      // Collision detection with buildings
      this.checkCollisions();
    }
  }
  
  checkCollisions() {
    const playerRadius = 30;
    
    for (let building of buildings) {
      if (building.isGround) continue; // Skip ground
      
      // Simple collision detection with buildings
      if (this.position.x > building.x - building.w/2 - playerRadius && 
          this.position.x < building.x + building.w/2 + playerRadius && 
          this.position.z > building.z - building.d/2 - playerRadius && 
          this.position.z < building.z + building.d/2 + playerRadius) {
        
        // Find the closest edge to push player back
        let overlapX = 0;
        let overlapZ = 0;
        
        if (this.position.x < building.x) {
          overlapX = (building.x - building.w/2) - (this.position.x + playerRadius);
        } else {
          overlapX = (building.x + building.w/2) - (this.position.x - playerRadius);
        }
        
        if (this.position.z < building.z) {
          overlapZ = (building.z - building.d/2) - (this.position.z + playerRadius);
        } else {
          overlapZ = (building.z + building.d/2) - (this.position.z - playerRadius);
        }
        
        // Push back in the direction of least overlap
        if (abs(overlapX) < abs(overlapZ)) {
          this.position.x += overlapX;
        } else {
          this.position.z += overlapZ;
        }
      }
    }
    
    // Keep player within bounds
    const bounds = 1900;
    this.position.x = constrain(this.position.x, -bounds, bounds);
    this.position.z = constrain(this.position.z, -bounds, bounds);
  }
}

// Enemy class
class Enemy {
  constructor(x, z, type) {
    this.position = createVector(x, 0, z);
    this.type = type;
    this.health = 100;
    this.size = 100;
    this.lastShot = 0;
    this.shootInterval = random(1000, 3000);
    this.speed = random(0.5, 1.5);
  }
  
  update() {
    if (gameState !== 'playing') return;
    
    // Move towards player if far away
    let distToPlayer = dist(this.position.x, this.position.z, player.position.x, player.position.z);
    
    if (distToPlayer > 500) {
      // Move towards player
      let dirToPlayer = createVector(
        player.position.x - this.position.x,
        0,
        player.position.z - this.position.z
      ).normalize();
      
      this.position.x += dirToPlayer.x * this.speed;
      this.position.z += dirToPlayer.z * this.speed;
    } else if (distToPlayer < 300) {
      // Move away from player if too close
      let dirFromPlayer = createVector(
        this.position.x - player.position.x,
        0,
        this.position.z - player.position.z
      ).normalize();
      
      this.position.x += dirFromPlayer.x * this.speed;
      this.position.z += dirFromPlayer.z * this.speed;
    }
    
    // Shoot at player
    if (millis() - this.lastShot > this.shootInterval && distToPlayer < 1000) {
      this.shoot();
      this.lastShot = millis();
    }
  }
  
  display() {
    push();
    // Position the enemy
    translate(this.position.x, -this.size/2, this.position.z);
    
    // Make enemy face the player (billboard technique)
    let dirToPlayer = createVector(
      player.position.x - this.position.x,
      0,
      player.position.z - this.position.z
    ).normalize();
    
    // Calculate rotation angle
    let angle = atan2(dirToPlayer.z, dirToPlayer.x) + HALF_PI;
    rotateY(angle);
    
    // Draw enemy image
    texture(enemyImages[this.type]);
    plane(this.size, this.size * 1.5);
    
    // Health bar above enemy
    translate(0, -this.size, 0);
    rotateY(-angle); // Undo rotation so health bar always faces camera
    
    // Background of health bar
    fill(0, 0, 0, 150);
    rect(-this.size/2, -10, this.size, 10);
    
    // Health bar fill
    fill(255, 0, 0);
    rect(-this.size/2, -10, this.size * (this.health / 100), 10);
    
    pop();
  }
  
  shoot() {
    // Calculate direction to player
    let dirToPlayer = createVector(
      player.position.x - this.position.x,
      player.position.y + player.height - this.position.y,
      player.position.z - this.position.z
    ).normalize();
    
    // Add some inaccuracy
    dirToPlayer.x += random(-0.1, 0.1);
    dirToPlayer.y += random(-0.1, 0.1);
    dirToPlayer.z += random(-0.1, 0.1);
    dirToPlayer.normalize();
    
    // Create enemy bullet
    let bullet = new EnemyBullet(
      this.position.x,
      this.position.y,
      this.position.z,
      dirToPlayer.x,
      dirToPlayer.y,
      dirToPlayer.z
    );
    
    enemyBullets.push(bullet);
  }
}

// Bullet class
class Bullet {
  constructor(x, y, z, dirX, dirY, dirZ) {
    this.position = createVector(x, y + player.height, z);
    this.direction = createVector(dirX, dirY, dirZ).normalize();
    this.speed = 15;
    this.size = 5;
  }
  
  update() {
    // Move bullet
    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;
    this.position.z += this.direction.z * this.speed;
  }
  
  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(255, 255, 0);
    noStroke();
    sphere(this.size);
    pop();
  }
  
  hits(enemy) {
    // Check if bullet hits enemy
    let d = dist(this.position.x, this.position.z, enemy.position.x, enemy.position.z);
    return d < enemy.size / 2;
  }
  
  isOffScreen() {
    // Check if bullet is too far away
    return dist(this.position.x, this.position.z, player.position.x, player.position.z) > 2000;
  }
}

// Enemy bullet class
class EnemyBullet {
  constructor(x, y, z, dirX, dirY, dirZ) {
    this.position = createVector(x, y, z);
    this.direction = createVector(dirX, dirY, dirZ).normalize();
    this.speed = 10;
    this.size = 5;
  }
  
  update() {
    // Move bullet
    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;
    this.position.z += this.direction.z * this.speed;
  }
  
  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(255, 0, 0);
    noStroke();
    sphere(this.size);
    pop();
  }
  
  hitsPlayer() {
    // Check if bullet hits player
    let d = dist(
      this.position.x, 
      this.position.y, 
      this.position.z, 
      player.position.x, 
      player.position.y + player.height, 
      player.position.z
    );
    return d < 30;
  }
  
  isOffScreen() {
    // Check if bullet is too far away
    return dist(this.position.x, this.position.z, player.position.x, player.position.z) > 2000;
  }
}

// Handle window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Create a favicon to avoid 404 error
function createFavicon() {
  let link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVFhH7ZY9TsNAEIXXJiAhKtwgJSUFVJwAcQGOwBE4AkfgCByBI3AEGhoKJCQkfgRC8m7WmrHXa8deJ0WUfNLI3vfezOysf1IVCoWRaLVaS71e76zf719QD+FzeIf6Cb8ul8urTqdzz/ZkNJvNY4K+EfBnv99/d4NOg2PCvqHHDWbGoWCCvxDwgwscQqPRuKbPPb0unPM4ZAzBP5kZLMRZfxwYc8sMY5fjkDEE/2ZmsBDnk1OwZoYxnwQz4pCZwUKcT07BmhnGfBLMiENmBgtxPjkFa2YY80kwIw6ZGSzE+eQUrJlhzCfBjDhkZrAQ55NTsGaGMZ8EM+KQmcFCnE9OwZoZxnwSzIhDZgYLcT45BWtmGPNJMCMOmRksxPnkFKyZYcwnwYw4ZGawEOeTU7BmhjGfBDPikJnBQpxPTsGaGcZ8EsyIQ2YGC3E+OQVrZhjzSTAjDpkZLMT55BSsmWHMJ8GMOGRmsBDnk1OwZoYxnwQz4pCZwUKcT07BmhnGfBLMiENmBgtxPjkFa2YY80kwIw6ZGSzE+eQUrJlhzCfBjDgUCoVCoVAoFP6dWu0XCmKqgm/JXWEAAAAASUVORK5CYII=';
  document.head.appendChild(link);
}

// Call createFavicon when the window loads
window.addEventListener('load', createFavicon);
