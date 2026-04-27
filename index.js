// I need as many ParticleSpawners are there are colour sets
// these ParticleSpawners are used to populate UserEmailSystems with particles
// and the Galaxy itself is populated with UserEmailSystems
// GalaxyDensity should be defined on the Galaxy itself
// but the UserEmailSystems need the GalaxyDensity

import { Application } from "pixi.js";
import { Galaxy } from "./modules/Galaxy.js";
import { ConfigHandler } from "./modules/ConfigHandler.js";

const app = new Application();
await app.init({
  background: "#000000",
  backgroundAlpha: 1,
  resizeTo: window,
  antialias: true,
});
document.body.appendChild(app.canvas);
export default app;

const configHandler = new ConfigHandler();
const inputElements = configHandler.inputElements;

let galaxy;
function generateGalaxy() {
  // if the app already contains particles, we need to wipe them to generate new ones
  if (app.stage.children.length > 0) app.stage.removeChildren();
  galaxy = new Galaxy(inputElements);
  galaxy.generateSpawners();
  galaxy.generateEmptyUsers();
  galaxy.generateUsers();

  app.stage.addChild(galaxy);
}

// generate the first galaxy before any inputs have changed
generateGalaxy();

inputElements.galaxyDensity.onchange = generateGalaxy;
inputElements.containerSize.onchange = generateGalaxy;
inputElements.rotationSpeed.onchange = generateGalaxy;
inputElements.emailQuantity.onchange = generateGalaxy;
inputElements.userQuantity.onchange = generateGalaxy;
inputElements.centerBias.onchange = generateGalaxy;
inputElements.particleColors.onchange = generateGalaxy;
inputElements.particleSize.onchange = generateGalaxy;
inputElements.userSpawnFunc.onchange = generateGalaxy;
inputElements.particleAlpha.onchange = generateGalaxy;
inputElements.emptyUserScale.onchange = generateGalaxy;
inputElements.emptyUserQuantity.onchange = generateGalaxy;
configHandler.setApplyFunction(generateGalaxy);

let t1 = 0;
let t2 = 0;
const centerX = app.screen.width / 2;
const centerY = app.screen.height / 2;
app.ticker.add(() => {
  t1 += inputElements.spin1.get() || 0;
  t2 += inputElements.spin2.get() || 0;
  const phaseOffset1 = inputElements.phaseOffset1.get();
  const phaseOffset2 = inputElements.phaseOffset2.get();
  for (const user of galaxy.getChildren()) {
    user.orbitAngle += user.orbitSpeed;
    // notably, the original position of the user is not taken into account here
    // the position of the user is used to calculate its orbitAngle, orbitSpeed, orbitRadius
    // but it is then ignored for the actual positioning of the user inside this ticker.
    user.x =
      centerX +
      Math[inputElements.xFunc.get()](
        user.orbitAngle + user.orbitSpeed * phaseOffset1 + t1,
      ) *
        user.orbitRadius;
    user.y =
      centerY +
      Math[inputElements.yFunc.get()](
        user.orbitAngle + user.orbitSpeed * phaseOffset2 - t2,
      ) *
        user.orbitRadius;

    if (user.rotationSpeed) user.rotation += user.rotationSpeed;
  }
});

// galaxy.usersToTextures();
// it seems like any attempt to remove the particles themselves will just delete the generated texture altogether
// I think I'd have to draw Graphics objects for each user, generate textures/sprites with those...

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
