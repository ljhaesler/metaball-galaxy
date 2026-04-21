import { UserEmailSystem } from "./UserEmailSystem";
import { ParticleSpawner } from "./ParticleSpawner";
import { GraphicsTex } from "./GraphicsTex.js";

import { Container } from "pixi.js";

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

    this.users.push(user);
    this.addChild(user);
  }

  usersToTextures() {
    for (const user of this.children) {
      const userGraphics = new GraphicsTex(user.texture);
      // const userSprite = userGraphics.toSprite();
      // userSprite.anchor.set(0.5, 0.5);
      // userSprite.x = user.x;
      // userSprite.y = user.y;
      // userSprite.rotationSpeed = user.rotationSpeed;
      // userSprite.orbitRadius = user.orbitRadius;
      // userSprite.orbitAngle = user.orbitAngle;
      // userSprite.orbitSpeed = user.orbitspeed;
      // this.userSprites.push(userSprite);
      // this.addChild(userSprite);
      // this.removeChild(user);
    }
  }

  _getSpawnerForUser(dist) {
    if (dist > 0.75) return this.spawners[0];
    else if (dist > 0.5) return this.spawners[1];
    else if (dist > 0.25) return this.spawners[2];
    else return this.spawners[3];
  }
}
