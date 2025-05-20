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
  // Mercury (no moons)
  new Planet({
    name: "Mercury",
    color: "#b5b5b5",
    size: 5 * PLANET_SIZE_SCALE,
    orbitalRadius: 0.39 * PLANET_DISTANCE_SCALE,
    orbitalSpeed: 0.017,
    description: "The smallest planet and closest to the Sun.",
    mythOrigin: "Named after the Roman messenger god.",
    moons: []
  }),
  // Venus (no moons)
  new Planet({
    name: "Venus",
    color: "#e3c16f",
    size: 8 * PLANET_SIZE_SCALE,
    orbitalRadius: 0.72 * PLANET_DISTANCE_SCALE,
    orbitalSpeed: 0.013,
    description: "Second planet from the Sun, shrouded in thick clouds.",
    mythOrigin: "Named after the Roman goddess of love and beauty.",
    moons: []
  }),
  // Earth
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
  // Mars
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
  // Jupiter (5 major moons)
  new Planet({
    name: "Jupiter",
    color: "#e6c97b",
    size: 20 * PLANET_SIZE_SCALE,
    orbitalRadius: 5.20 * PLANET_DISTANCE_SCALE,
    orbitalSpeed: 0.004,
    description: "The largest planet, a gas giant with a prominent Great Red Spot.",
    mythOrigin: "Named after the king of the Roman gods.",
    moons: [
      new Moon({
        name: "Io",
        color: "#f4e285",
        size: 2.5 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.17 * PLANET_DISTANCE_SCALE + 20 * PLANET_SIZE_SCALE + 12,
        orbitalSpeed: 0.13,
        description: "Most volcanically active body in the solar system.",
        mythOrigin: "Named after a priestess of Hera loved by Zeus."
      }),
      new Moon({
        name: "Europa",
        color: "#c9e0e6",
        size: 2.2 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.22 * PLANET_DISTANCE_SCALE + 20 * PLANET_SIZE_SCALE + 20,
        orbitalSpeed: 0.10,
        description: "Icy surface with a subsurface ocean.",
        mythOrigin: "Named after a Phoenician princess loved by Zeus."
      }),
      new Moon({
        name: "Ganymede",
        color: "#bdbdbd",
        size: 3 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.28 * PLANET_DISTANCE_SCALE + 20 * PLANET_SIZE_SCALE + 32,
        orbitalSpeed: 0.08,
        description: "Largest moon in the solar system.",
        mythOrigin: "Named after a Trojan prince abducted by Zeus."
      }),
      new Moon({
        name: "Callisto",
        color: "#a6a6a6",
        size: 2.7 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.35 * PLANET_DISTANCE_SCALE + 20 * PLANET_SIZE_SCALE + 45,
        orbitalSpeed: 0.06,
        description: "Heavily cratered and ancient surface.",
        mythOrigin: "Named after a nymph loved by Zeus."
      }),
      new Moon({
        name: "Amalthea",
        color: "#e4cab0",
        size: 1.5 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.12 * PLANET_DISTANCE_SCALE + 20 * PLANET_SIZE_SCALE + 55,
        orbitalSpeed: 0.16,
        description: "A small, reddish, irregular moon.",
        mythOrigin: "Named after the nymph who nursed infant Zeus."
      })
    ]
  }),
  // Saturn (5 major moons)
  new Planet({
    name: "Saturn",
    color: "#f4debc",
    size: 16 * PLANET_SIZE_SCALE,
    orbitalRadius: 9.58 * PLANET_DISTANCE_SCALE,
    orbitalSpeed: 0.003,
    description: "Famous for its extensive ring system.",
    mythOrigin: "Named after the Roman god of agriculture.",
    moons: [
      new Moon({
        name: "Titan",
        color: "#e3c16f",
        size: 2.8 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.27 * PLANET_DISTANCE_SCALE + 16 * PLANET_SIZE_SCALE + 12,
        orbitalSpeed: 0.05,
        description: "Largest Saturnian moon; thick atmosphere.",
        mythOrigin: "Named after the Titans of Greek mythology."
      }),
      new Moon({
        name: "Rhea",
        color: "#e3e3e3",
        size: 2 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.18 * PLANET_DISTANCE_SCALE + 16 * PLANET_SIZE_SCALE + 20,
        orbitalSpeed: 0.09,
        description: "Second-largest Saturnian moon.",
        mythOrigin: "Named after the mother of the gods in Greek mythology."
      }),
      new Moon({
        name: "Iapetus",
        color: "#d8c792",
        size: 1.8 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.36 * PLANET_DISTANCE_SCALE + 16 * PLANET_SIZE_SCALE + 30,
        orbitalSpeed: 0.03,
        description: "Known for its two-tone coloration.",
        mythOrigin: "Named after a Titan in Greek mythology."
      }),
      new Moon({
        name: "Dione",
        color: "#f0f0f0",
        size: 1.5 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.13 * PLANET_DISTANCE_SCALE + 16 * PLANET_SIZE_SCALE + 40,
        orbitalSpeed: 0.13,
        description: "Icy moon with bright wispy features.",
        mythOrigin: "Named after a Titaness in Greek mythology."
      }),
      new Moon({
        name: "Enceladus",
        color: "#fafcff",
        size: 1.2 * PLANET_SIZE_SCALE,
        orbitalRadius: 0.10 * PLANET_DISTANCE_SCALE + 16 * PLANET_SIZE_SCALE + 47,
        orbitalSpeed: 0.17,
        description: "Geologically active; icy geysers.",
        mythOrigin: "Named after a giant in Greek mythology."
      })
    ]
  }),

  // Uranus (5 major moons)
