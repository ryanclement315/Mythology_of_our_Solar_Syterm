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
export const sun = new Body("Sun", "yellow", 30, 0, 0);

// Scaling factor to fit the solar system on the canvas
const ORBIT_SCALE = 2.5; // Try 2.5, adjust as needed for your canvas size

export const planetData = [
  ['Mercury', 'gray', 5, 57.13 / ORBIT_SCALE],
  ['Venus', 'orange', 8, 74.13 / ORBIT_SCALE],
  ['Earth', 'blue', 9, 76.13 / ORBIT_SCALE],
  ['Mars', 'red', 7, 62.13 / ORBIT_SCALE],
  ['Jupiter', 'tan', 18, 137.13 / ORBIT_SCALE],
  ['Saturn', 'gold', 16, 153.13 / ORBIT_SCALE],
  ['Uranus', 'lightblue', 13, 183.13 / ORBIT_SCALE],
  ['Neptune', 'purple', 13, 200.0 / ORBIT_SCALE]
];

export const planets = planetData.map(
  ([name, color, size, radius], i) => new Planet(name, color, size, radius, Math.random() * Math.PI * 2)
);

export const moonSpecs = [
  ["Moon", "white", 3, 16.13 / ORBIT_SCALE, 2, 5],
  ["Phobos", "lightgray", 1.5, 7.0 / ORBIT_SCALE, 3, 10],
  ["Deimos", "lightgray", 1.5, 7.44 / ORBIT_SCALE, 3, 7],
  ["Io", "orange", 3, 12.01 / ORBIT_SCALE, 4, 7],
  ["Europa", "white", 2.5, 13.13 / ORBIT_SCALE, 4, 5],
  ["Ganymede", "gray", 3.5, 15.13 / ORBIT_SCALE, 4, 4],
  ["Callisto", "darkgray", 3.5, 18.99 / ORBIT_SCALE, 4, 3],
  ["Titan", "khaki", 3.5, 14.13 / ORBIT_SCALE, 5, 5],
  ["Titania", "lightgray", 2, 10.13 / ORBIT_SCALE, 6, 6],
  ["Triton", "lightblue", 2, 9.13 / ORBIT_SCALE, 7, 7]
];

export const moons = moonSpecs.map(
  ([name, color, size, radius, parentIdx, speedf]) =>
    new Moon(name, color, size, radius, planets[parentIdx], speedf, Math.random() * Math.PI * 2)
);


export function getMoonsForPlanet(planet) {
  return moons.filter(moon => moon.parent === planet);
}
