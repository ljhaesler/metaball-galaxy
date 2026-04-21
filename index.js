// I need as many ParticleSpawners are there are colour sets
// these ParticleSpawners are used to populate UserEmailSystems with particles
// and the Galaxy itself is populated with UserEmailSystems
// GalaxyDensity should be defined on the Galaxy itself
// but the UserEmailSystems need the GalaxyDensity

const galaxyDensity = 0.6;
const containerSize = 64;
const rotationSpeed = 0.01;
const emailQuantity = 128;
const userQuantity = 3200;
const centerBias = 4;
const spin1 = 0.01;
const spin2 = 0;
const phaseOffset1 = 8192;
const phaseOffset2 = 2048;

import { Application, Point, Filter, Container, FillGradient } from "pixi.js";
import "pixi.js/advanced-blend-modes";
import { UserEmailSystem } from "./modules/UserEmailSystem.js";
import { ParticleSpawner } from "./modules/ParticleSpawner.js";
import { Galaxy } from "./modules/Galaxy.js";

const app = new Application();
await app.init({
  background: "#000000",
  backgroundAlpha: 1,
  resizeTo: window,
  antialias: true,
});
document.body.appendChild(app.canvas);
export default app;

const galaxy = new Galaxy({ galaxyDensity, containerSize });

galaxy.createParticleSpawner({
  colors: ["#ff0000", "#ff00ff"],
  particleSize: 1,
  alpha: 1,
  centerBias,
});

galaxy.createParticleSpawner({
  colors: ["#ff00ff", "#00ffff"],
  particleSize: 1,
  alpha: 1,
  centerBias,
});

galaxy.createParticleSpawner({
  colors: ["#ffff00", "#ff000f"],
  particleSize: 1,
  alpha: 1,
  centerBias,
});

galaxy.createParticleSpawner({
  colors: ["#ffffff", "#3333ff"],
  particleSize: 1,
  alpha: 1,
  centerBias,
});

// a particleContainer is a very heavy entity to hold in memory, 4000+ is very slow
// there ought to be a way of making it more lean?
// perhaps simply having something that extends Particle instead
// this should be possible because these containers are simply rotating sets of particles
// based on the current implementation, each container could simply just be single 'Particle' instance.

// converting the container via .cacheAsTexture() would likely be the simplest implementation

// 4000 seems to be a soft limit for decent fps
// anything more just feels sluggish
// cacheAsTexture just doesn't seem to work
// but maybe I can use rendergrouping instead
for (let i = 0; i < userQuantity; i++) {
  galaxy.createUserSystem({
    rotationSpeed,
    emailQuantity,
  });
}

let t1 = 0;
let t2 = 0;
const centerX = app.screen.width / 2;
const centerY = app.screen.height / 2;

app.ticker.add(() => {
  t1 += spin1;
  t2 += spin2;

  for (const container of galaxy.children) {
    container.orbitAngle += container.orbitSpeed;
    // notably, the original position of the container is not taken into account here
    // the position of the container is used to calculate its orbitAngle, orbitSpeed, orbitRadius
    // but it is then ignored for the actual positioning of the container inside this ticker.
    container.x =
      centerX +
      Math.cos(
        container.orbitAngle + container.orbitSpeed * phaseOffset1 + t1,
      ) *
        container.orbitRadius;
    container.y =
      centerY +
      Math.sin(
        container.orbitAngle + container.orbitSpeed * phaseOffset2 - t2,
      ) *
        container.orbitRadius;
    container.rotation += container.rotationSpeed;
  }
});

app.stage.addChild(galaxy);
// galaxy.usersToTextures();

// const blobGradient = new FillGradient({
//   type: "radial",
//   center: { x: 0.5, y: 0.5 },
//   innerRadius: 0,
//   outerCenter: { x: 0.5, y: 0.5 },
//   outerRadius: 0.5,
//   colorStops: [
//     { offset: 0, color: "#ffffffff" }, // Center color
//     { offset: 1, color: "#00000000" }, // Edge color
//   ],
// });
