import { createNoise2D } from "simplex-noise";
import alea from "alea";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';1

const canvas = document.getElementById("noise-preview");

let gen = createNoise2D(alea(""));
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
function noise(nx, ny) {
  // Rescale from -1.0:+1.0 to 0.0:1.0
  return gen(nx, ny) / 2 + 0.5;
}

function octave(nx, ny, octaves) {
  let val = 0.15; // softness
  let freq = 2.75; // Scale/Zoom value/mountains
  let max = 1; // divisor
  let amp = 1;

  for (let i = 0; i < octaves; i++) {
    val += noise(nx * freq, ny * freq) * amp;
    max += amp;
    amp /= 2;
    freq *= 2;
  }

  return val / max;
}

function createNoiseMap(falloff) {
  let offsetX = 0.0,
    offsetY = 0.0;
  let frequency = 4.0; // scale
  let octaves = 4;
  let amplitude;
  let presistance;
  let lacunaity;

  let value = [];
  for (let y = 0; y < canvas.height; y++) {
    value[y] = [];
    for (let x = 0; x < canvas.width; x++) {
      let nx = x / canvas.width - 0.5 + offsetY;
      let ny = y / canvas.height - 0.5 + offsetX;

      let d = 1 - (1 - Math.pow(nx, 2)) * (1 - Math.pow(ny, 2));
      let e = octave(nx, ny, 3);

    //  e = e + (0.1 - d); // /2
    //  console.log(e);
      if (falloff.length != 0) {
        e = clamp(e - falloff[y][x], 0, 1)
      }
      
      value[y][x] = e; // Math.pow(e, 1);//noise(nx * frequency, ny * frequency);
    }
  }

  return value;
}

function createFllOffMap() {
  const a = 1;
  const b = 5;

  let map = [];
  for (let y = 0; y < canvas.height; y++) {
    map[y] = [];
    for (let x  = 0; x < canvas.width; x++) {
      let sampleX = x / canvas.height * 2 - 1; // get sample in range [-1, 1]
      let sampleY = y / canvas.height * 2 - 1;
      let val = Math.max( Math.abs(sampleX), Math.abs(sampleY));
      val = Math.pow(val, a) / (Math.pow(val, a) + Math.pow( b - b * val, a));
      map[y][x] = val;
    }
  }
  return map;
}

function drawNoise(canvas, noise) {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.width; j++) {
      //  let val = noise[i][j] * 100;
      let val = noise[i][j] * 225;

      //	ctx.fillStyle = `hsl(136, 0%,${val}%)`;
      ctx.fillStyle = `rgb(${val}, ${val},${val})`;
      ctx.fillRect(i, j, 1, 1);
    }
  }

  return ctx.getImageData(0, 0, canvas.width, canvas.height);

}

function map(val, smin, smax, emin, emax) {
	const t = (val - smin) / (smax - smin);
	return (emax - emin) * t + emin;
}

function applyNoiseToMesh(mesh, data) {
  const verts = mesh.geometry.attributes.position.array;
  let vertIndex = 0;
  
	for (let j = 0; j < data.height; j++) {
		for (let i = 0; i < data.width; i++) {
			const n = j * data.height + i;
			const col = data.data[n * 4]; // the red channel
			let newZ = map(col, 0, 255, -10, 10); // map from 0:255 to -10:10 and set to vertez z

			if (newZ > 2.5) newZ *= 1.3; // exaggerate the peaks

			verts[vertIndex + 2] = newZ;
			vertIndex += 3;
		}
	}
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


// Data
const noiseMap = createNoiseMap(createFllOffMap());
const data = drawNoise(canvas, noiseMap);

// Plane Geometry
const geo = new THREE.PlaneGeometry(data.width, data.height, data.width - 1, data.height - 1);
const mat = new THREE.MeshPhongMaterial( {
  wireframe: false,
  flatShading: false,
});

const terrain = new THREE.Mesh( geo, mat );


applyNoiseToMesh(terrain, data);

terrain.geometry.computeVertexNormals();
terrain.receiveShadow = true;
terrain.castShadow = true;

terrain.rotateX((-Math.PI) / 2);
scene.add(terrain);




// Helpers
const controls = new OrbitControls(camera, renderer.domElement); // new FirstPersonControls(camera, renderer.domElement); // new OrbitControls( camera, renderer.domElement ); // new FlyControls( camera, renderer.domElement );
controls.update();
const gridHelper = new THREE.GridHelper(100, 10); // size, divisions

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

/*
// Map values to range [0.0, 1.0]
function map_to_range(x) {
	return ((x + Math.abs(x)) % 2) / 2
}

let elevationap = new Array();

let frequency = 1; // Scale
let amplitude = 1; //
let offset;


for (let y = 0; y < canvas.height; y++) {
	elevationap.push([]);
	for (let x = 0; x < canvas.width; x++) {
		let nx = x / canvas.width - 0.5;
		let ny = y / canvas.height - 0.5;

    let e = (1 * noise(nx * 1, ny * 1)) +
    (0.5 * noise(nx * 2, ny * 2)) +
    (0.25 * noise(nx * 4, ny * 4));

    e = e/(1.0+0.5+0.25);

    let val = map_to_range(Math.pow(e, 4));

    elevationap[y].push(val);
	}
}
*/
/*

let e = (amplitude * noise(nx * frequency, ny * frequency)) +
(amplitude/2 * noise(nx * (frequency*2), ny * (frequency*2))) +
(amplitude/2/2 * noise(nx * (frequency*2*2), ny * (frequency*2*2)));

*/
