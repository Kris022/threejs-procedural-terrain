import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createNoise2D } from "simplex-noise";
import alea from "alea";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const canvas = document.getElementById("noise-preview");
const canvas2 = document.getElementById("color-preview");

const noiseGen = createNoise2D(alea("he235llo"));

function noise(nx, ny) {
  // Rescale from -1.0:+1.0 to 0.0:1.0
  return noiseGen(nx, ny) / 2 + 0.5;
}

// Creates noise map
function createNoiseMap(size, offsetX = 0, offsetY = 0) {
  let value = [];
  // freq 5 works best with offset 4.95
  const freq = 5;

  for (let y = 0; y < size; y++) {
    value[y] = [];
    for (let x = 0; x < size; x++) {
      let nx = (x / size - 0.5) * freq + offsetX;
      let ny = (y / size - 0.5) * freq + offsetY;

      // Octaves - noise
      let e =
        1.0 * noise(1 * nx, 1 * ny) +
        0.5 * noise(2 * nx, 2 * ny) +
        0.25 * noise(4 * nx, 4 * ny) +
        0.13 * noise(8 * nx, 8 * ny) +
        0.06 * noise(16 * nx, 16 * ny) +
        0.03 * noise(32 * nx, 32 * ny);
      e = e / (1.0 + 0.5 + 0.25 + 0.13 + 0.06 + 0.03);
      e = Math.pow(e, 5.0);

      value[y][x] = e;
    }
  }
  return value;
}

// Draws noise on canvas
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

// Draws texture on canvas
function createTexture(noiseMap) {
  // Get canvas context
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 100;
  textureCanvas.height = 100;

  const ctx = textureCanvas.getContext("2d");

  // Biomes
  const water = "rgb(98, 154, 245)";
  const sand1 = "rgb(255, 247, 204)";
  const sand2 = "rgb(255, 235, 130)";
  const sand3 = "rgb(245, 218, 66)";
  const grass1 = "rgb(205, 250, 137)";
  const grass2 = "rgb(181, 245, 86)";
  const rock1 = "rgb(153, 153, 153)";
  const rock2 = "rgb(138, 138, 138)";
  const snow = "rgb(224, 224, 224)";

  // map color to pixel on the canvas
  for (let y = 0; y < noiseMap.length; y++) {
    for (let x = 0; x < noiseMap[y].length; x++) {
      let val = noiseMap[y][x];

      if (val < 0.005) {
        ctx.fillStyle = water;
      } else if (val < 0.009) {
        ctx.fillStyle = sand1;
      } else if (val < 0.05) {
        ctx.fillStyle = grass1;
      } else if (val < 0.12) {
        ctx.fillStyle = grass2;
      } else if (val < 0.2) {
        ctx.fillStyle = rock1; // gray
      } else {
        ctx.fillStyle = snow;
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
  mesh.rotateX(-Math.PI / 2);

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
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
camera.position.y = 50;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#sceneView"),
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
let n2 = createNoiseMap(100, 4.95);

const terrain2 = mapToMesh(n2);
terrain2.position.setX(99.9);
scene.add(terrain2);

let n3 = createNoiseMap(100, 0, -4.95);
const terrain3 = mapToMesh(n3);
terrain3.position.setZ(-100);
scene.add(terrain3);

// load once and duplicate so its faster
function loadTree() {
  const loader = new GLTFLoader();

  const obj = new THREE.Object3D();
  loader.load("assets/tree_model2.gltf", function (gltf) {
    obj.add(gltf.scene);
  });
  return obj;
}

function addTree(x, y, z) {
  const modelCopy = pineTree.clone();

  // Set the position of the copy
  modelCopy.position.set(x, y, z);
  scene.add(modelCopy);
}

// movement - please calibrate these values
let xSpeed = 1;
let ySpeed = 1;

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial()
);
cube.position.setY(5);
scene.add(cube);

// ------------------------ Helpers ------------------------

document.onkeydown = function (e) {
	if (e.key == "ArrowUp") {
		cube.position.z -= 1;
	} else if (e.key == "ArrowDown") {
		cube.position.z += 1;
	}
	else if (e.key == "ArrowLeft") {
		cube.position.x -= 1;
	}
	else if (e.key == "ArrowRight") {
		cube.position.x += 1;
	}
	camera.position.z = cube.position.z;
	camera.position.x = cube.position.x;

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
  renderer.render(scene, camera);
}
