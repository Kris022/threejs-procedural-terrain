import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { perlin } from "./noise";
import { math } from "./math";

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
  canvas: document.querySelector("#bg"),
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

// Helpers
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const gridHelper = new THREE.GridHelper(500, 256); // size, divisions
//scene.add(gridHelper);

// Terrain Mesh
const geometry = new THREE.PlaneGeometry(500, 500, 256, 256);
const material = new THREE.MeshNormalMaterial();
const terrain = new THREE.Mesh(geometry, material);
terrain.material.side = THREE.DoubleSide;

terrain.rotateX(-Math.PI / 2);
scene.add(terrain);

// Applying Noise to Terrain

function modifyTerrain() {
  const peak = 60;
  const smoothing = 300;
  const verts = terrain.geometry.attributes.position.array;

  for (let i = 0; i < verts.length; i += 3) {
    verts[i + 2] = peak * Math.random();
    // verts[i+2] = peak * perlin(verts[i]/smoothing, verts[i+1]/smoothing);
  }
  terrain.geometry.attributes.position.needsUpdate = true;
  terrain.geometry.computeVertexNormals();
}

function smoothTerrain() {
  const peak = 128;

  const verts = terrain.geometry.attributes.position.array;

  let b = new THREE.Vector2(0, 0);
  //
  for (let i = 0; i < verts.length; i += 3) {
    // i = x, i+1 = y, i+2=z
    let a = new THREE.Vector2(verts[i], verts[i + 1]);
    let dist = a.distanceTo(b);
    
    let h = 1 - math.sat(dist / 250); // clamps distance between 0, 1
    
    h = h * h * h * (h * (h * 6 - 15) + 10);
    
    // get height then make it position of z axis
    verts[i+2]= h * peak;
    //verts[i+2]= Math.random() * peak;

    console.log("i:"+i, "x:" + verts[i], "y:"+verts[i + 1], "z:"+verts[i + 2]);
  }

  terrain.geometry.attributes.position.needsUpdate = true;
  terrain.geometry.computeVertexNormals();
}

function modifyVerts2() {
  const positionAttribute = geometry.getAttribute("position");

  const vertex = new THREE.Vector3();

  for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i); // read vertex
    // do something with vertex
    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z); // write coordinates back
  }
}

smoothTerrain();

// animation
function animation(time) {
  renderer.render(scene, camera);
}
