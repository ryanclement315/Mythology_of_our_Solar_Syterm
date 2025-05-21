// =======================
// 1. Imports
// =======================
import { sun, planets } from './bodies.js';

// =======================
// 2. Global State
// =======================
let zoomLevel = 1.0;
let speed = 0.005; // Default (mid) speed, matches slider value
let zoomedPlanet = null, zoomedMoon = null;
let viewCenterX = sun.x, viewCenterY = sun.y;
let isPanning = false, lastMouseX = 0, lastMouseY = 0;

// =======================
// 3. Constants
// =======================
const PLANET_CLICK_RADIUS = 20;
const MOON_CLICK_RADIUS = 12;
const SUN_CLICK_RADIUS = 40;
const ZOOM_MIN = 0.2, ZOOM_MAX = 5.0, ZOOM_STEP = 1.15;
const SIM_STEP_MS = 1000 / 30; // 30 simulation steps per second

// =======================
// 4. DOM Elements
// =======================
const canvas = document.getElementById('solarCanvas');
const ctx = canvas.getContext('2d');
const infoLabel = document.getElementById('infoLabel');
const speedSlider = document.getElementById('speedSlider');
const planetButtonsDiv = document.getElementById('planetButtons');

// =======================
// 5. Drawing Helpers
// =======================
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
    ctx.shadowBlur = 20; // Always full glow for the Sun, not affected by speed
  } else if (body.size > 3) {
    ctx.shadowColor = body.color;
    ctx.shadowBlur = 10 * shadowFactor;
  } else {
    ctx.shadowColor = body.color;
    ctx.shadowBlur = 4 * shadowFactor;
  }
  if (body._glow) {
    ctx.shadowColor = body.color; // Use the planet's color for the glow
    ctx.shadowBlur = 40;
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
    const alpha = t * 0.9 * trailAlphaFactor; // Less opaque (was 0.1)
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

// =======================
// 6. Simulation Logic
// =======================
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
      // Show moon trails if:
      // - The parent planet is focused (zoomedPlanet === planet)
      // - OR a moon of this planet is focused (zoomedMoon && planet.moons.includes(zoomedMoon))
      if (
        zoomedPlanet === planet ||
        (zoomedMoon && planet.moons.includes(zoomedMoon))
      ) {
        drawMoonTrail(moon);
      }
      drawBody(moon);
    });
  });
  drawBody(sun);
}

// =======================
// 7. Info Overlay & UI Helpers
// =======================
// --- Info Overlay ---
function showInfo(text, color) {
  if (text) {
    infoLabel.classList.add('show');
    infoLabel.innerHTML = text;
  } else {
    infoLabel.classList.remove('show');
  }
}

