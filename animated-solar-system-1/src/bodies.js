// src/bodies.js

import { Planet, Moon } from './solarSystem.js';

// --- Scaling Factors (adjust as needed) ---
const PLANET_DISTANCE_SCALE = 120;
const PLANET_SIZE_SCALE = 1.5;

// --- Sun ---
export const sun = {
  name: "Sun",
  color: "yellow",
  size: 30 * PLANET_SIZE_SCALE,
  x: 0,
  y: 0,
  description: "The star at the center of our solar system.",
  mythOrigin: "Named after the Old English 'sunne', related to the goddess Sol."
};

// --- Planets and Moons ---
export const planets = [
  new Planet({
    name: "Earth",
    color: "blue",
    size: 9 * PLANET_SIZE_SCALE,
    orbitalRadius: 1.0 * PLANET_DISTANCE_SCALE,
    orbitalSpeed: 0.01,
    description: "Our home planet, the third from the Sun.",
    mythOrigin: "Named after the Germanic word for 'ground' or 'soil'.",
    moons: [
      new Moon({
        name: "Moon",
        color: "white",
        size: 3 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.12 * PLANET_DISTANCE_SCALE + 9 * PLANET_SIZE_SCALE + 10,
        orbitalSpeed: 0.05,
        description: "Earth's only natural satellite. Average distance: 384,400 km.",
        mythOrigin: "Old English 'mōna', related to measurement of months."
      })
    ]
  }),
  new Planet({
    name: "Mars",
    color: "red",
    size: 7 * PLANET_SIZE_SCALE,
    orbitalRadius: 1.52 * PLANET_DISTANCE_SCALE,
    orbitalSpeed: 0.008,
    description: "The red planet, fourth from the Sun.",
    mythOrigin: "Named after the Roman god of war.",
    moons: [
      new Moon({
        name: "Phobos",
        color: "lightgray",
        size: 1.5 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.08 * PLANET_DISTANCE_SCALE + 7 * PLANET_SIZE_SCALE + 10,
        orbitalSpeed: 0.09,
        description: "Larger and closer of Mars' two moons.",
        mythOrigin: "Named after the Greek god of fear."
      }),
      new Moon({
        name: "Deimos",
        color: "lightgray",
        size: 1.5 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.12 * PLANET_DISTANCE_SCALE + 7 * PLANET_SIZE_SCALE + 20,
        orbitalSpeed: 0.07,
        description: "Smaller and farther of Mars' two moons.",
        mythOrigin: "Named after the Greek god of terror."
      })
    ]
  }),
  // ...add more planets and moons as needed
];
