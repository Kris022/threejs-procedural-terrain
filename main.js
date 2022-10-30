import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);
camera.position.z = 10;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#bg"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

// Helpers
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const gridHelper = new THREE.GridHelper(10, 20); // size, divisions
scene.add(gridHelper);

// Land
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshNormalMaterial();

let cubes = [];

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    cubes[i] = new THREE.Mesh(geometry, material);
    cubes[i].position.x = i * 0.5;
    cubes[i].position.z = j * 0.5;
    scene.add(cubes[i]);
  }
}

// animation
function animation(time) {
  renderer.render(scene, camera);
}
