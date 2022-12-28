import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import ChunkGenerator from "./components/chunkGenerator";

const colorCanvas = document.getElementById('color-preview');

//-------------------------- Scene 3D --------------------------\\
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.y = 150;

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	canvas: document.querySelector('#sceneView'),
});

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x70a4cc);



// ----------------------- Terrain ----------------------- \\
const chunk = new ChunkGenerator(scene, colorCanvas);
const a = chunk.createChunk();

chunk.mesh.position.set(100, 10, 10);


// Helpers
const controls = new OrbitControls(camera, renderer.domElement); //
controls.update();
const gridHelper = new THREE.GridHelper(100, 10); // size, divisions

const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.y = 50;
light.position.x = 20;
light.rotateX(15);
light.castShadow = true;
scene.add(light);

const helper = new THREE.DirectionalLightHelper(light, 10);
//scene.add(helper);

// animation
function animation(time) {
	renderer.render(scene, camera);
}
