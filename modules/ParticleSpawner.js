import { FillGradient, Filter } from "pixi.js";
import { GraphicsTex } from "./GraphicsTex";

export class ParticleSpawner extends GraphicsTex {
  constructor(particleOptions) {
    super();

    this.particleSize = particleOptions.particleSize;
    this.containerSize = particleOptions.containerSize;
    this.colors = particleOptions.colors;
    this.alpha = particleOptions.alpha;
    this.activeDistance = particleOptions.activeDistance;
    this.centerBias = particleOptions.centerBias;

    this._init();
  }

  _init() {
    this.rect(0, 0, this.particleSize, this.particleSize).fill({
      color: "#ffffff",
      alpha: this.alpha,
    });
  }

  _getPosition() {
    const angle = Math.random() * Math.PI * 2;
    const normalizedRadius = Math.pow(Math.random(), this.centerBias); // 8 being the strength of bias towards the center
    const radius = normalizedRadius * this.containerSize;

    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  }

  _getColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  spawnEmailParticle() {
    const particle = this.toParticle();
    particle.tint = this._getColor();
    particle.anchor = 0.5;

    return particle;
  }

  spawnParticles(quantity) {
    const particles = [];

    for (let i = 0; i < quantity; i++) {
      const particle = this.toParticle();
      const position = this._getPosition();

      particle.tint = this._getColor();
      particle.anchor = 0.5;
      particle.x = position.x;
      particle.y = position.y;

      particles.push(particle);
    }

    return particles;
  }
}
