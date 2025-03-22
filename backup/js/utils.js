// Utility functions for the game

// Create a favicon to avoid 404 error
function createFavicon() {
  let link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVFhH7ZY9TsNAEIXXJiAhKtwgJSUFVJwAcQGOwBE4AkfgCByBI3AEGhoKJCQkfgRC8m7WmrHXa8deJ0WUfNLI3vfezOysf1IVCoWRaLVaS71e76zf719QD+FzeIf6Cb8ul8urTqdzz/ZkNJvNY4K+EfBnv99/d4NOg2PCvqHHDWbGoWCCvxDwgwscQqPRuKbPPb0unPM4ZAzBP5kZLMRZfxwYc8sMY5fjkDEE/2ZmsBDnk1OwZoYxnwQz4pCZwUKcT07BmhnGfBLMiENmBgtxPjkFa2YY80kwIw6ZGSzE+eQUrJlhzCfBjDhkZrAQ55NTsGaGMZ8EM+KQmcFCnE9OwZoZxnwSzIhDZgYLcT45BWtmGPNJMCMOmRksxPnkFKyZYcwnwYw4ZGawEOeTU7BmhjGfBDPikJnBQpxPTsGaGcZ8EsyIQ2YGC3E+OQVrZhjzSTAjDpkZLMT55BSsmWHMJ8GMOGRmsBDnk1OwZoYxnwQz4pCZwUKcT07BmhnGfBLMiENmBgtxPjkFa2YY80kwIw6ZGSzE+eQUrJlhzCfBjDgUCoVCoVAoFP6dWu0XCmKqgm/JXWEAAAAASUVORK5CYII=';
  document.head.appendChild(link);
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

// Pointer lock functions
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
    console.log("Pointer locked");
  } else {
    pointerLocked = false;
    console.log("Pointer unlocked");
  }
}

// Handle window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Call createFavicon when the window loads
window.addEventListener('load', createFavicon);
