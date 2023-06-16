import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class Airplane {
  constructor(x = 0, y = 10, z = 0) {
    //
    this.acceleration = 0;
    this.acc = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.position = new THREE.Vector3(x, y, z);

    // Movement
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;

    this.maxVel = 0.3;
    this.heading = 0.0;

    this.currentTime = Date.now();

    this.speed = 0.07;
    this.turnSpeed = 0.01;
    this.maxSpeed = 0.1;
    this.minSpeed = 0.05;

    const loader = new GLTFLoader();

    const obj = new THREE.Object3D();
    loader.load("assets/airplane_model.gltf", function (gltf) {
      obj.add(gltf.scene);
    });

    // Mesh
    this.color = "yellow";
    this.mesh = obj;
    this.mesh.rotation.y = Math.PI / 4;
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }

  degrees_to_radians(degrees) {
    const pi = Math.PI;
    return degrees * (pi / 180);
  }

  update() {
    // Yaw the airplane left or right based on the left and right arrow keys
    if (this.left) {
      this.mesh.rotation.y += this.turnSpeed;
    } else if (this.right) {
      this.mesh.rotation.y -= this.turnSpeed;
    }

    if (this.up) {
      this.speed += 0.01;
    }
    else if (this.down) {
      this.speed -= 0.01;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < this.minSpeed) {
      this.speed = this.minSpeed;
    }

    // Move the airplane forward based on its current orientation
    this.mesh.position.x += Math.sin(this.mesh.rotation.y) * this.speed;
    this.mesh.position.y += Math.sin(this.mesh.rotation.x) * this.speed;
    this.mesh.position.z += Math.cos(this.mesh.rotation.y) * this.speed;
  }
}
