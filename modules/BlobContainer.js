import { Container, ParticleContainer, Point } from "pixi.js";
import app from "../index.js";

export class BlobContainer extends ParticleContainer {
  constructor(blobContainerOptions) {
    // orbitSpd
    super({
      dynamicProperties: {
        position: true, // Update positions each frame
        vertex: true, // Update rotations each frame
      },
    });

    this.height = blobContainerOptions.containerSize;
    this.width = blobContainerOptions.containerSize;
    this.x = (Math.random() * 0.6 + 0.2) * app.screen.width;
    this.y = (Math.random() * 0.6 + 0.2) * app.screen.height;
    this.blendMode = "add";

    this.pivot.set(this.width / 2, this.height / 2);

    this.centerX = app.screen.width / 2;
    this.centerY = app.screen.height / 2;

    this.distToCenter = Math.sqrt(
      this.centerX * this.centerX + this.centerY * this.centerY,
    );

    this.orbitRadius = Math.sqrt(
      (this.x - this.centerX) * (this.x - this.centerX) +
        (this.y - this.centerY) * (this.y - this.centerY),
    );
    this.orbitAngle = Math.atan2(this.y - this.centerY, this.x - this.centerX);
    this.orbitSpeed =
      (this.orbitRadius - this.distToCenter) * blobContainerOptions.orbitSpd;

    // this.x =
    //   this.centerX +
    //   Math.cos(this.orbitAngle + this.orbitSpeed * 8192) * this.orbitRadius;
    // this.y =
    //   this.centerY +
    //   Math.sin(this.orbitAngle + this.orbitSpeed * 12000) * this.orbitRadius;

    this.attractionStrength = Math.random() / 256;
  }
}
