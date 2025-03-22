// Player class and related functions

class Player {
  constructor() {
    this.position = createVector(0, 0, 0);
    this.direction = createVector(0, 0, -1);
    this.up = createVector(0, 1, 0);
    this.speed = 5;
    this.sensitivity = 0.002;
    this.height = -50; // Eye level
    this.isMoving = false;
    
    // Key states for movement
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false
    };
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
    this.isMoving = false;
    
    // Update key states from keyboard
    this.keys.w = keyIsDown(87); // W
    this.keys.a = keyIsDown(65); // A
    this.keys.s = keyIsDown(83); // S
    this.keys.d = keyIsDown(68); // D
    
    // Get forward and right vectors for movement
    let forwardVector = createVector(this.direction.x, 0, this.direction.z).normalize();
    let rightVector = createVector(forwardVector.z, 0, -forwardVector.x);
    
    // Forward/backward (W/S)
    if (this.keys.w) { // W key - move forward
      this.position.x += forwardVector.x * this.speed;
      this.position.z += forwardVector.z * this.speed;
      this.isMoving = true;
    }
    if (this.keys.s) { // S key - move backward
      this.position.x -= forwardVector.x * this.speed;
      this.position.z -= forwardVector.z * this.speed;
      this.isMoving = true;
    }
    
    // Left/right (A/D)
    if (this.keys.a) { // A key - move left
      this.position.x -= rightVector.x * this.speed;
      this.position.z -= rightVector.z * this.speed;
      this.isMoving = true;
    }
    if (this.keys.d) { // D key - move right
      this.position.x += rightVector.x * this.speed;
      this.position.z += rightVector.z * this.speed;
      this.isMoving = true;
    }
    
    // Collision detection with buildings
    if (this.isMoving) {
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

// Add key event handlers to the window
window.keyPressed = function() {
  // ESC key to toggle pointer lock
  if (keyCode === ESCAPE) {
    if (pointerLocked) {
      document.exitPointerLock();
    } else {
      lockPointer();
    }
    return false; // Prevent default behavior
  }
  
  // SPACE key to toggle pause
  if (keyCode === 32) { // SPACE
    if (gameState === 'playing') {
      gameState = 'paused';
    } else if (gameState === 'paused') {
      gameState = 'playing';
    }
    return false; // Prevent default behavior
  }
};

// Shoot function
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
  
  // Play gunshot sound effect
  playGunshot();
}
