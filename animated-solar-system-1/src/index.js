// src/index.js

import { Body, Planet, Moon, sun, planets, moons, getMoonsForPlanet } from './solarSystem.js';

// --- Constants ---
const PLANET_CLICK_RADIUS = 20;
const MOON_CLICK_RADIUS = 12;
const SUN_CLICK_RADIUS = 40;
const ZOOM_MIN = 0.2, ZOOM_MAX = 5.0, ZOOM_STEP = 1.15;

// --- State ---
let zoomedPlanet = null, zoomedMoon = null, zoomLevel = 1.0;
let infoText = "", infoColor = "yellow";
let speed = 0.005;

// --- Canvas Setup ---
const canvas = document.getElementById('solarCanvas');
const ctx = canvas.getContext('2d');

// --- UI Elements ---
const infoLabel = document.getElementById('infoLabel');
const menuBtn = document.getElementById('menuBtn');
const menuModal = document.getElementById('menuModal');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const exitBtn = document.getElementById('exitBtn');

// --- Drawing ---
function drawBody(body) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(body.x, body.y, body.size, 0, 2 * Math.PI);
  ctx.fillStyle = body.color;
  if (body.name === "Sun") {
    ctx.shadowColor = "yellow";
    ctx.shadowBlur = 30;
  }
  ctx.fill();
  ctx.restore();
}


// --- Animation Loop ---
function animate() {
  // Calculate center for zoom/pan
  let centerX = 0, centerY = 0;
  if (zoomedPlanet) {
    centerX = zoomedPlanet.x;
    centerY = zoomedPlanet.y;
  } else if (zoomedMoon) {
    centerX = zoomedMoon.x;
    centerY = zoomedMoon.y;
  }

  // Reset transform and clear canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set transform for zoom and pan
  ctx.setTransform(
    zoomLevel, 0, 0, zoomLevel,
    canvas.width / 2 - centerX * zoomLevel,
    canvas.height / 2 - centerY * zoomLevel
  );

  // Move and draw planets
  planets.forEach((planet, i) => {
    planet.move(speed * (1 - i * 0.08));
    drawBody(planet);
  });

  // Move and draw moons
  moons.forEach(moon => {
    moon.move(speed);
    drawBody(moon);
  });

  // Draw sun
  drawBody(sun);

  requestAnimationFrame(animate);
}



// --- Info Overlay ---
function showInfo(text, color) {
  if (text) {
    infoLabel.style.display = 'block';
    infoLabel.style.color = color;
    infoLabel.textContent = text;
  } else {
    infoLabel.style.display = 'none';
  }
}

// --- Mouse Interaction ---
canvas.addEventListener('click', function(e) {
  // Transform mouse coordinates to world coordinates
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left);
  const my = (e.clientY - rect.top);

  // Undo canvas transform
  let centerX = 0, centerY = 0;
  if (zoomedPlanet) {
    centerX = zoomedPlanet.x;
    centerY = zoomedPlanet.y;
  } else if (zoomedMoon) {
    centerX = zoomedMoon.x;
    centerY = zoomedMoon.y;
  }
  const x = (mx - canvas.width / 2) / zoomLevel + centerX;
  const y = (my - canvas.height / 2) / zoomLevel + centerY;

  // Check planets
  for (let planet of planets) {
    if (Math.hypot(x - planet.x, y - planet.y) < PLANET_CLICK_RADIUS) {
      zoomedPlanet = planet;
      zoomedMoon = null;
      const moonsList = getMoonsForPlanet(planet);
      if (moonsList.length) {
        const moonNames = moonsList.map(m => m.name).join(', ');
        showInfo(`${planet.name}\nMoons: ${moonNames}`, planet.color);
      } else {
        showInfo(`${planet.name}\nNo moons`, planet.color);
      }
      return;
    }
  }
  // Check moons
  for (let moon of moons) {
    if (Math.hypot(x - moon.x, y - moon.y) < MOON_CLICK_RADIUS) {
      zoomedMoon = moon;
      zoomedPlanet = null;
      showInfo(`${moon.name}\nOrbits: ${moon.parent.name}`, moon.color);
      return;
    }
  }
  // Check sun
  if (Math.hypot(x - sun.x, y - sun.y) < SUN_CLICK_RADIUS) {
    zoomedPlanet = zoomedMoon = null;
    showInfo("Sun", "yellow");
    return;
  }
  // Empty space
  zoomedPlanet = zoomedMoon = null;
  showInfo("", "yellow");
});

// --- Mouse Wheel Zoom ---
canvas.addEventListener('wheel', function(e) {
  if (e.deltaY < 0) {
    zoomLevel = Math.min(ZOOM_MAX, zoomLevel * ZOOM_STEP);
  } else {
    zoomLevel = Math.max(ZOOM_MIN, zoomLevel / ZOOM_STEP);
  }
  e.preventDefault();
});

// --- Menu System ---
menuBtn.addEventListener('click', () => {
  menuModal.style.display = 'block';
});
menuModal.addEventListener('mouseleave', () => {
  menuModal.style.display = 'none';
});
speedSlider.addEventListener('input', () => {
  speed = parseFloat(speedSlider.value);
  speedValue.textContent = speed.toFixed(3);
});
exitBtn.addEventListener('click', () => {
  window.close();
});

// --- Initialize ---
speedValue.textContent = speed.toFixed(3);
showInfo("", "yellow");
animate();
