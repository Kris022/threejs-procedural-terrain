import HeightMap from "./components/heightMap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Get canvases
const noiseCanvas = document.getElementById("noise-preview");
const colorCanvas = document.getElementById("color-preview");

// Object for generating map data
const mapGenerator = new HeightMap(noiseCanvas.width, noiseCanvas.height);
const heightMap = mapGenerator.generateNoiseMap();  // height map

const d = mapGenerator.drawNoise(noiseCanvas, heightMap);
mapGenerator.drawColorMap(colorCanvas, heightMap);

const f = mapGenerator.gradientFalloff();


function map(val, smin, smax, emin, emax) {
	const t = (val - smin) / (smax - smin);
	return (emax - emin) * t + emin;
}

function applyNoiseToMesh(mesh, data) {
    const verts = mesh.geometry.attributes.position.array;
    let vertIndex = 0;
    const heightMultiplier = 1.25; // 
    
      for (let j = 0; j < data.height; j++) {
          for (let i = 0; i < data.width; i++) {
              const n = j * data.height + i;
              const col = data.data[n * 4]; // the red channel
              let newZ = map(col, 0, 255, -10, 10); // map from 0:255 to -10:10 and set to vertez z

              if (newZ < -1) newZ *= heightMultiplier; // exaggerate the peaks
              //newZ *= heightMultiplier; // exaggerate the peaks
        
              verts[vertIndex + 2] = newZ;
              vertIndex += 3;
          }
      }
  
    // restore mesh position to origin 
   // mesh.position.y += heightMultiplier;
  
  }

//-------------------------- Scene 3D --------------------------\\
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
camera.position.y = 150;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#sceneView"),
});

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

const terrainGeo = new THREE.PlaneGeometry(
  100,100,
  noiseCanvas.width - 1,
  noiseCanvas.height - 1
);
const canvasTexture = new THREE.CanvasTexture(colorCanvas);
const terrainMat = new THREE.MeshPhongMaterial({
  map: canvasTexture,
  wireframe: false,
  flatShading: true,
});

const terrain = new THREE.Mesh(terrainGeo, terrainMat);

applyNoiseToMesh(terrain, d);

terrain.geometry.computeVertexNormals();
terrain.receiveShadow = true;
terrain.castShadow = true;

terrain.rotateX(-Math.PI / 2);
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
