// src/solarSystem.js

export class Planet {
  constructor({
    name,
    color,
    size,
    orbitalRadius,
    orbitalSpeed,
    description,
    mythOrigin,
    moons = []
  }) {
    this.name = name;
    this.color = color;
    this.size = size;
    this.orbitalRadius = orbitalRadius;
    this.orbitalSpeed = orbitalSpeed;
    this.description = description;
    this.mythOrigin = mythOrigin;
    this.angle = Math.random() * Math.PI * 2;
    this.x = this.orbitalRadius * Math.cos(this.angle);
    this.y = this.orbitalRadius * Math.sin(this.angle);
    this.moons = moons;
  }

  move() {
    this.angle += this.orbitalSpeed;
    this.x = this.orbitalRadius * Math.cos(this.angle);
    this.y = this.orbitalRadius * Math.sin(this.angle);
    this.moons.forEach(moon => moon.move(this));
  }
}

export class Moon {
  constructor({
    name,
    color,
    size,
    orbitalRadius,
    orbitalSpeed,
    description,
    mythOrigin
  }) {
    this.name = name;
    this.color = color;
    this.size = size;
    this.orbitalRadius = orbitalRadius;
    this.orbitalSpeed = orbitalSpeed;
    this.description = description;
    this.mythOrigin = mythOrigin;
    this.angle = Math.random() * Math.PI * 2;
    this.x = 0;
    this.y = 0;
  }

  move(parentPlanet) {
    this.angle += this.orbitalSpeed;
    this.x = parentPlanet.x + this.orbitalRadius * Math.cos(this.angle);
    this.y = parentPlanet.y + this.orbitalRadius * Math.sin(this.angle);
  }
}
