// Environment generation and rendering

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

function drawGun() {
  push();
  translate(100, 100, 200);
  texture(gunImage);
  plane(300, 200);
  pop();
}
