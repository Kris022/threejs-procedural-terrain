import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import NoiseScript from './components/noiseScript';
import MapGenerator from './components/mapGenerator';

// Noise Preview canvas
const canvas = document.getElementById('noise-preview');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let scale = 60;
let octaves = 4;
let presistance = 0.5;
let lacunarity = 1.5;
let seed = 100;
let offset = { x: 0, y: 0 };

let noiseMap = new NoiseScript().generateNoiseMap(
	canvas.width,
	canvas.height,
	scale,
	octaves,
	presistance,
	lacunarity,
	seed,
	offset
);
let colorMap = new MapGenerator(canvas.width, canvas.height, ctx, noiseMap);
colorMap.drawNoise();

// Scene 3D
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.y = 150;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	canvas: document.querySelector('#sceneView'),
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color(0x70a4cc);

// Helpers
const controls = new OrbitControls(camera, renderer.domElement); // new FirstPersonControls(camera, renderer.domElement); // new OrbitControls( camera, renderer.domElement ); // new FlyControls( camera, renderer.domElement );
controls.update();
const gridHelper = new THREE.GridHelper(100, 10); // size, divisions
//scene.add(gridHelper);

const light = new THREE.DirectionalLight( 0xffffff, 0.7);
light.position.y=100;
light.position.x = 10;
light.rotateX(10);
light.castShadow = true

scene.add(light)
const helper = new THREE.DirectionalLightHelper( light, 5 );
scene.add( helper );


const terrainGeo = new THREE.PlaneGeometry(100, 100, 99, 99); // 10,000 vertices
terrainGeo.normalsNeedUpdate = true;
//const terrainMat = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide, wireframe: true });
const terrainMat = new THREE.MeshPhysicalMaterial( {
    clearcoat: 0.8,
    clearcoatRoughness: 1.0,
    metalness: 0,
    roughness: 0.5,
    color: 0xFFFFFF,
    normalScale: new THREE.Vector2( 0.15, 0.15 )
  } );
//const terrainMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, wireframe: false });
const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
terrainMesh.rotateX((-Math.PI) / 2);


// Get verticies
function debugVerts() {
	//	console.log(noiseMap.length*noiseMap[0].length);

	let verts = terrainMesh.geometry.attributes.position.array; // get vertecies of plane
	console.log(verts.length / 3);
	let x = 3;
	let y = x + 1;
	let z = x + 2;
	console.log('Vert x:' + verts[0] + ' y:' + verts[1] + ' z:' + verts[2]);
	verts[z] = 10;
	console.log('Vert x:' + verts[0] + ' y:' + verts[1] + ' z:' + verts[2]);
	/*	for (let i = 0; i < verts.length; i = i + 3) {
		verts[i + 2] *= heightMultiplier; // z cooridante of vertex
	}
	*/
}

function applyHeight(heightMultiplier) {
	let verts = terrainMesh.geometry.attributes.position.array; // get vertecies of plane

	let vertexIndex = 0;

	let maxHeight = Number.NEGATIVE_INFINITY;

	for (let y = 0; y < noiseMap.length; y++) {
		for (let x = 0; x < noiseMap[y].length; x++) {
			if (noiseMap[y][x] > maxHeight) {
				maxHeight = noiseMap[y][x];
			}
			let newZ = noiseMap[y][x];
			if (noiseMap[y][x] > 10) {
				newZ = 10;
			}
			else if (newZ < -10) {
				newZ = 10;
			}
			verts[vertexIndex + 2] = newZ;

			vertexIndex += 3; // vindex+2 = z coordinate of vertex
		}
	}

}

applyHeight(5);
terrainGeo.computeVertexNormals();
terrainGeo.castShadow = true;
terrainGeo.receiveShadow = true;

scene.add(terrainMesh);

// animation
function animation(time) {
	renderer.render(scene, camera);
}
