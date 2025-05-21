// src/index.js

import { sun, planets } from './bodies.js';

// --- State ---
let zoomLevel = 1.0;
let speed = 0.005;
let zoomedPlanet = null, zoomedMoon = null;
let viewCenterX = sun.x, viewCenterY = sun.y;
let isPanning = false, lastMouseX = 0, lastMouseY = 0;

// --- Constants ---
const PLANET_CLICK_RADIUS = 20;
const MOON_CLICK_RADIUS = 12;
const SUN_CLICK_RADIUS = 40;
const ZOOM_MIN = 0.2, ZOOM_MAX = 5.0, ZOOM_STEP = 1.15;

// --- Canvas & UI Setup ---
const canvas = document.getElementById('solarCanvas');
const ctx = canvas.getContext('2d');
const infoLabel = document.getElementById('infoLabel');
const menuBtn = document.getElementById('menuBtn');
const menuModal = document.getElementById('menuModal');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const exitBtn = document.getElementById('exitBtn');
const planetButtonsDiv = document.getElementById('planetButtons');


// --- Drawing Helpers ---
function drawBody(body) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(body.x, body.y, body.size, 0, 2 * Math.PI);
  ctx.fillStyle = body.color;

  // Calculate a shadow multiplier: 1 at slowest, 0 at fastest
  // Adjust 0.01 to match your slider's "high speed" value
  const shadowFactor = Math.max(0, 1 - (speed / 0.01));
  // You can tweak 0.01 to match your slider's max value for best effect

  if (body.name === "Sun") {
    ctx.shadowColor = "yellow";
    ctx.shadowBlur = 30 * shadowFactor;
  } else if (body.size > 3) {
    ctx.shadowColor = body.color;
    ctx.shadowBlur = 10 * shadowFactor;
  } else {
    ctx.shadowColor = body.color;
    ctx.shadowBlur = 4 * shadowFactor;
  }

  ctx.fill();
  ctx.restore();
}

