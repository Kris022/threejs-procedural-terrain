import * as THREE from "three";
import { GridHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#sceneView"),
});

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Create the airplane model and add it to the scene
const airplane = new THREE.Mesh(
  new THREE.BoxGeometry(1, 5, 1),
  new THREE.MeshNormalMaterial(),
);

scene.add(airplane);

// Set the initial position and orientation of the airplane
airplane.position.z = 0;
airplane.rotation.x = Math.PI / 2;

// Set up the keyboard controls for the airplane
class Controls {
  constructor() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.a = false;
    this.d = false;
  }
}

const controls = new Controls();

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

function onKeyDown(e) {
  if (e.key == "ArrowUp") {
    controls.up = true;
  } else if (e.key == "ArrowDown") {
    controls.down = true;
  } else if (e.key == "ArrowLeft") {
    controls.left = true;
  } else if (e.key == "ArrowRight") {
    controls.right = true;
  } else if (e.key == "a") {
    controls.a = true;
  } else if (e.key == "d") {
    controls.d = true;
  }
}

function onKeyUp(e) {
  if (e.key == "ArrowUp") {
    controls.up = false;
  } else if (e.key == "ArrowDown") {
    controls.down = false;
  } else if (e.key == "ArrowLeft") {
    controls.left = false;
  } else if (e.key == "ArrowRight") {
    controls.right = false;
  }else if (e.key == "a") {
    controls.a = false;
  }else if (e.key == "d") {
    controls.d = false;
  }
}


const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const ghelper = new GridHelper(10, 10);
scene.add(ghelper);

// Update the airplane's position and orientation based on the keyboard controls
function update() {
  // Yaw the airplane left or right based on the left and right arrow keys
  if (controls.left) {
    airplane.rotation.y += 0.1;
  } else if (controls.right) {
    airplane.rotation.y -= 0.1;
  }

  // Pitch the airplane up or down based on the up and down arrow keys
  if (controls.up) {
    airplane.rotation.x += 0.1;
  } else if (controls.down) {
    airplane.rotation.x -= 0.1;
  }

  // Roll the airplane left or right based on the a and d keys
  if (controls.a) {
    airplane.rotation.z += 0.1;
  } else if (controls.d) {
    airplane.rotation.z -= 0.1;
  }

  // Move the airplane forward based on its current orientation
  airplane.position.x += Math.sin(airplane.rotation.y) * 0.1;
  airplane.position.y += Math.sin(airplane.rotation.x) * 0.1;
  airplane.position.z -= Math.cos(airplane.rotation.y) * 0.1;

  //controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

// Start the update loop
update();
