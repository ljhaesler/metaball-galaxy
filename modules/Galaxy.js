import { UserEmailSystem } from "./UserEmailSystem";
import { ParticleSpawner } from "./ParticleSpawner";
import { GraphicsTex } from "./GraphicsTex.js";

import { Container, ParticleContainer } from "pixi.js";
import app from "../index.js";

export class Galaxy extends Container {
  constructor(galaxyOptions) {
    super({ isRenderGroup: true });

    this.density = galaxyOptions.galaxyDensity;
    this.containerSize = galaxyOptions.containerSize;
    this.users = [];
    this.userSprites = [];
    this.spawners = [];
  }

  createParticleSpawner(particleSpawnerOptions) {
    const particleSpawner = new ParticleSpawner({
      ...particleSpawnerOptions,
      containerSize: this.containerSize,
    });

    this.spawners.push(particleSpawner);
  }

  createUserSystem(emailSystemOptions) {
    const user = new UserEmailSystem({
      ...emailSystemOptions,
      containerSize: this.containerSize,
      galaxyDensity: this.density,
    });

    const spawner = this._getSpawnerForUser(user.distCenter);
    user.setSpawner(spawner);

    this.addChild(user);
  }

  usersToTextures() {
    const userSprites = [];
    for (const user of this.children) {
      const userTexture = app.renderer.generateTexture(user);
      const userSprite = new GraphicsTex(userTexture).toSprite();
      userSprite.x = user.x;
      userSprite.y = user.y;
      userSprite.rotationSpeed = user.rotationSpeed;
      userSprite.orbitRadius = user.orbitRadius;
      userSprite.orbitAngle = user.orbitAngle;
      userSprite.orbitSpeed = user.orbitspeed;
      userSprite.blendMode = "add";
      userSprites.push(userSprite);
      user.cacheAsTexture();
    }

    this.addChild(...userSprites);
  }

  _getSpawnerForUser(dist) {
    return this.spawners[Math.floor(dist * this.spawners.length)];
  }
}
