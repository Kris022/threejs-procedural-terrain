import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createNoise2D } from 'simplex-noise';

/* Noise Preview canvas
const canvas = document.getElementById('noise-preview');
const ctx = canvas.getContext('2d');

const colorCanvas = document.getElementById('color-preview');

ctx.fillStyle = 'white';
*/
//ctx.fillRect(0, 0, canvas.width, canvas.height);

// New code

let noise2D = createNoise2D();

function map(val, smin, smax, emin, emax) {
	const t = (val - smin) / (smax - smin);
	return (emax - emin) * t + emin;
}
function noise(nx, ny) {
	// Re-map from -1.0:+1.0 to 0.0:1.0
	return map(noise2D(nx, ny), -1, 1, 0, 1);
}
//stack some noisefields together
function octave(nx, ny, octaves) {
	let val = 0.65;
	let freq = 1.5;
	let max = 0;
	let amp = 1;
	for (let i = 0; i < octaves; i++) {
		val += noise(nx * freq, ny * freq) * amp;
		max += amp;
		amp /= 2;
		freq *= 2;
	}
	return val / max;
}

//generate grayscale image of noise
const canvas = document.getElementById('noise-preview');

function generateTexture(canvas) {
	const c = canvas.getContext('2d');
	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < canvas.width; i++) {
		for (let j = 0; j < canvas.height; j++) {
			let v = octave(i / canvas.width, j / canvas.height, 16);
			const per = (100 * v).toFixed(2) + '%';
			c.fillStyle = `rgb(${per},${per},${per})`;
			c.fillRect(i, j, 1, 1);
		}
	}
	return c.getImageData(0, 0, canvas.width, canvas.height);
}



// Scene 3D
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

scene.background = new THREE.Color(0x70a4cc);

////////////////// Objects //////////////////
let data = generateTexture(canvas); // canvas data

const geo = new THREE.PlaneGeometry(data.width, data.height, data.width - 1, data.height - 1); // geometry
const verts = geo.attributes.position.array;
console.log(geo.attributes);
let vertIndex = 0; // vertIndex + 2 = z coordinate

//assign vert data from the canvas
function modifyVertices() {
	for (let j = 0; j < data.height; j++) {
		for (let i = 0; i < data.width; i++) {
			const n = j * data.height + i;
			const nn = j * (data.height + 1) + i;
			const col = data.data[n * 4]; // the red channel
			let newZ = map(col, 0, 255, -10, 10); // map from 0:255 to -10:10 and set to vertez z

			if (newZ > 2.5) newZ *= 1.3; // exaggerate the peaks
			/*
			verts[vertIndex] += map(Math.random(),0,1,-0.5,0.5) //jitter x
			verts[vertIndex + 1] += map(Math.random(),0,1,-0.5,0.5) //jitter y
			*/
			verts[vertIndex + 2] = newZ;
			vertIndex += 3;
		}
	}
}


// ------------------ MATERIALS ------------------
const smat = new THREE.MeshPhongMaterial({
	wireframe: false,
	flatShading: false,
});

const texture = new THREE.CanvasTexture(canvas);
// make bump map darker to exagurate shadows
const mat = new THREE.MeshPhongMaterial({
	wireframe: false,
	displacementMap: texture,
	bumpMap: texture,
	displacementScale: 20,
});

//const mesh = new THREE.Mesh(geo, mat);
modifyVertices();
//applyColor();


const mesh = new THREE.Mesh(geo, smat);

mesh.rotateX((-Math.PI) / 2);

mesh.geometry.computeVertexNormals();
mesh.receiveShadow = true;
mesh.castShadow = true;
scene.add(mesh);

// Helpers
const controls = new OrbitControls(camera, renderer.domElement); // new FirstPersonControls(camera, renderer.domElement); // new OrbitControls( camera, renderer.domElement ); // new FlyControls( camera, renderer.domElement );
controls.update();
const gridHelper = new THREE.GridHelper(100, 10); // size, divisions
//scene.add(gridHelper);

const light = new THREE.DirectionalLight(0xffffff, 0.8);
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
