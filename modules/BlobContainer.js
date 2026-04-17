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

    this.pivot.set(this.width / 2, this.height / 2);

    const distanceX = Math.random();
    const distanceY = Math.random();
    this.x = (distanceX * 0.6 + 0.2) * app.screen.width;
    this.y = (distanceY * 0.6 + 0.2) * app.screen.height;

    const diffX = this.x - app.screen.width / 2;
    const diffY = this.y - app.screen.height / 2;
    const distCenter = Math.sqrt(diffX * diffX + diffY * diffY);

    const spawnRectSize =
      Math.sqrt(
        app.screen.width * app.screen.width +
          app.screen.height * app.screen.height,
      ) * 0.32;

    const distCenterRatio = distCenter / spawnRectSize;

    this.colors = [];

    if (distCenterRatio > 0.7)
      this.colors.push(
        blobContainerOptions.colors[0],
        blobContainerOptions.colors[1],
      );
    else if (distCenterRatio > 0.35)
      this.colors.push(
        blobContainerOptions.colors[1],
        blobContainerOptions.colors[2],
      );
    else
      this.colors.push(
        blobContainerOptions.colors[0],
        blobContainerOptions.colors[2],
      );

    this.blendMode = "add";

    this.centerX = app.screen.width / 2;
    this.centerY = app.screen.height / 2;

    this.distToCenter = Math.sqrt(
      this.centerX * this.centerX + this.centerY * this.centerY,
    );

    this.rotationSpeed = (Math.random() - 0.5) / 64;

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
  }
}
