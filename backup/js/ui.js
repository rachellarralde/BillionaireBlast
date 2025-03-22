// UI elements and screens

// Crosshair class
class Crosshair {
  constructor() {
    this.size = 10;
  }
  
  display() {
    if (gameState !== 'playing') return;
    
    push();
    // Draw in center of screen
    translate(0, 0, 0);
    stroke(255);
    strokeWeight(1);
    noFill();
    // Horizontal line
    line(-this.size/2, 0, this.size/2, 0);
    // Vertical line
    line(0, -this.size/2, 0, this.size/2);
    pop();
  }
}

// Health bar class
class HealthBar {
  constructor() {
    this.width = 100;
    this.height = 10;
  }
  
  display() {
    if (gameState !== 'playing') return;
    
    push();
    // Switch to 2D mode
    translate(-width/2 + 20, height/2 - 30, 0);
    rotateX(0);
    rotateY(0);
    rotateZ(0);
    
    // Background of health bar
    fill(0, 0, 0, 150);
    rect(0, 0, this.width, this.height);
    
    // Health bar fill
    fill(255, 0, 0);
    rect(0, 0, this.width * (health / 100), this.height);
    pop();
  }
}

// Ammo counter class
class AmmoCounter {
  constructor() {
    this.ammo = 30;
    this.maxAmmo = 120;
  }
  
  display() {
    // Skip for now to simplify debugging
  }
}

// Game message class
class GameMessage {
  constructor() {
    this.visible = true;
    this.message = "";
  }
  
  display() {
    if (gameState === 'intro') {
      this.showIntro();
    } else if (gameState === 'gameOver') {
      this.showGameOver();
    } else if (gameState === 'paused') {
      this.showPaused();
    }
  }
  
  showIntro() {
    push();
    // Draw a simple intro screen
    translate(0, 0, -500);
    fill(0, 0, 0, 200);
    plane(width, height);
    
    // Title
    translate(0, -100, 1);
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("BILLIONAIRE BLAST", 0, 0);
    
    // Instructions
    translate(0, 100, 0);
    fill(255);
    textSize(16);
    text("Click to start", 0, 0);
    pop();
  }
  
  showGameOver() {
    push();
    // Draw a simple game over screen
    translate(0, 0, -500);
    fill(0, 0, 0, 200);
    plane(width, height);
    
    // Game over message
    translate(0, -100, 1);
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("GAME OVER", 0, 0);
    
    // Score
    translate(0, 100, 0);
    fill(255);
    textSize(16);
    text("Score: " + score, 0, 0);
    pop();
  }
  
  showPaused() {
    push();
    // Draw a simple pause screen
    translate(0, 0, -500);
    fill(0, 0, 0, 150);
    plane(width, height);
    
    // Paused message
    translate(0, 0, 1);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("PAUSED", 0, 0);
    pop();
  }
}

// Update all UI elements
function updateUI() {
  if (crosshair) crosshair.display();
  if (healthBar) healthBar.display();
  // Skip ammo counter for now
  // if (ammoCounter) ammoCounter.display();
  if (gameMessage) gameMessage.display();
}

// Legacy functions kept for compatibility
function createUI() {
  crosshair = new Crosshair();
  healthBar = new HealthBar();
  ammoCounter = new AmmoCounter();
  gameMessage = new GameMessage();
}

function drawIntroScreen() {
  // Start button event
  gameMessage.mousePressed(() => {
    gameState = 'playing';
    gameMessage.visible = false;
    healthBar.display();
    ammoCounter.display();
    
    // Spawn initial enemies
    spawnEnemies(5);
    
    // Lock pointer
    lockPointer();
  });
}

function drawPauseScreen() {
  // Semi-transparent overlay
  push();
  translate(0, 0, -100);
  fill(0, 0, 0, 150);
  plane(width * 2, height * 2);
  pop();
}

function drawGameOverScreen() {
  // Restart button event
  gameMessage.mousePressed(() => {
    resetGame();
    gameState = 'playing';
    gameMessage.visible = false;
    healthBar.display();
    ammoCounter.display();
  });
}
