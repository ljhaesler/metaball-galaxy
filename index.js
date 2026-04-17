import { Application, Point, Filter, Container, FillGradient } from "pixi.js";
import "pixi.js/advanced-blend-modes";
import { BlobContainer } from "./modules/BlobContainer.js";
import { BlobSpawner } from "./modules/Blob.js";

const app = new Application();
await app.init({
  background: "#000000ff",
  resizeTo: window,
  antialias: false,
});
document.body.appendChild(app.canvas);
export default app;

const blobMinSize = 1;
// radius can be up to twice this size
const blobColors = [0xff0000, 0x00ff00, 0x0000ff];
const blobContainers = [];
const blobContainerSize = 32;
const blobGradient = new FillGradient({
  type: "radial",
  center: { x: 0.5, y: 0.5 },
  innerRadius: 0,
  outerCenter: { x: 0.5, y: 0.5 },
  outerRadius: 0.5,
  colorStops: [
    { offset: 0, color: "#ffffffff" }, // Center color
    { offset: 1, color: "#00000000" }, // Edge color
  ],
});

for (let i = 0; i < 1024; i++) {
  const blobContainer = new BlobContainer({
    orbitSpd: 0.000002,
    containerSize: blobContainerSize,
  });

  const blobSpawner = new BlobSpawner({
    size: blobMinSize,
    colors: blobColors,
    gradient: blobGradient,
    containerSize: blobContainerSize,
  });

  const blobs = blobSpawner.makeBlobs(128);

  const blobColor1 = blobColors[Math.floor(Math.random() * blobColors.length)];
  const blobColor2 = blobColors[Math.floor(Math.random() * blobColors.length)];
  for (const blob of blobs) {
    if (Math.random() > 0.5) blob.tint = blobColor1;
    else blob.tint = blobColor2;
  }

  blobContainer.addParticle(...blobs);
  blobContainers.push(blobContainer);
}

let t1 = 0;
let t2 = 0;
const centerX = app.screen.width / 2;
const centerY = app.screen.height / 2;

const root = new Container();
root.origin.set(root.width / 2, root.height / 2);
root.addChild(...blobContainers);

app.ticker.add(() => {
  t1 += 0;
  t2 += 0.001;

  for (const container of blobContainers) {
    // root.rotation += 0.0001;
    container.orbitAngle += container.orbitSpeed;
    container.x =
      centerX +
      Math.cos(container.orbitAngle + container.orbitSpeed * 8192 + t1) *
        container.orbitRadius;
    container.y =
      centerY +
      Math.sin(container.orbitAngle + container.orbitSpeed * 4096 - t2) *
        container.orbitRadius;
    container.rotation += container.rotationSpeed;
  }
});

app.stage.addChild(root);
