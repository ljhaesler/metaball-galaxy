// I need as many ParticleSpawners are there are colour sets
// these ParticleSpawners are used to populate UserEmailSystems with particles
// and the Galaxy itself is populated with UserEmailSystems
// GalaxyDensity should be defined on the Galaxy itself
// but the UserEmailSystems need the GalaxyDensity

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

const galaxy = new Galaxy({ galaxyDensity: 0.3, containerSize: 32 });

galaxy.origin.set(galaxy.width / 2, galaxy.height / 2);
galaxy.createParticleSpawner({
  colors: ["#ff0000", "#ff00ff"],
  particleSize: 1,
  alpha: 1,
});

galaxy.createParticleSpawner({
  colors: ["#ff00ff", "#00ffff"],
  particleSize: 1,
  alpha: 0.7,
});

galaxy.createParticleSpawner({
  colors: ["#ffff00", "#ff000f"],
  particleSize: 1,
  alpha: 1,
});

galaxy.createParticleSpawner({
  colors: ["#ffffff", "#333333"],
  particleSize: 1,
  alpha: 1,
});

// a particleContainer is a very heavy entity to hold in memory, 4000+ is very slow
// there ought to be a way of making it more lean?
// perhaps simply having something that extends Particle instead
// this should be possible because these containers are simply rotating sets of particles
// based on the current implementation, each container could simply just be single 'Particle' instance.
// converting the container via .cacheAsTexture() would likely be the simplest implementation
// but I don't know how transparency/additive colouring would be handled.

for (let i = 0; i < 4096; i++) {
  galaxy.createUserSystem({
    rotationSpeed: 0.01,
    emailQuantity: 64,
  });
}

let t1 = 0;
let t2 = 0;
const centerX = app.screen.width / 2;
const centerY = app.screen.height / 2;

console.log(galaxy.children);

app.ticker.add(() => {
  t1 += 0.01;
  t2 += 0.01;

  for (const container of galaxy.children) {
    container.orbitAngle += container.orbitSpeed;
    container.x =
      centerX +
      Math.sin(container.orbitAngle + container.orbitSpeed * 80000 + t1) *
        container.orbitRadius;
    container.y =
      centerY +
      Math.cos(container.orbitAngle + container.orbitSpeed * 40000 - t2) *
        container.orbitRadius;
    container.rotation += container.rotationSpeed;
  }
});

app.stage.addChild(galaxy);

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