// --- Create planet buttons ---
function createPlanetButtons() {
  // Sort planets by orbitalRadius (distance from sun)
  const sortedPlanets = planets.slice().sort((a, b) => a.orbitalRadius - b.orbitalRadius);
  planetButtonsDiv.innerHTML = '';
  sortedPlanets.forEach(planet => {
    const btn = document.createElement('button');
    btn.setAttribute("data-planet", planet.name);
    btn.textContent = ""; // No text
    btn.style.background = planet.color; // Only set background color, let CSS handle the rest

    btn.onclick = () => {
      zoomedPlanet = planet;
      zoomedMoon = null;
      viewCenterX = planet.x;
      viewCenterY = planet.y;
      // Make moon names clickable
      const moonNames = planet.moons.map(m =>
        `<span class="moon-link" data-moon="${m.name}" style="color:${m.color};cursor:pointer;text-decoration:underline;">${m.name}</span>`
      ).join(', ');
      let html = `<b>${planet.name}</b><br>`;
      html += `<span><b>Moons:</b> ${planet.moons.length ? moonNames : "None"}</span><br>`;
      html += `<i>${planet.description}</i>`;
      html += `<span class="myth"><b>Myth:</b> ${planet.mythOrigin}</span>`;
      showInfo(html, planet.color);

      // Add event listeners to moon links after rendering
      setTimeout(() => {
        document.querySelectorAll('.moon-link').forEach(link => {
          link.onclick = (e) => {
            const moonName = link.getAttribute('data-moon');
            const moon = planet.moons.find(m => m.name === moonName);
            if (moon) {
              zoomedMoon = moon;
              zoomedPlanet = null;
              viewCenterX = moon.x;
              viewCenterY = moon.y;
              let moonHtml = `<b>${moon.name}</b><br>`;
              moonHtml += `<b>Orbits:</b> ${planet.name}<br>`;
              moonHtml += `<i>${moon.description}</i><br>`;
              moonHtml += `<b>Myth:</b> ${moon.mythOrigin}`;
              showInfo(moonHtml, moon.color);
              // Remove glow from all moons first
              planets.forEach(p => p.moons.forEach(m => m._glow = false));
              // Set glow for the focused moon
              moon._glow = true;
            }
            e.stopPropagation();
          };
        });
      }, 0);
    };

    btn.addEventListener("mouseenter", () => {
      btn.classList.add("glow");
      btn.style.setProperty('--glow-color', planet.color); // Set the glow color
      planet._glow = true;
    });
    btn.addEventListener("mouseleave", () => {
      btn.classList.remove("glow");
      btn.style.removeProperty('--glow-color');
      planet._glow = false;
    });

    planetButtonsDiv.appendChild(btn);
  });
}

// =======================
// 8. Animation Loop
// =======================
// --- Animation Loop with Simulation Throttle ---
let lastSimTime = performance.now();

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

// =======================
// 9. Event Handlers
// =======================
// --- Mouse & Interaction Handlers ---

// Convert screen (mouse) coordinates to world (solar system) coordinates
function getWorldCoords(mx, my) {
  let centerX = zoomedPlanet ? zoomedPlanet.x : zoomedMoon ? zoomedMoon.x : viewCenterX;
  let centerY = zoomedPlanet ? zoomedPlanet.y : zoomedMoon ? zoomedMoon.y : viewCenterY;
  return {
    x: (mx - canvas.width / 2) / zoomLevel + centerX,
    y: (my - canvas.height / 2) / zoomLevel + centerY
  };
}

// Handle clicks: select planet, moon, sun, or clear selection
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
      html += `<span><b>Moons:</b> ${planet.moons.length ? moonNames : "None"}</span><br>`;
      html += `<i>${planet.description}</i>`;
      html += `<span class="myth"><b>Myth:</b> ${planet.mythOrigin}</span>`;
      showInfo(html, planet.color);
      // Remove glow from all moons
      planets.forEach(p => p.moons.forEach(m => m._glow = false));
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
        // Remove glow from all moons first
        planets.forEach(p => p.moons.forEach(m => m._glow = false));
        // Set glow for the focused moon
        moon._glow = true;
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
    // Remove glow from all moons
    planets.forEach(p => p.moons.forEach(m => m._glow = false));
    return;
  }
  // Empty space
  zoomedPlanet = zoomedMoon = null;
  showInfo("", "yellow");
  // Remove glow from all moons
  planets.forEach(p => p.moons.forEach(m => m._glow = false));
});

// Panning (drag to move view)
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

// Zooming (mouse wheel)
canvas.addEventListener('wheel', function(e) {
  if (e.deltaY < 0) zoomLevel = Math.min(ZOOM_MAX, zoomLevel * ZOOM_STEP);
  else zoomLevel = Math.max(ZOOM_MIN, zoomLevel / ZOOM_STEP);
  e.preventDefault();
});

// =======================
// 10. Menu & UI Events
// =======================
// Update simulation speed when slider changes
speedSlider.addEventListener('input', () => {
  speed = parseFloat(speedSlider.value);
});

// =======================
// 11. Initialization
// =======================
showInfo("", "yellow");
createPlanetButtons();
animate();
