import { Container, ParticleContainer, Point } from "pixi.js";
import app from "../index.js";

export class UserEmailSystem extends ParticleContainer {
  constructor(emailSystemOptions) {
    super({
      dynamicProperties: {
        position: false, // Update positions each frame
        vertex: false, // Update rotations each frame
        rotation: false,
        uvs: false,
        color: false,
      },
    });

    this.emailQuantity = emailSystemOptions.emailQuantity;
    this.rotationSpeed = emailSystemOptions.rotationSpeed * Math.random();
    this.galaxyDensity = emailSystemOptions.galaxyDensity;
    this.height = emailSystemOptions.containerSize;
    this.width = emailSystemOptions.containerSize;

    this.pivot.set(this.width / 2, this.height / 2);
    this.origin.set(this.width / 2, this.height / 2);
    this.screenDiagonal = Math.sqrt(
      app.screen.width * app.screen.width +
        app.screen.height * app.screen.height,
    );

    this.spawnPoint = this._getSpawnPoint();

    // line spawn along x
    // this.x = app.screen.width / 2;
    // this.y = this.spawnPoint.y;
    // line spawn along y, tends to produce similar effects, but they make the galaxy bigger?
    // this.x = this.spawnPoint.x;
    // this.y = app.screen.height / 2;
    // standard rectangle spawn
    this.x = this.spawnPoint.x;
    this.y = this.spawnPoint.y;
    // triangle spawn with ._getTriangleSpawnPoint(), but the triangle isn't centered

    this.blendMode = "add";
    this.centerX = app.screen.width / 2;
    this.centerY = app.screen.height / 2;

    this.orbitRadius = Math.sqrt(
      (this.x - this.centerX) * (this.x - this.centerX) +
        (this.y - this.centerY) * (this.y - this.centerY),
    );
    this.orbitAngle = Math.atan2(this.y - this.centerY, this.x - this.centerX);
    // this 0.000001 is a fixed constant, modifying it changes the output entirely
    // but by changing the phase of each funcion, we can achieve a similar effect.
    this.orbitSpeed = this.orbitRadius * 0.000001;

    this._getDistToCenter();
  }

  setSpawner(spawner) {
    this.spawner = spawner;
    this._spawnParticles();
  }

  _spawnParticles() {
    const particles = this.spawner.spawnParticles(this.emailQuantity);
    this.addParticle(...particles);
  }

  _getDistToCenter() {
    const diffX = this.spawnPoint.x - app.screen.width / 2;
    const diffY = this.spawnPoint.y - app.screen.height / 2;
    const distCenter = Math.sqrt(diffX * diffX + diffY * diffY);
    const spawnRectDiagonal = this.screenDiagonal * this.galaxyDensity;
    // spawnRectDiagonal / 2 -> simply because the distance of the container from the center
    // presumes half the spawnRectDiagonal size.
    this.distCenter = distCenter / (spawnRectDiagonal / 2);
  }

  _getTriangleSpawnPoint() {
    // Your existing galaxy density logic
    const minValue = 0.5 - this.galaxyDensity / 2;
    const rRatio = this.galaxyDensity;

    // Generate base random values within your density constraints
    const baseX = Math.random() * rRatio + minValue;
    const baseY = Math.random() * rRatio + minValue;

    // Define your triangle vertices (adjust these to your game's layout)
    const A = { x: 0, y: app.screen.height }; // Bottom-left
    const B = {
      x: app.screen.width,
      y: app.screen.height,
    }; // Bottom-right
    const C = { x: app.screen.width / 2, y: 0 }; // Top-center

    // Use the reflection method to map your random values into the triangle
    const r1 = baseX;
    const r2 = baseY;

    let x, y;

    if (r1 + r2 > 1) {
      // Reflect to stay within triangle
      x = A.x + (1 - r1) * (B.x - A.x) + (1 - r2) * (C.x - A.x);
      y = A.y + (1 - r1) * (B.y - A.y) + (1 - r2) * (C.y - A.y);
    } else {
      // Direct mapping
      x = A.x + r1 * (B.x - A.x) + r2 * (C.x - A.x);
      y = A.y + r1 * (B.y - A.y) + r2 * (C.y - A.y);
    }

    return { x, y };
  }

  _getSpawnPoint() {
    //Galaxy Density is 0.5? 0.5 + 0.25 -> Max 0.75, min 0.25
    //Galaxy Density is 0.6? 0.6 + 0.2 -> Max 0.8, min 0.2
    //Galaxy Density is 0.8? 0.8 + 0.1 -> Max 0.9, min 0.1
    //Galaxy Density is 0.2? 0.2 + 0.4 -> Max 0.6, min 0.4

    const minValue = 0.5 - this.galaxyDensity / 2;
    const rRatio = this.galaxyDensity;

    return {
      x: (Math.random() * rRatio + minValue) * app.screen.width,
      y: (Math.random() * rRatio + minValue) * app.screen.height,
    };
  }
}
