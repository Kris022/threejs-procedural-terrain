import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import NoiseScript from "./components/noiseScript";
import MapGenerator from "./components/mapGenerator";

// Noise Preview canvas
const canvas = document.getElementById("noise-preview");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let scale = 27;
let octaves = 4;
let presistance = 0.5;
let lacunarity = 1.87;
let seed = 100;
let offset = {x:0, y:0};

let noiseMap = new NoiseScript().generateNoiseMap(canvas.width, canvas.height, scale, octaves, presistance, lacunarity, seed, offset);
let colorMap = new MapGenerator(canvas.width, canvas.height, ctx, noiseMap);
colorMap.drawNoise();


// Scene 3D
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
camera.position.y = 500;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#sceneView"),
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

// Helpers
const controls = new OrbitControls( camera, renderer.domElement );// new FirstPersonControls(camera, renderer.domElement); // new OrbitControls( camera, renderer.domElement ); // new FlyControls( camera, renderer.domElement );
controls.update();
const gridHelper = new THREE.GridHelper(500, 256); // size, divisions
//scene.add(gridHelper);
const directionalLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(directionalLight);




// animation
function animation(time) {
  renderer.render(scene, camera);
}
