import { Graphics, Sprite, Particle } from "pixi.js";
import app from "../index.js";

export class GraphicsTex extends Graphics {
  constructor(texture) {
    super();

    this.texture = texture || null;
    this.sprites = [];
    this.particles = [];
  }

  _generateTex() {
    this.texture = app.renderer.generateTexture(this);
    super.destroy();
  }

  toSprite() {
    if (!this.texture) this._generateTex();
    const sprite = Sprite.from(this.texture);
    this.sprites.push(sprite);
    return sprite;
  }

  toParticle() {
    if (!this.texture) this._generateTex();
    const particle = new Particle(this.texture);
    this.particles.push(particle);
    return particle;
  }

  destroy() {
    if (this.texture) this.texture.destroy();
    this.texture = null;
    for (const sprite of this.sprites) sprite.destroy();
    this.sprites = null;
    this.particles = null;
  }
}
