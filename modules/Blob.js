import { FillGradient, Filter } from "pixi.js";
import { GraphicsTex } from "./GraphicsTex";

export class BlobSpawner extends GraphicsTex {
  constructor(blobOptions) {
    super();

    this.size = blobOptions.size;
    this.containerSize = blobOptions.containerSize;
    this.gradient = blobOptions.gradient;
    this.colors = blobOptions.colors;
    this.blobs = [];

    this.init();
  }

  init() {
    this.arc(0, 0, this.size, 0, Math.PI * 2).fill(this.gradient);
  }

  makeBlobs(quantity) {
    for (let i = 0; i < quantity; i++) {
      const sprite = this.toParticle();
      sprite.tint = this.colors[Math.floor(Math.random() * this.colors.length)];

      sprite.anchor = 0.5;

      const angle = Math.random() * Math.PI * 2;

      const normalizedRadius = Math.pow(Math.random(), 1.25); // 2 being the strength of bias towards the center
      const radius = normalizedRadius * this.containerSize * 0.7;

      sprite.x = radius * Math.cos(angle);
      sprite.y = radius * Math.sin(angle);
      sprite.scaleX = Math.random() * this.size;
      sprite.scaleY = Math.random() * this.size;
      sprite.vx = Math.random() - 0.5;
      sprite.vy = Math.random() - 0.5;
      sprite.skewRand = Math.cos(Math.random() * Math.PI * 2);
      this.blobs.push(sprite);
    }

    return this.blobs;
  }
}
