import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import TerrainChunk from "./components/terrainChunk";
import ChunkManager from "./components/chunkManager";

const canvas = document.getElementById("noise-preview");
const canvas2 = document.getElementById("color-preview");

// Draws noise on canvas for debuging
function drawNoise(noiseMap, canvas) {
  // Get canvas context
  const ctx = canvas.getContext("2d");
  // map color to pixel on the canvas
  for (let y = 0; y < noiseMap.length; y++) {
    for (let x = 0; x < noiseMap[y].length; x++) {
      let val = noiseMap[y][x] * 255;
      ctx.fillStyle = `rgb(${val}, ${val}, ${val})`; // set colors value
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

// ------------------------------------- Scene 3D -------------------------------------
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
camera.position.y = 100;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x70a4cc);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#sceneView"),
});

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

// 2.98 = 100 segments
// noise 100 = offset = 4.95
// noise 256 offset = 4.98

// chunk size = 100
// noise offset = 4.95

const chunkManager = new ChunkManager(camera, scene);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshBasicMaterial({ color: "yellow" })
);

cube.position.setY(5);
scene.add(cube);

// ------------------------ Helpers ------------------------
document.addEventListener("keydown", onKeyDown);
const speed = 1.2;
function onKeyDown(e) {
  if (e.key == "ArrowUp") {
    cube.position.z -= speed;
  } else if (e.key == "ArrowDown") {
    cube.position.z += speed;
  } else if (e.key == "ArrowLeft") {
    cube.position.x -= speed;
  } else if (e.key == "ArrowRight") {
    cube.position.x += speed;
  }
  camera.position.z = cube.position.z;
  camera.position.x = cube.position.x;
  chunkManager.manageChunks();
 // camera.lookAt(cube.position);
}

const controls = new OrbitControls(camera, renderer.domElement); // new FirstPersonControls(camera, renderer.domElement); // new OrbitControls( camera, renderer.domElement ); // new FlyControls( camera, renderer.domElement );
controls.update();

const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.y = 50;
light.position.x = 20;
light.rotateX(15);
light.castShadow = true;
scene.add(light);
const helper = new THREE.DirectionalLightHelper(light, 10);
//scene.add(helper);

// animation
function animation(time) {
  chunkManager.processChunkQueue();

  renderer.render(scene, camera);
}
