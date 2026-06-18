import { ParticleSpawner } from "./ParticleSpawner";
import { SingleUserParameters } from "./SingleUserParameters";

import { Container, ParticleContainer } from "pixi.js";

export class Galaxy extends Container {
	constructor(inputElements) {
		super({ isRenderGroup: true });

		console.log(inputElements);
		this.density = inputElements.galaxyDensity;
		this.containerSize = inputElements.containerSize;
		this.rotationSpeed = inputElements.rotationSpeed;
		this.emailQuantity = inputElements.emailQuantity;
		this.userQuantity = inputElements.userQuantity;
		this.centerBias = inputElements.centerBias;
		this.particleSize = inputElements.particleSize;
		this.userSpawnFunc = inputElements.userSpawnFunc;
		this.particleAlpha = inputElements.particleAlpha;
		this.emptyUserQuantity = inputElements.emptyUserQuantity;
		this.emptyUserScale = inputElements.emptyUserScale;
		this.particleColors = inputElements.particleColors
			.split("/")
			.map((el) => el.trim())
			.map((el1) => el1.split(",").map((el2) => el2.trim()));
		this.emptyUserParticleColors = inputElements.emptyUserParticleColors
			.split("/")
			.map((el) => el.trim())
			.map((el1) => el1.split(",").map((el2) => el2.trim()));

		this.spawners = [];
		this.emptyUserSpawners = [];

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

	generateEmptyUserSpawners() {
		for (const colorSet of this.emptyUserParticleColors) {
			this._createEmptyUserParticleSpawner({
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

			const parameters = this._getUserParams();

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
			const parameters = this._getUserParams();
			const spawner = this._getEmptyUserSpawnerForUser(parameters.distCenter);
			spawner.setParticleScale(this.emptyUserScale);
			const particle = spawner.spawnParticles(1)[0];
			particle.orbitRadius = parameters.orbitRadius;
			particle.orbitAngle = parameters.orbitAngle;
			particle.orbitSpeed = parameters.orbitSpeed;
			this.emptyUsersContainer.addParticle(particle);
		}
	}

	_getUserParams() {
		return new SingleUserParameters({
			rotationSpeed: this.rotationSpeed,
			emailQuantity: this.emailQuantity,
			userSpawnFunc: this.userSpawnFunc,
			galaxyDensity: this.density,
		});
	}

	_createEmptyUserParticleSpawner(particleSpawnerOptions) {
		const particleSpawner = new ParticleSpawner(particleSpawnerOptions);
		this.emptyUserSpawners.push(particleSpawner);
	}

	_createParticleSpawner(particleSpawnerOptions) {
		const particleSpawner = new ParticleSpawner(particleSpawnerOptions);
		this.spawners.push(particleSpawner);
	}

	_getSpawnerForUser(dist) {
		return this.spawners[Math.floor(dist * this.spawners.length)];
	}

	_getEmptyUserSpawnerForUser(dist) {
		return this.emptyUserSpawners[
			Math.floor(dist * this.emptyUserSpawners.length)
		];
	}
}
