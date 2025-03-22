# Billionaire Blast - Development Memory

This document keeps track of issues we've encountered and how we solved them.

## Game Controls

### Movement Controls

The game uses WASD keys for movement:
- W: Move forward
- S: Move backward
- A: Move left (strafe)
- D: Move right (strafe)

#### Solution for Left/Right Movement

We fixed the left/right movement by using perpendicular angles with the correct orientation:

```javascript
// Strafe left/right
if (keyIsDown(65)) {
  // A key - move left (perpendicular to viewing direction)
  let moveAngle = player.rotY + PI/2; // 90 degrees to the right
  player.x += sin(moveAngle) * player.speed;
  player.z += cos(moveAngle) * player.speed;
}
if (keyIsDown(68)) {
  // D key - move right (perpendicular to viewing direction)
  let moveAngle = player.rotY - PI/2; // 90 degrees to the left
  player.x += sin(moveAngle) * player.speed;
  player.z += cos(moveAngle) * player.speed;
}
```

**Why this works:**
- For left movement (A key), we use an angle 90° clockwise from the viewing direction
- For right movement (D key), we use an angle 90° counterclockwise from the viewing direction
- This creates proper perpendicular movement relative to where the player is facing

### Camera Controls

The camera is controlled with the mouse:
- Mouse X: Look left/right
- Mouse Y: Look up/down

#### Solution for Up/Down Camera Movement

We fixed the up/down camera movement by inverting the Y-axis:

```javascript
// Mouse moved event for camera rotation
function mouseMoved() {
  if (pointerLocked && gameState === "playing") {
    // Adjust rotation based on mouse movement
    player.rotY -= movedX * 0.002;
    // Invert Y-axis for more intuitive camera control
    player.rotX += movedY * 0.002;
    
    // Limit vertical rotation
    player.rotX = constrain(player.rotX, -PI / 3, PI / 3);
  }
}
```

**Why this works:**
- Adding to player.rotX when the mouse moves down makes the camera look down
- Adding to player.rotX when the mouse moves up makes the camera look up
- This creates a more intuitive control scheme that matches player expectations

## Enemy Positioning

### Enemy Placement on Ground

We fixed enemies appearing in the floor by adjusting their vertical position:

```javascript
// Display enemy
function displayEnemy(enemy) {
  push();
  // Position at the enemy's location, but adjust Y to be on the ground
  translate(enemy.x, enemy.y, enemy.z);
  
  // Make enemy face the player
  let dx = player.x - enemy.x;
  let dz = player.z - enemy.z;
  let angle = atan2(dx, dz);
  rotateY(angle);
  
  // Check if we have the enemy image
  if (enemy.typeName && enemyImages[enemy.typeName]) {
    // Use billboard technique to always face camera
    push();
    // Scale to appropriate size
    let scaleFactor = enemy.size / 200; // Adjust based on image size
    
    // Move the bottom of the billboard to ground level
    translate(0, (-enemy.height * scaleFactor) / 2, 0);
    
    scale(scaleFactor);
    
    // Draw the image as a billboard
    noStroke();
    texture(enemyImages[enemy.typeName]);
    plane(200, 300); // Adjust based on image proportions
    pop();
  } else {
    // Fallback to colored box if image not available
    // Move the bottom of the box to ground level
    translate(0, -enemy.size, 0);
    fill(enemy.color);
    box(enemy.size, enemy.size * 2, enemy.size / 2);
  }
  
  pop();
}
```

**Why this works:**
- We set enemy.y = 0 to place them at ground level
- We use translate(0, (-enemy.height * scaleFactor) / 2, 0) to adjust the billboard position
- This makes the bottom of the billboard align with the ground
- For the fallback box, we use translate(0, -enemy.size, 0) to achieve the same effect

#### Updated Enemy Positioning Fix (March 21, 2025)

We fixed the issue of enemies appearing to sink into the floor by adjusting their initial y-position in the spawnEnemies function:

```javascript
// Spawn enemies
function spawnEnemies(count) {
  for (let i = 0; i < count; i++) {
    let x = random(-1000, 1000);
    let z = random(-1000, 1000);

    // Don't spawn enemies too close to player
    if (dist(x, z, player.x, player.z) > 300) {
      // Randomly select enemy type
      let typeName = random(enemyTypes);

      let enemy = {
        x: x,
        y: -40, // Position enemies slightly above the floor for a natural standing position
        z: z,
        size: 80,
        height: 150, // Height of the enemy
        health: 100,
        speed: random(0.5, 2),
        color: color(255, 0, 0),
        typeName: typeName,
      };
      enemies.push(enemy);
    }
  }
}
```

**Why this works:**
- In p5.js 3D space, negative Y values go up and positive Y values go down
- Setting enemy.y to -40 positions enemies slightly above the ground
- This creates the visual effect of enemies standing on the floor rather than sinking into it
- The value of -40 was determined through testing to find the optimal height where enemies appear to be walking on the floor

**Troubleshooting notes:**
- If enemies appear to be sinking into the floor: decrease the y-value (make it more negative)
- If enemies appear to be floating above the floor: increase the y-value (make it less negative)
- The optimal value may need adjustment if enemy sprites or sizes change

## Asset Loading

### Font Loading

We implemented robust font loading with fallbacks:

```javascript
// Preload function to load assets
function preload() {
  // Load system font
  try {
    gameFont = loadFont(
      "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf"
    );
  } catch (e) {
    console.error("Error loading font:", e);
    // We'll handle this in setup
  }
  
  // Load enemy images
  try {
    for (let type of enemyTypes) {
      enemyImages[type] = loadImage("assets/" + type + ".png");
    }
  } catch (e) {
    console.error("Error loading enemy images:", e);
  }
}

// Setup function
function setup() {
  // Create canvas
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  // Set text font - with fallback
  if (gameFont) {
    textFont(gameFont);
    fontLoaded = true;
  } else {
    // Use fallback approach
    textFont("monospace");
    fontLoaded = true;
  }
  
  // Rest of setup...
}
```

**Why this works:**
- We try to load a web font first
- If that fails, we fall back to a system font
- We track font loading status with the fontLoaded variable
- We only render text when we know a font is available
