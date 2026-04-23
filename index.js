// I need as many ParticleSpawners are there are colour sets
// these ParticleSpawners are used to populate UserEmailSystems with particles
// and the Galaxy itself is populated with UserEmailSystems
// GalaxyDensity should be defined on the Galaxy itself
// but the UserEmailSystems need the GalaxyDensity

import { Application } from "pixi.js";
import { Galaxy } from "./modules/Galaxy.js";
import { ConfigHandler } from "./modules/ConfigHandler.js";
import config from "./config.json" assert { type: "json" };

const app = new Application();
await app.init({
  background: "#000000",
  backgroundAlpha: 1,
  resizeTo: window,
  antialias: false,
  roundPixels: false,
});
document.body.appendChild(app.canvas);
export default app;

const configHandler = new ConfigHandler();

let galaxy;
function generateGalaxy() {
  if (app.stage.children.length > 0) app.stage.removeChildren();
  const galaxyDensity = parseFloat(
    configHandler.inputElements.galaxyDensity.value,
  );
  const containerSize = parseInt(
    configHandler.inputElements.containerSize.value,
  );
  const rotationSpeed = parseFloat(
    configHandler.inputElements.rotationSpeed.value,
  );
  const emailQuantity = parseInt(
    configHandler.inputElements.emailQuantity.value,
  );
  const userQuantity = parseInt(configHandler.inputElements.userQuantity.value);
  const centerBias = parseInt(configHandler.inputElements.centerBias.value);
  const particleSize = parseInt(configHandler.inputElements.particleSize.value);
  const userSpawnFunc = configHandler.inputElements.userSpawnFunc.value;

  const particleSets = configHandler.inputElements.particleColors.value
    .split("/")
    .map((el) => el.trim());
  const particleColors = particleSets.map((el1) =>
    el1.split(",").map((el2) => el2.trim()),
  );

  galaxy = new Galaxy({ galaxyDensity, containerSize });
  for (const colorSet of particleColors) {
    galaxy.createParticleSpawner({
      colors: colorSet,
      particleSize,
      alpha: 1,
      centerBias,
    });
  }

  for (let i = 0; i < userQuantity; i++) {
    galaxy.createUserSystem({
      rotationSpeed,
      emailQuantity,
      userSpawnFunc,
    });
  }
  app.stage.addChild(galaxy);
}
generateGalaxy();

configHandler.inputElements.galaxyDensity.onchange = generateGalaxy;
configHandler.inputElements.containerSize.onchange = generateGalaxy;
configHandler.inputElements.rotationSpeed.onchange = generateGalaxy;
configHandler.inputElements.emailQuantity.onchange = generateGalaxy;
configHandler.inputElements.userQuantity.onchange = generateGalaxy;
configHandler.inputElements.centerBias.onchange = generateGalaxy;
configHandler.inputElements.particleColors.onchange = generateGalaxy;
configHandler.inputElements.particleSize.onchange = generateGalaxy;
configHandler.inputElements.userSpawnFunc.onchange = generateGalaxy;

let t1 = 0;
let t2 = 0;
const centerX = app.screen.width / 2;
const centerY = app.screen.height / 2;

app.ticker.add(() => {
  console.log("running");
  const inputs = configHandler.inputElements;
  t1 += parseFloat(inputs.spin1.value) || 0;
  t2 += parseFloat(inputs.spin2.value) || 0;
  for (const container of galaxy.children) {
    container.orbitAngle += container.orbitSpeed;
    // notably, the original position of the container is not taken into account here
    // the position of the container is used to calculate its orbitAngle, orbitSpeed, orbitRadius
    // but it is then ignored for the actual positioning of the container inside this ticker.
    container.x =
      centerX +
      Math[inputs.xFunc.value](
        container.orbitAngle +
          container.orbitSpeed * inputs.phaseOffset1.value +
          t1,
      ) *
        container.orbitRadius;
    container.y =
      centerY +
      Math[inputs.yFunc.value](
        container.orbitAngle +
          container.orbitSpeed * inputs.phaseOffset2.value -
          t2,
      ) *
        container.orbitRadius;
    container.rotation += container.rotationSpeed;
  }
});

// galaxy.usersToTextures();
// it seems like any attempt to remove the particles themselves will just delete the generated texture altogether

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
