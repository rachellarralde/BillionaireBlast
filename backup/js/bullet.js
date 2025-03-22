// Bullet classes and related functions

// Player bullet class
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
