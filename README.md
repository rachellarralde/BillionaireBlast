# BillionaireBlast 💰💥

A fast-paced 3D first-person shooter game where you hunt down billionaire enemies in an urban environment. Built with p5.js.

![BillionaireBlast Game](assets/splash.png)

## 🎮 Play Now

You can play BillionaireBlast online at: [https://rachellarralde.github.io/billionaireblast/](https://rachellarralde.github.io/billionaireblast/)

## 🎯 How to Play

1. **Click** on the game to start
2. **Move** using WASD keys
3. **Look around** by moving your mouse
4. **Shoot** by clicking the mouse button
5. **Defeat** all enemies to increase your score
6. **Avoid** getting too close to enemies as they'll damage you

## 🛠️ Development

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of HTML, JavaScript, and p5.js (for development)

### Running Locally

1. Clone this repository:

   ```
   git clone https://github.com/rachellarralde/billionaireblast.git
   ```

2. Navigate to the project directory:

   ```
   cd billionaireblast
   ```

3. Start a local server:

   ```
   python -m http.server 8000
   ```

   or any other local server of your choice

4. Open your browser and go to:
   ```
   http://localhost:8000
   ```

### Project Structure

- `index.html`: Main game file containing all game logic
- `assets/`: Directory containing all game assets
  - Enemy images (elon.png, jef.png, trump.png, zuk.png)
  - Sound effects
  - Font files

## 🔧 Customization

You can customize various aspects of the game by modifying the variables in the `index.html` file:

- **Player Speed**: Adjust `player.speed` to change movement speed
- **Enemy Count**: Modify the parameter in `spawnEnemies(count)` to change the number of enemies
- **Bullet Properties**: Change bullet color and size in the `displayBullet` function
- **Health & Damage**: Adjust health and damage values for different difficulty levels

- Built with [p5.js](https://p5js.org/)
- Enemy character designs are parodies used for educational purposes
- Inspired by classic FPS games

---

Created by Rachel Larralde © 2025
