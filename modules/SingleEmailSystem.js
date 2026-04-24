import { ParticleContainer } from "pixi.js";
import { GraphicsTex } from "./GraphicsTex.js";
import app from "../index.js";

export class SingleEmailSystem extends ParticleContainer {
  constructor(emailSystemOptions) {
    super({
      dynamicProperties: {
        position: true,
        vertex: false,
        rotation: true,
        uvs: false,
        color: false,
      },
    });

    this.emailQuantity = emailSystemOptions.emailQuantity;
    this.rotationSpeed =
      Math.cos(Math.random() * 2 * Math.PI) * emailSystemOptions.rotationSpeed;
    this.galaxyDensity = emailSystemOptions.galaxyDensity;
    this.spawnPoint = this[emailSystemOptions.userSpawnFunc]();

    this.x = this.spawnPoint.x;
    this.y = this.spawnPoint.y;

    this._calculateOrbit();
    this._getDistToCenter();
  }

  _calculateOrbit() {
    const centerX = app.screen.width / 2;
    const centerY = app.screen.height / 2;

    this.orbitRadius = Math.sqrt(
      (this.x - centerX) * (this.x - centerX) +
        (this.y - centerY) * (this.y - centerY),
    );
    this.orbitAngle = Math.atan2(this.y - centerY, this.x - centerX);
    this.orbitSpeed = this.orbitRadius * 0.000001;
    // this 0.000001 is a fixed constant, modifying it changes the output entirely
    // but by changing the phase of each funcion, we can achieve a similar effect.
  }

  _getDistToCenter() {
    const screenDiagonal = Math.sqrt(
      app.screen.width * app.screen.width +
        app.screen.height * app.screen.height,
    );
    const diffX = this.spawnPoint.x - app.screen.width / 2;
    const diffY = this.spawnPoint.y - app.screen.height / 2;
    const distCenter = Math.sqrt(diffX * diffX + diffY * diffY);
    const spawnRectDiagonal = screenDiagonal * this.galaxyDensity;
    // spawnRectDiagonal / 2 -> simply because the distance of the container from the center
    // presumes half the spawnRectDiagonal size.
    this.distCenter = distCenter / (spawnRectDiagonal / 2);
  }

  _getrectspawnpoint() {
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

  _getlinespawnpoint() {
    return {
      x:
        (Math.random() * this.galaxyDensity + (0.5 - this.galaxyDensity / 2)) *
        app.screen.width,
      y: app.screen.height / 2,
    };
  }
}
