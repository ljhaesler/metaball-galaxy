import { ConfigHandler } from "@ljhaesler/config-handler";
import { Galaxy, ColorHandler } from "@ljhaesler/galaxy";
import schema from "./config.json" with { type: "json" };

const configHandler = new ConfigHandler(schema);
const colorHandler = new ColorHandler();

const galaxy = new Galaxy(colorHandler);
await galaxy.quickInit();

function updateGalaxy() {
	updateColorHandler();
	generateUsers();
}

function updateColorHandler() {
	const { particleAssociations, particleColors } = configHandler.getValues();

	colorHandler.setAssociations(particleAssociations);
	colorHandler.setColors(particleColors);
}

function generateUsers() {
	galaxy.destroyUsers();

	const {
		galaxyDensity,
		centerBias,
		emailQuantity,
		userQuantity,
		particleSize,
		emptyUserQuantity,
		emptyUserScale,
		emptyUserParticleColors,
	} = configHandler.getValues();

	galaxy.density = galaxyDensity;

	let emptyUserColorHandler;
	if (emptyUserParticleColors.length > 0) {
		emptyUserColorHandler = new ColorHandler();
		emptyUserColorHandler.setAssociations("empty");

		// split here for legacy ConfigHandler .json file imports.
		emptyUserColorHandler.setColors(emptyUserParticleColors.split("/")[0]);
	}

	galaxy.addEmptyUsers({
		particleSize: emptyUserScale,
		particleQuantity: emptyUserQuantity,
		colorHandler: emptyUserColorHandler,
	});

	for (let i = 0; i < userQuantity; i++) {
		galaxy.addUser({
			association:
				colorHandler.associations[
					Math.floor(Math.random() * colorHandler.associations.length)
				],
			particleSize,
			particleQuantity: emailQuantity,
			centerBias,
		});
	}
}

configHandler.onChange(
	updateGalaxy,
	"particleColors",
	"centerBias",
	"emailQuantity",
	"userQuantity",
	"particleSize",
	"particleAssociations",
	"galaxyDensity",
	"emptyUserQuantity",
	"emptyUserScale",
	"emptyUserParticleColors",
);
configHandler.setImportApplyFunction(updateGalaxy);

updateGalaxy();

let t1 = 0;
let t2 = 0;

galaxy.ticker.add(() => {
	const spin1 = configHandler.getValue("spin1");
	const spin2 = configHandler.getValue("spin2");
	const phaseOffset1 = configHandler.getValue("phaseOffset1");
	const phaseOffset2 = configHandler.getValue("phaseOffset2");

	t1 += spin1;
	t2 += spin2;

	galaxy.tick(t1, t2, phaseOffset1, phaseOffset2);
});
