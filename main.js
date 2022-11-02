import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { createNoise2D } from "simplex-noise";

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

//const gridHelper = new THREE.GridHelper(10, 20); // size, divisions
//scene.add(gridHelper);

// Land
let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshNormalMaterial();

let cubes = [];

const noise2D = createNoise2D();

for (let i = -15; i < 15; i++) {
  for (let j = -15; j < 15; j++) {
    geometry.translate(0, 0.01, 0)
    cubes[i] = new THREE.Mesh(geometry, material);

    //let noise = Math.pow(noise2D * 10, i);
    let value2d = noise2D(i, j);
    let cubeSize = value2d * 5;
    if (cubeSize == 0){
      cubeSize = 1;
    }
    cubes[i].scale.y = cubeSize;//Math.pow(value2d, 1.5);
    
    //console.log(Math.pow(value2d, 1.5))

    cubes[i].position.x = i * 0.5;
    cubes[i].position.z = j * 0.5;
    scene.add(cubes[i]);
  }
}

function makeCube(cubes, position, height) {
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshNormalMaterial();


  for (let x=0; x < height; x++) {
    let c = new THREE.Mesh(geometry, material);
    c.position.y = x * 0.5;
  }

}

// animation
function animation(time) {
  renderer.render(scene, camera);
}
