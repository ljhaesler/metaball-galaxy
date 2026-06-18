// I need as many ParticleSpawners are there are colour sets
// these ParticleSpawners are used to populate UserEmailSystems with particles
// and the Galaxy itself is populated with UserEmailSystems
// GalaxyDensity should be defined on the Galaxy itself
// but the UserEmailSystems need the GalaxyDensity

import { Application } from "pixi.js";
import { Galaxy } from "./modules/Galaxy.js";
import { ConfigHandler } from "@ljhaesler/config-handler";
import schema from "./config.json" with { type: "json" };

const app = new Application();
await app.init({
	background: "#000000",
	backgroundAlpha: 1,
	resizeTo: window,
	antialias: true,
});
document.body.appendChild(app.canvas);
export default app;

const configHandler = new ConfigHandler(schema);

let galaxy;
function generateGalaxy() {
	// if the app already contains particles, we need to wipe them to generate new ones
	if (app.stage.children.length > 0) app.stage.removeChildren();
	galaxy = new Galaxy(configHandler.getValues());
	galaxy.generateSpawners();
	galaxy.generateEmptyUserSpawners();
	galaxy.generateUsers();
	galaxy.generateEmptyUsers();

	app.stage.addChild(galaxy);
}

// generate the first galaxy before any inputs have changed
generateGalaxy();

configHandler.onChange(
	generateGalaxy,
	"galaxyDensity",
	"containerSize",
	"rotationSpeed",
	"emailQuantity",
	"userQuantity",
	"centerBias",
	"particleColors",
	"particleAlpha",
	"emptyUserScale",
	"emptyUserQuantity",
	"emptyUserParticleColors",
);

configHandler.setImportApplyFunction(generateGalaxy);
window.addEventListener("resize", () => {
	app.resize();
});

let t1 = 0;
let t2 = 0;

app.ticker.add(() => {
	const centerX = app.screen.width / 2;
	const centerY = app.screen.height / 2;
	t1 += configHandler.getValue("spin1") || 0;
	t2 += configHandler.getValue("spin2") || 0;
	const phaseOffset1 = configHandler.getValue("phaseOffset1");
	const phaseOffset2 = configHandler.getValue("phaseOffset2");
	for (const user of galaxy.getChildren()) {
		user.orbitAngle += user.orbitSpeed;
		// notably, the original position of the user is not taken into account here
		// the position of the user is used to calculate its orbitAngle, orbitSpeed, orbitRadius
		// but it is then ignored for the actual positioning of the user inside this ticker.
		user.x =
			centerX +
			Math[configHandler.getValue("xFunc")](
				user.orbitAngle + user.orbitSpeed * phaseOffset1 + t1,
			) *
				user.orbitRadius;
		user.y =
			centerY +
			Math[configHandler.getValue("yFunc")](
				user.orbitAngle + user.orbitSpeed * phaseOffset2 - t2,
			) *
				user.orbitRadius;

		if (user.rotationSpeed) user.rotation += user.rotationSpeed;
	}
});

// galaxy.usersToTextures();
// it seems like any attempt to remove the particles themselves will just delete the generated texture altogether
// I think I'd have to draw Graphics objects for each user, generate textures/sprites with those...
