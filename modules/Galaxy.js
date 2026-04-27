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
    this.emptyUserQuantity = inputElements.emptyUserQuantity.get();
    this.emptyUserScale = inputElements.emptyUserScale.get();
    this.particleColors = inputElements.particleColors
      .get()
      .split("/")
      .map((el) => el.trim())
      .map((el1) => el1.split(",").map((el2) => el2.trim()));

    this.spawners = [];
    this.emptyUsersContainer = new ParticleContainer({
      dynamicProperties: {
        position: true,
        vertex: false,
        rotation: false,
        uvs: false,
        color: false,
      },
    });

    this.emptyUsersContainer.blendMode = "add";
    this.addChild(this.emptyUsersContainer);
  }

  getChildren() {
    const emptyUserParticles = this.children[0].particleChildren || [];
    const userContainers = this.children.slice(1);

    return [...emptyUserParticles, ...userContainers];
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
      const userContainer = new ParticleContainer({
        dynamicProperties: {
          position: false,
          vertex: false,
          rotation: false,
          uvs: false,
          color: false,
        },
      });

      userContainer.blendMode = "add";

      const parameters = new SingleUserParameters({
        rotationSpeed: this.rotationSpeed,
        emailQuantity: this.emailQuantity,
        userSpawnFunc: this.userSpawnFunc,
        galaxyDensity: this.density,
      });

      const spawner = this._getSpawnerForUser(parameters.distCenter);
      const particles = spawner.spawnParticles(this.emailQuantity);
      userContainer.addParticle(...particles);
      userContainer.orbitRadius = parameters.orbitRadius;
      userContainer.orbitAngle = parameters.orbitAngle;
      userContainer.orbitSpeed = parameters.orbitSpeed;
      userContainer.rotationSpeed = parameters.rotationSpeed;
      this.addChild(userContainer);
    }
  }

  generateEmptyUsers() {
    for (let i = 0; i < this.emptyUserQuantity; i++) {
      const parameters = new SingleUserParameters({
        rotationSpeed: this.rotationSpeed,
        emailQuantity: this.emailQuantity,
        userSpawnFunc: this.userSpawnFunc,
        galaxyDensity: this.density,
      });

      const spawner = this._getSpawnerForUser(parameters.distCenter);
      const particle = spawner.spawnSingleParticle(this.emptyUserScale);
      particle.orbitRadius = parameters.orbitRadius;
      particle.orbitAngle = parameters.orbitAngle;
      particle.orbitSpeed = parameters.orbitSpeed;
      this.emptyUsersContainer.addParticle(particle);
    }
  }

  _createParticleSpawner(particleSpawnerOptions) {
    const particleSpawner = new ParticleSpawner(particleSpawnerOptions);
    this.spawners.push(particleSpawner);
  }

  _getSpawnerForUser(dist) {
    return this.spawners[Math.floor(dist * this.spawners.length)];
  }
}
