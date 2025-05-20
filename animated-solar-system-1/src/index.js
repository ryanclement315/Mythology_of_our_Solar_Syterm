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

// --- Drawing Helpers ---
function drawBody(body) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(body.x, body.y, body.size, 0, 2 * Math.PI);
  ctx.fillStyle = body.color;

  // Sun: strong glow
  if (body.name === "Sun") {
    ctx.shadowColor = "yellow";
    ctx.shadowBlur = 30;
  }
  // Planets: medium glow
  else if (body.size > 3) { // Planets are larger than moons in your data
    ctx.shadowColor = body.color;
    ctx.shadowBlur = 10;
  }
  // Moons: subtle glow
  else {
    ctx.shadowColor = body.color;
    ctx.shadowBlur = 4;
  }

  ctx.fill();
  ctx.restore();
}

function drawPlanetTrail(planet) {
  if (!planet.trail || planet.trail.length < 2) return;
  ctx.save();
  for (let i = 1; i < planet.trail.length; i++) {
    const t = i / planet.trail.length;
    const alpha = t * 0.35; // Fainter than moons if you like
    const width = Math.max(2, planet.size * 2.00 * t); // Taper: thickest at planet, thinnest at tail

    ctx.beginPath();
    ctx.moveTo(planet.trail[i - 1].x, planet.trail[i - 1].y);
    ctx.lineTo(planet.trail[i].x, planet.trail[i].y);
    ctx.strokeStyle = planet.color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.shadowColor = planet.color;
    ctx.shadowBlur = 8;
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
  ctx.restore();
}


function drawMoonTrail(moon) {
  if (!moon.trail || moon.trail.length < 2) return;
  ctx.save();
  for (let i = 1; i < moon.trail.length; i++) {
    const t = i / moon.trail.length; // 0 (tail) ... 1 (head, near moon)
    const alpha = t * 0.1; // 0.1 = max opacity at the head
    // Taper: thickest at the head (moon), thinnest at the tail
    const width = Math.max(1, moon.size * 1.5 * t);

    ctx.beginPath();
    ctx.moveTo(moon.trail[i - 1].x, moon.trail[i - 1].y);
    ctx.lineTo(moon.trail[i].x, moon.trail[i].y);
    ctx.strokeStyle = moon.color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.shadowColor = moon.color;
    ctx.shadowBlur = 6;
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
  ctx.restore();
}




function drawSystem() {
  planets.forEach((planet, i) => {
    planet.orbitalSpeed = speed * (1 - i * 0.08);
    planet.move();
    drawPlanetTrail(planet);
    drawBody(planet);
    planet.moons.forEach(moon => {
      moon.orbitalSpeed = speed * (moon.baseOrbitalSpeed / 0.005);
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

// --- Animation Loop ---
function animate() {
  // Determine center (for zoom/pan/centering)
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
animate();
