// Enemy class and related functions

class Enemy {
  constructor(x, z, type) {
    this.position = createVector(x, 0, z);
    this.type = type;
    this.health = 100;
    this.size = 100;
    this.lastShot = 0;
    this.shootInterval = random(1000, 3000);
    this.speed = random(0.5, 1.5);
    
    // Store the enemy type name for texture lookup
    this.typeName = enemyTypes[type];
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
    
    // Draw enemy with the correct texture
    if (window.enemyImages && window.enemyImages[this.typeName]) {
      texture(window.enemyImages[this.typeName]);
      plane(this.size, this.size * 1.5);
    } else {
      // Fallback to colored rectangle if texture isn't available
      fill(255, 0, 0);
      noStroke();
      plane(this.size, this.size * 1.5);
    }
    
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