new Planet({
  name: "Uranus",
  color: "#b5e3e3",
  size: 13 * PLANET_SIZE_SCALE,
  orbitalRadius: 19.18 * PLANET_DISTANCE_SCALE,
  orbitalSpeed: 0.002,
  description: "An ice giant with a blue-green hue and a tilted axis.",
  mythOrigin: "Named after the Greek god of the sky.",
  moons: [
    new Moon({
      name: "Miranda",
      color: "#e0e0e0",
      size: 1.2 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.10 * PLANET_DISTANCE_SCALE + 13 * PLANET_SIZE_SCALE + 10,
      orbitalSpeed: 0.16,
      description: "Known for its extreme and varied surface features.",
      mythOrigin: "Named after a character in Shakespeare's 'The Tempest'."
    }),
    new Moon({
      name: "Ariel",
      color: "#d0f0ff",
      size: 1.4 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.13 * PLANET_DISTANCE_SCALE + 13 * PLANET_SIZE_SCALE + 18,
      orbitalSpeed: 0.13,
      description: "One of the brightest moons of Uranus.",
      mythOrigin: "Named after a spirit in Shakespeare's 'The Tempest'."
    }),
    new Moon({
      name: "Umbriel",
      color: "#b0b0b0",
      size: 1.3 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.16 * PLANET_DISTANCE_SCALE + 13 * PLANET_SIZE_SCALE + 26,
      orbitalSpeed: 0.11,
      description: "A dark moon with mysterious surface features.",
      mythOrigin: "Named after a character in Alexander Pope's 'The Rape of the Lock'."
    }),
    new Moon({
      name: "Titania",
      color: "#e5e5e5",
      size: 1.8 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.20 * PLANET_DISTANCE_SCALE + 13 * PLANET_SIZE_SCALE + 34,
      orbitalSpeed: 0.09,
      description: "The largest moon of Uranus.",
      mythOrigin: "Named after the queen of the fairies in Shakespeare's 'A Midsummer Night's Dream'."
    }),
    new Moon({
      name: "Oberon",
      color: "#cccccc",
      size: 1.7 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.24 * PLANET_DISTANCE_SCALE + 13 * PLANET_SIZE_SCALE + 42,
      orbitalSpeed: 0.07,
      description: "Second largest Uranian moon, heavily cratered.",
      mythOrigin: "Named after the king of the fairies in Shakespeare's 'A Midsummer Night's Dream'."
    })
  ]
}),
// Neptune (5 major moons)
new Planet({
  name: "Neptune",
  color: "#4b70dd",
  size: 12 * PLANET_SIZE_SCALE,
  orbitalRadius: 30.07 * PLANET_DISTANCE_SCALE,
  orbitalSpeed: 0.001,
  description: "The farthest known major planet, a deep blue ice giant.",
  mythOrigin: "Named after the Roman god of the sea.",
  moons: [
    new Moon({
      name: "Triton",
      color: "#b0d0ff",
      size: 2.1 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.13 * PLANET_DISTANCE_SCALE + 12 * PLANET_SIZE_SCALE + 10,
      orbitalSpeed: 0.10,
      description: "Largest Neptune moon, retrograde orbit, likely a captured Kuiper Belt object.",
      mythOrigin: "Named after the son of Poseidon in Greek mythology."
    }),
    new Moon({
      name: "Proteus",
      color: "#b0b0b0",
      size: 1.2 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.16 * PLANET_DISTANCE_SCALE + 12 * PLANET_SIZE_SCALE + 18,
      orbitalSpeed: 0.08,
      description: "Second largest Neptunian moon, irregular shape.",
      mythOrigin: "Named after a sea god in Greek mythology."
    }),
    new Moon({
      name: "Nereid",
      color: "#e0e0e0",
      size: 1.1 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.20 * PLANET_DISTANCE_SCALE + 12 * PLANET_SIZE_SCALE + 26,
      orbitalSpeed: 0.04,
      description: "Has a highly eccentric orbit.",
      mythOrigin: "Named after the sea nymphs in Greek mythology."
    }),
    new Moon({
      name: "Larissa",
      color: "#cccccc",
      size: 1.0 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.10 * PLANET_DISTANCE_SCALE + 12 * PLANET_SIZE_SCALE + 34,
      orbitalSpeed: 0.12,
      description: "Discovered by Voyager 2 in 1981.",
      mythOrigin: "Named after a lover of Poseidon in Greek mythology."
    }),
    new Moon({
      name: "Despina",
      color: "#dddddd",
      size: 0.9 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.08 * PLANET_DISTANCE_SCALE + 12 * PLANET_SIZE_SCALE + 42,
      orbitalSpeed: 0.14,
      description: "One of Neptune's inner moons.",
      mythOrigin: "Named after a nymph, daughter of Poseidon."
    })
  ]
}),
// Pluto (dwarf planet, 5 moons)
new Planet({
  name: "Pluto",
  color: "#c2b280",
  size: 3.5 * PLANET_SIZE_SCALE,
  orbitalRadius: 39.48 * PLANET_DISTANCE_SCALE,
  orbitalSpeed: 0.0007,
  description: "A dwarf planet in the Kuiper Belt, formerly the ninth planet.",
  mythOrigin: "Named after the Roman god of the underworld.",
  moons: [
    new Moon({
      name: "Charon",
      color: "#b0b0b0",
      size: 1.8 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.06 * PLANET_DISTANCE_SCALE + 3.5 * PLANET_SIZE_SCALE + 10,
      orbitalSpeed: 0.18,
      description: "Largest moon of Pluto, forms a binary system.",
      mythOrigin: "Named after the ferryman of Hades in Greek mythology."
    }),
    new Moon({
      name: "Styx",
      color: "#e0e0e0",
      size: 0.7 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.09 * PLANET_DISTANCE_SCALE + 3.5 * PLANET_SIZE_SCALE + 16,
      orbitalSpeed: 0.15,
      description: "Smallest of Pluto's known moons.",
      mythOrigin: "Named after the river Styx in Greek mythology."
    }),
    new Moon({
      name: "Nix",
      color: "#f0f0f0",
      size: 0.8 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.12 * PLANET_DISTANCE_SCALE + 3.5 * PLANET_SIZE_SCALE + 22,
      orbitalSpeed: 0.13,
      description: "Discovered in 2005, irregular shape.",
      mythOrigin: "Named after the Greek goddess of night."
    }),
    new Moon({
      name: "Kerberos",
      color: "#cccccc",
      size: 0.7 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.15 * PLANET_DISTANCE_SCALE + 3.5 * PLANET_SIZE_SCALE + 28,
      orbitalSpeed: 0.11,
      description: "Small, dark moon discovered in 2011.",
      mythOrigin: "Named after the multi-headed dog guarding the underworld."
    }),
    new Moon({
      name: "Hydra",
      color: "#e5e5e5",
      size: 0.9 * PLANET_SIZE_SCALE,
      orbitalRadius: 0.18 * PLANET_DISTANCE_SCALE + 3.5 * PLANET_SIZE_SCALE + 34,
      orbitalSpeed: 0.09,
      description: "Second largest moon of Pluto.",
      mythOrigin: "Named after the nine-headed serpent in Greek mythology."
    })
  ]
}),


];
