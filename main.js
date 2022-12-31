import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createNoise2D } from 'simplex-noise';
import alea from 'alea';

const canvas = document.getElementById('noise-preview');
const canvas2 = document.getElementById('color-preview');

const noiseGen = createNoise2D(alea('hello'));

function noise(nx, ny) {
	// Rescale from -1.0:+1.0 to 0.0:1.0
	return noiseGen(nx, ny) / 2 + 0.5;
}

// Creates noise map
function createNoiseMap(size, offsetX = 0, offsetY = 0) {
	let value = [];
	const freq = 3;

	for (let y = 0; y < size; y++) {
		value[y] = [];
		for (let x = 0; x < size; x++) {
			let nx = (x / size - 0.5) * freq + offsetX;
			let ny = (y / size - 0.5) * freq + offsetY;
			value[y][x] = noise(nx, ny);
		}
	}
	return value;
}

// Draws noise on canvas
function drawNoise(noiseMap, canvas) {
	// Get canvas context
	const ctx = canvas.getContext('2d');
	// map color to pixel on the canvas
	for (let y = 0; y < noiseMap.length; y++) {
		for (let x = 0; x < noiseMap[y].length; x++) {
			let val = noiseMap[y][x] * 255;
			ctx.fillStyle = `rgb(${val}, ${val}, ${val})`; // set colors value
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

// Draws texture on canvas
function createTexture(noiseMap) {
	// Get canvas context
	const textureCanvas = document.createElement('canvas');
	textureCanvas.width = 100;
	textureCanvas.height = 100;

	const ctx = textureCanvas.getContext('2d');

	// Biomes
	const groundColor = 'rgb(98, 158, 41)';
	const mountainColor = 'rgb(135, 144, 150)';
	const sand = 'rgb(230, 221, 142)';
	const water = 'rgb(74, 133, 217)';

	// map color to pixel on the canvas
	for (let y = 0; y < noiseMap.length; y++) {
		for (let x = 0; x < noiseMap[y].length; x++) {
			let val = noiseMap[y][x];
			if (val > 0.6) {
				ctx.fillStyle = mountainColor;
			} else if (val > 0.4) {
				ctx.fillStyle = sand;
			} else if (val > 0.1) {
				ctx.fillStyle = groundColor;
			} else {
				ctx.fillStyle = water;
			}

			ctx.fillRect(x, y, 1, 1);
		}
	}

	return textureCanvas;
}


// Maps noise to mesh
function mapToMesh(noiseMap) {
	const chunkSize = noiseMap.length;

	const geo = new THREE.PlaneGeometry(100, 100, chunkSize - 1, chunkSize - 1);
	const texture = new THREE.CanvasTexture(createTexture(noiseMap));
	const mat = new THREE.MeshPhongMaterial({
		map: texture,
		wireframe: false,
		flatShading: true,
	});

	const mesh = new THREE.Mesh(geo, mat);
	mesh.rotateX((-Math.PI) / 2);

	const verts = mesh.geometry.attributes.position.array;
	let vertIndex = 0;

	for (let j = 0; j < chunkSize; j++) {
		for (let i = 0; i < chunkSize; i++) {
			let newZ = noiseMap[j][i];

			verts[vertIndex + 2] = newZ * 10;
			vertIndex += 3;
		}
	}

	mesh.receiveShadow = true;
	mesh.castShadow = true;

	return mesh;
}

//functon create chunk(x, y, )
// new noise map
// map to mesh

// ------------------------------------- Scene 3D -------------------------------------
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.y = 150;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	canvas: document.querySelector('#sceneView'),
});

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

const noiseMap = createNoiseMap(100);
drawNoise(noiseMap, canvas);

const terrain = mapToMesh(noiseMap);
scene.add(terrain);
// 2.98 = 100 segments
let n2 = createNoiseMap(100, 2.98);

const terrain2 = mapToMesh(n2);
terrain2.position.setX(99.9);
scene.add(terrain2);

let n3 = createNoiseMap(100, 0, -2.98);
const terrain3 = mapToMesh(n3);
terrain3.position.setZ(-100);
scene.add(terrain3);

// ------------------------ Helpers ------------------------
const controls = new OrbitControls(camera, renderer.domElement); // new FirstPersonControls(camera, renderer.domElement); // new OrbitControls( camera, renderer.domElement ); // new FlyControls( camera, renderer.domElement );
controls.update();

const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.y = 50;
light.position.x = 20;
light.rotateX(15);
light.castShadow = true;
scene.add(light);
const helper = new THREE.DirectionalLightHelper(light, 10);
scene.add(helper);

// animation
function animation(time) {
	renderer.render(scene, camera);
}