function drawPlanetTrail(planet) {
  if (!planet.trail || planet.trail.length < 2) return;
  ctx.save();
  // Fade out trail at high speed: 1 at slow, 0.3 at fast
  const trailAlphaFactor = Math.max(0.3, 1 - (speed / 0.01));
  for (let i = 1; i < planet.trail.length; i++) {
    const t = i / planet.trail.length;
    const alpha = t * 0.35 * trailAlphaFactor;
    const width = Math.max(2, planet.size * 2.00 * t);

    ctx.beginPath();
    ctx.moveTo(planet.trail[i - 1].x, planet.trail[i - 1].y);
    ctx.lineTo(planet.trail[i].x, planet.trail[i].y);
    ctx.strokeStyle = planet.color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.shadowColor = planet.color;
    ctx.shadowBlur = 8 * trailAlphaFactor;
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
  ctx.restore();
}

function drawMoonTrail(moon) {
  if (!moon.trail || moon.trail.length < 2) return;
  ctx.save();
  const trailAlphaFactor = Math.max(0.3, 1 - (speed / 0.01));
  for (let i = 1; i < moon.trail.length; i++) {
    const t = i / moon.trail.length;
    const alpha = t * 0.1 * trailAlphaFactor;
    const width = Math.max(1, moon.size * 1.5 * t);

    ctx.beginPath();
    ctx.moveTo(moon.trail[i - 1].x, moon.trail[i - 1].y);
    ctx.lineTo(moon.trail[i].x, moon.trail[i].y);
    ctx.strokeStyle = moon.color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.shadowColor = moon.color;
    ctx.shadowBlur = 6 * trailAlphaFactor;
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
  ctx.restore();
}



// --- Simulation Update (THROTTLED) ---
function updateSimulation() {
  planets.forEach((planet, i) => {
    planet.orbitalSpeed = speed * (1 - i * 0.08);
    planet.move();
    planet.moons.forEach(moon => {
      moon.orbitalSpeed = speed * (moon.baseOrbitalSpeed / 0.005);
      moon.move(planet);
    });
  });
}

// --- Drawing Only ---
function drawSystem() {
  planets.forEach((planet) => {
    drawPlanetTrail(planet);
    drawBody(planet);
    planet.moons.forEach(moon => {
      drawMoonTrail(moon);
      drawBody(moon);
    });
  });
  drawBody(sun);
}

// --- Info Overlay ---
function showInfo(text, color) {
  if (text) {
    infoLabel.style.display = 'block';
    infoLabel.style.color = color;
    infoLabel.innerHTML = text;
  } else {
    infoLabel.style.display = 'none';
  }
}

// --- Create planet buttons ---
function createPlanetButtons() {
  // Sort planets by orbitalRadius (distance from sun)
  const sortedPlanets = planets.slice().sort((a, b) => a.orbitalRadius - b.orbitalRadius);
  planetButtonsDiv.innerHTML = '';
  sortedPlanets.forEach(planet => {
    const btn = document.createElement('button');
    btn.textContent = planet.name;
    btn.style.borderColor = planet.color;
    btn.onclick = () => {
      zoomedPlanet = planet;
      zoomedMoon = null;
      viewCenterX = planet.x;
      viewCenterY = planet.y;
      // Optionally show info
      const moonNames = planet.moons.map(m => m.name).join(', ');
      let html = `<b>${planet.name}</b><br>`;
      html += `<b>Moons:</b> ${planet.moons.length ? moonNames : "None"}<br>`;
      html += `<i>${planet.description}</i><br>`;
      html += `<b>Myth:</b> ${planet.mythOrigin}`;
      showInfo(html, planet.color);
    };
    planetButtonsDiv.appendChild(btn);
  });
}


// --- Animation Loop with Simulation Throttle ---
let lastSimTime = performance.now();
const SIM_STEP_MS = 1000 / 30; // 30 simulation steps per second

function animate(now = performance.now()) {
  // --- Simulation Throttle ---
  if (now - lastSimTime >= SIM_STEP_MS) {
    updateSimulation();
    lastSimTime += SIM_STEP_MS;
    // If the browser lags, catch up:
    if (now - lastSimTime >= SIM_STEP_MS) {
      lastSimTime = now;
    }
  }

  // --- Drawing ---
  let centerX = zoomedPlanet ? zoomedPlanet.x : zoomedMoon ? zoomedMoon.x : viewCenterX;
  let centerY = zoomedPlanet ? zoomedPlanet.y : zoomedMoon ? zoomedMoon.y : viewCenterY;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.setTransform(
    zoomLevel, 0, 0, zoomLevel,
    canvas.width / 2 - centerX * zoomLevel,
    canvas.height / 2 - centerY * zoomLevel
  );

  drawSystem();
  requestAnimationFrame(animate);
}

// --- Mouse & Interaction Handlers ---
function getWorldCoords(mx, my) {
  let centerX = zoomedPlanet ? zoomedPlanet.x : zoomedMoon ? zoomedMoon.x : viewCenterX;
  let centerY = zoomedPlanet ? zoomedPlanet.y : zoomedMoon ? zoomedMoon.y : viewCenterY;
  return {
    x: (mx - canvas.width / 2) / zoomLevel + centerX,
    y: (my - canvas.height / 2) / zoomLevel + centerY
  };
}


canvas.addEventListener('click', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  const { x, y } = getWorldCoords(mx, my);

  // Planets
  for (let planet of planets) {
    if (Math.hypot(x - planet.x, y - planet.y) < PLANET_CLICK_RADIUS) {
      zoomedPlanet = planet; zoomedMoon = null;
      viewCenterX = planet.x; viewCenterY = planet.y;
      const moonNames = planet.moons.map(m => m.name).join(', ');
      let html = `<b>${planet.name}</b><br>`;
      html += `<b>Moons:</b> ${planet.moons.length ? moonNames : "None"}<br>`;
      html += `<i>${planet.description}</i><br>`;
      html += `<b>Myth:</b> ${planet.mythOrigin}`;
      showInfo(html, planet.color);
      return;
    }
  }
  // Moons
  for (let planet of planets) {
    for (let moon of planet.moons) {
      if (Math.hypot(x - moon.x, y - moon.y) < MOON_CLICK_RADIUS) {
        zoomedMoon = moon; zoomedPlanet = null;
        viewCenterX = moon.x; viewCenterY = moon.y;
        let html = `<b>${moon.name}</b><br>`;
        html += `<b>Orbits:</b> ${planet.name}<br>`;
        html += `<i>${moon.description}</i><br>`;
        html += `<b>Myth:</b> ${moon.mythOrigin}`;
        showInfo(html, moon.color);
        return;
      }
    }
  }
  // Sun
  if (Math.hypot(x - sun.x, y - sun.y) < SUN_CLICK_RADIUS) {
    zoomedPlanet = zoomedMoon = null;
    viewCenterX = sun.x; viewCenterY = sun.y;
    let html = `<b>Sun</b><br>`;
    html += `<i>${sun.description}</i><br>`;
    html += `<b>Myth:</b> ${sun.mythOrigin}`;
    showInfo(html, "yellow");
    return;
  }
  // Empty space
  zoomedPlanet = zoomedMoon = null;
  showInfo("", "yellow");
});

canvas.addEventListener('mousedown', (e) => {
  isPanning = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  zoomedPlanet = null;
  zoomedMoon = null;
});
window.addEventListener('mousemove', (e) => {
  if (!isPanning) return;
  const dx = e.clientX - lastMouseX, dy = e.clientY - lastMouseY;
  viewCenterX -= dx / zoomLevel;
  viewCenterY -= dy / zoomLevel;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});
window.addEventListener('mouseup', () => { isPanning = false; });

canvas.addEventListener('wheel', function(e) {
  if (e.deltaY < 0) zoomLevel = Math.min(ZOOM_MAX, zoomLevel * ZOOM_STEP);
  else zoomLevel = Math.max(ZOOM_MIN, zoomLevel / ZOOM_STEP);
  e.preventDefault();
});

// --- Menu System ---
menuBtn.addEventListener('click', () => { menuModal.style.display = 'block'; });
menuModal.addEventListener('mouseleave', () => { menuModal.style.display = 'none'; });
speedSlider.addEventListener('input', () => {
  speed = parseFloat(speedSlider.value);
  speedValue.textContent = speed.toFixed(3);
});
exitBtn.addEventListener('click', () => { window.close(); });

// --- Initialize ---
speedValue.textContent = speed.toFixed(3);
showInfo("", "yellow");
createPlanetButtons();
animate();
