import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { createNoise2D } from "simplex-noise";
import { WireframeGeometry } from "three";

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
document.body.appendChild(renderer.domElement);

// Helpers
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const planeGeometry = new THREE.PlaneGeometry( 1, 1 );
const planeMaterial = new THREE.MeshNormalMaterial();
const basePlane = new THREE.Mesh( planeGeometry, planeMaterial );
scene.add( basePlane );

basePlane.material.side = THREE.DoubleSide;
basePlane.rotateX( -Math.PI / 2 );

let verts = basePlane.geometry.attributes.position.array;
verts[2] = -2;
for (let i=0; i < verts.length; i=i+3){
  console.log(verts[i], verts[i+1], verts[i+2])
}

camera.position.z = 1.5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
