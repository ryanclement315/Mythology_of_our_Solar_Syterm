// src/solarSystem.js

export class Body {
  constructor(name, color, size, x, y) {
    this.name = name;
    this.color = color;
    this.baseSize = size;
    this.x = x;
    this.y = y;
    this.size = size;
  }
  setSize(scale) {
    this.size = this.baseSize * scale;
  }
  position() {
    return { x: this.x, y: this.y };
  }
}

export class Planet extends Body {
  constructor(name, color, size, orbitalRadius, angle = 0) {
    super(name, color, size, orbitalRadius, 0);
    this.orbitalRadius = orbitalRadius;
    this.angle = angle;
  }
  move(speed = 0.01) {
    this.angle += speed;
    this.x = this.orbitalRadius * Math.cos(this.angle);
    this.y = this.orbitalRadius * Math.sin(this.angle);
  }
}

export class Moon extends Body {
  constructor(name, color, size, orbitalRadius, parent, speedFactor = 5, angle = 0) {
    super(name, color, size, 0, 0);
    this.orbitalRadius = orbitalRadius;
    this.parent = parent;
    this.angle = angle;
    this.speedFactor = speedFactor;
  }
  move(baseSpeed = 0.01) {
    this.angle += baseSpeed * this.speedFactor;
    const px = this.parent.x;
    const py = this.parent.y;
    this.x = px + this.orbitalRadius * Math.cos(this.angle);
    this.y = py + this.orbitalRadius * Math.sin(this.angle);
  }
}

// Solar system data
// src/solarSystem.js

const ORBIT_SCALE = 0.5; // Adjust as needed for your canvas

export const sun = new Body("Sun", "yellow", 30, 0, 0);

// src/solarSystem.js

const PLANET_AU = [
  ['Mercury', 'gray', 5, 0.39],
  ['Venus', 'orange', 8, 0.72],
  ['Earth', 'blue', 9, 1.00],
  ['Mars', 'red', 7, 1.52],
  ['Jupiter', 'tan', 18, 5.20],
  ['Saturn', 'gold', 16, 9.58],
  ['Uranus', 'lightblue', 13, 19.18],
  ['Neptune', 'purple', 13, 30.07]
];

const minAU = 1.00;
const maxAU = 40.07;
const minPx = 125;   // Minimum distance from sun (pixels)
const maxPx = 400;  // Maximum distance from sun (pixels)

function scaleAU(au) {
  const logMin = Math.log10(minAU);
  const logMax = Math.log10(maxAU);
  const logAU = Math.log10(au);
  return minPx + ((logAU - logMin) / (logMax - logMin)) * (maxPx - minPx);
}

export const planetData = PLANET_AU.map(
  ([name, color, size, au]) => [name, color, size, scaleAU(au)]
);

export const planets = planetData.map(
  ([name, color, size, radius], i) => new Planet(name, color, size, radius, Math.random() * Math.PI * 2)
);


function moonOrbitRadius(planetIdx, moonIdx, moonSize) {
  const planet = planetData[planetIdx];
  const planetRadius = planet[3]; // already scaled
  const planetSize = planet[2];
  const gap = 8;
  return planetRadius + planetSize + gap + moonIdx * (moonSize + gap);
}

export const moonSpecs = [
  // [name, color, size, planetIdx, speedFactor]
  ["Moon", "white", 3, 2, 5],         // Earth's moon
  ["Phobos", "lightgray", 1.5, 3, 10],// Mars
  ["Deimos", "lightgray", 1.5, 3, 7], // Mars
  ["Io", "orange", 3, 4, 7],          // Jupiter
  ["Europa", "white", 2.5, 4, 5],     // Jupiter
  ["Ganymede", "gray", 3.5, 4, 4],    // Jupiter
  ["Callisto", "darkgray", 3.5, 4, 3],// Jupiter
  ["Titan", "khaki", 3.5, 5, 5],      // Saturn
  ["Titania", "lightgray", 2, 6, 6],  // Uranus
  ["Triton", "lightblue", 2, 7, 7]    // Neptune
];

// Group moons by planet for offset calculation
const moonsByPlanet = {};
moonSpecs.forEach(([name, color, size, planetIdx, speedFactor], i) => {
  if (!moonsByPlanet[planetIdx]) moonsByPlanet[planetIdx] = [];
  moonsByPlanet[planetIdx].push({ name, color, size, planetIdx, speedFactor });
});

export const moons = [];
Object.entries(moonsByPlanet).forEach(([planetIdx, moonList]) => {
  moonList.forEach((moon, moonIdx) => {
    const radius = moonOrbitRadius(Number(planetIdx), moonIdx, moon.size);
    moons.push(
      new Moon(
        moon.name,
        moon.color,
        moon.size,
        radius,
        planets[moon.planetIdx],
        moon.speedFactor,
        Math.random() * Math.PI * 2
      )
    );
  });
});

export function getMoonsForPlanet(planet) {
  return moons.filter(moon => moon.parent === planet);
}

