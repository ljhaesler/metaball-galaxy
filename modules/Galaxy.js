import { UserEmailSystem } from "./UserEmailSystem";
import { ParticleSpawner } from "./ParticleSpawner";
import { SingleUserParameters } from "./SingleUserParameters";

import { Container, ParticleContainer } from "pixi.js";

export class Galaxy extends Container {
  constructor(inputElements) {
    super();

    this.density = inputElements.galaxyDensity.get();
    this.containerSize = inputElements.containerSize.get();
    this.rotationSpeed = inputElements.rotationSpeed.get();
    this.emailQuantity = inputElements.emailQuantity.get();
    this.userQuantity = inputElements.userQuantity.get();
    this.centerBias = inputElements.centerBias.get();
    this.particleSize = inputElements.particleSize.get();
    this.userSpawnFunc = inputElements.userSpawnFunc.get();
    this.particleAlpha = inputElements.particleAlpha.get();
    this.particleColors = inputElements.particleColors
      .get()
      .split("/")
      .map((el) => el.trim())
      .map((el1) => el1.split(",").map((el2) => el2.trim()));

    this.spawners = [];

    this.blendMode = "add";
  }

  getChildren() {
    if (this.children.length == 1) return this.children[0].particleChildren;
    else return this.children;
  }

  generateSpawners() {
    for (const colorSet of this.particleColors) {
      this._createParticleSpawner({
        colors: colorSet,
        particleSize: this.particleSize,
        alpha: this.particleAlpha,
        centerBias: this.centerBias,
        containerSize: this.containerSize,
      });
    }
  }

  generateUsers() {
    for (let i = 0; i < this.userQuantity; i++) {
      this._createUserSystem({
        rotationSpeed: this.rotationSpeed,
        emailQuantity: this.emailQuantity,
        userSpawnFunc: this.userSpawnFunc,
        galaxyDensity: this.density,
      });
    }
  }

  generateEmptyUsers() {
    const emptyUsersContainer = new ParticleContainer({
      dynamicProperties: {
        position: true,
        vertex: false,
        rotation: false,
        uvs: false,
        color: false,
      },
    });

    emptyUsersContainer.blendMode = "add";

    this.addChild(emptyUsersContainer);

    for (let i = 0; i < this.userQuantity; i++) {
      const parameters = new SingleUserParameters({
        rotationSpeed: this.rotationSpeed,
        emailQuantity: this.emailQuantity,
        userSpawnFunc: this.userSpawnFunc,
        galaxyDensity: this.density,
      });

      const spawner = this._getSpawnerForUser(parameters.distCenter);
      const particle = spawner.spawnEmailParticle();
      particle.orbitRadius = parameters.orbitRadius;
      particle.orbitAngle = parameters.orbitAngle;
      particle.orbitSpeed = parameters.orbitSpeed;
      emptyUsersContainer.addParticle(particle);
    }
  }

  _createParticleSpawner(particleSpawnerOptions) {
    const particleSpawner = new ParticleSpawner(particleSpawnerOptions);
    this.spawners.push(particleSpawner);
  }

  _createUserSystem(emailSystemOptions) {
    const user = new UserEmailSystem(emailSystemOptions);
    const spawner = this._getSpawnerForUser(user.distCenter);
    user.setSpawner(spawner);
    this.addChild(user);
  }

  _getSpawnerForUser(dist) {
    return this.spawners[Math.floor(dist * this.spawners.length)];
  }
}
