import { UserEmailSystem } from "./UserEmailSystem";
import { ParticleSpawner } from "./ParticleSpawner";

import { Container } from "pixi.js";

export class Galaxy extends Container {
  constructor(galaxyOptions) {
    super();

    this.density = galaxyOptions.galaxyDensity;
    this.containerSize = galaxyOptions.containerSize;
    this.users = [];
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

  _getSpawnerForUser(dist) {
    if (dist > 0.75) return this.spawners[0];
    else if (dist > 0.5) return this.spawners[1];
    else if (dist > 0.25) return this.spawners[2];
    else return this.spawners[3];
  }
}
