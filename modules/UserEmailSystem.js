import { Container, ParticleContainer, Point } from "pixi.js";
import app from "../index.js";

export class UserEmailSystem extends ParticleContainer {
  constructor(emailSystemOptions) {
    super({
      dynamicProperties: {
        position: true, // Update positions each frame
        vertex: true, // Update rotations each frame
      },
    });

    this.emailQuantity = emailSystemOptions.emailQuantity;
    this.rotationSpeed = emailSystemOptions.rotationSpeed * Math.random();
    this.galaxyDensity = emailSystemOptions.galaxyDensity;
    this.height = emailSystemOptions.containerSize;
    this.width = emailSystemOptions.containerSize;

    this.pivot.set(this.width / 2, this.height / 2);
    this.screenDiagonal = Math.sqrt(
      app.screen.width * app.screen.width +
        app.screen.height * app.screen.height,
    );

    this.spawnPoint = this._getSpawnPoint();

    this.x = this.spawnPoint.x;
    this.y = this.spawnPoint.x;
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
