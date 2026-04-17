import { FillGradient, Filter } from "pixi.js";
import { GraphicsTex } from "./GraphicsTex";

export class BlobSpawner extends GraphicsTex {
  constructor(blobOptions) {
    super();

    this.size = blobOptions.size;
    this.containerSize = blobOptions.containerSize;
    this.colors = blobOptions.colors;
    this.blobs = [];

    this.init();
  }

  init() {
    this.rect(0, 0, this.size, this.size).fill({
      color: "#ffffff",
      alpha: 1,
    });
  }

  makeBlobs(quantity) {
    for (let i = 0; i < quantity; i++) {
      const particle = this.toParticle();

      particle.anchor = 0.5;

      const angle = Math.random() * Math.PI * 2;
      const normalizedRadius = Math.pow(Math.random(), 16); // 2 being the strength of bias towards the center
      const radius = normalizedRadius * this.containerSize;

      const scaleFactor = 1;
      particle.x = radius * Math.cos(angle);
      particle.y = radius * Math.sin(angle);
      particle.scaleX = scaleFactor;
      particle.scaleY = scaleFactor;
      this.blobs.push(particle);
    }

    return this.blobs;
  }
}
