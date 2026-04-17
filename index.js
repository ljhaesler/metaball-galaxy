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

const blobMaxSize = 2;
// radius can be up to twice this size
const blobColors = ["#ff0000", "#00ff00", "#0000ff", "#888888"];
const blobContainers = [];
const blobContainerSize = 128;

for (let i = 0; i < 5000; i++) {
  const blobContainer = new BlobContainer({
    orbitSpd: 0.000001,
    colors: blobColors,
    containerSize: blobContainerSize,
  });

  const blobSpawner = new BlobSpawner({
    size: blobMaxSize,
    containerSize: blobContainerSize,
  });

  const blobs = blobSpawner.makeBlobs(32);

  for (const blob of blobs) {
    if (Math.random() > 0.5) blob.tint = blobContainer.colors[0];
    else blob.tint = blobContainer.colors[1];
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
  t1 += 0.1;
  t2 += 0;

  for (const container of blobContainers) {
    // root.rotation += 0.0001;
    container.orbitAngle += container.orbitSpeed;
    container.x =
      centerX +
      Math.cos(container.orbitAngle + container.orbitSpeed * 1 + t1) *
        container.orbitRadius;
    container.y =
      centerY +
      Math.sin(container.orbitAngle + container.orbitSpeed * 50000 - t2) *
        container.orbitRadius;
    // container.rotation += container.rotationSpeed;
  }
});

app.stage.addChild(root);

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
