import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import ChunkManager from "./components/chunkManager";
import Airplane from "./components/Airplane";

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
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.y = 50;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x70a4cc);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#sceneView"),
});

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const player = new Airplane();
scene.add(player.mesh);

const chunkManager = new ChunkManager(player.mesh, scene);

// ------------------------ Helpers ------------------------
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);
function onKeyDown(e) {
  if (e.key == "ArrowUp") {
    player.up = true;
  } else if (e.key == "ArrowDown") {
    player.down = true;
  } else if (e.key == "ArrowLeft") {
    player.left = true;
  } else if (e.key == "ArrowRight") {
    player.right = true;
  }
}

function onKeyUp(e) {
  if (e.key == "ArrowUp") {
    player.up = false;
  } else if (e.key == "ArrowDown") {
    player.down = false;
  } else if (e.key == "ArrowLeft") {
    player.left = false;
  } else if (e.key == "ArrowRight") {
    player.right = false;
  }
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.y = 50;
light.position.x = 20;
light.rotateX(15);
light.castShadow = true;
scene.add(light);
const helper = new THREE.DirectionalLightHelper(light, 10);
//scene.add(helper);

/* 
chunkManager.manageChunks();

chunkManager.processChunkQueue();
*/

let currentTime = Date.now();

function animate() {
  requestAnimationFrame(animate);
  let elapsedTime = Date.now() - currentTime;
  // Update the current time
  currentTime = Date.now();

  player.update(elapsedTime);

  renderer.render(scene, camera);
}
animate();
