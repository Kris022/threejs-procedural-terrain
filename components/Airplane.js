import * as THREE from "three";

export default class Airplane {
  constructor(x = 0, y = 10, z = 0) {
    //
    this.position = new THREE.Vector3(x, y, z);
    this.acceleration = 0;
    this.velocity = new THREE.Vector3(0, 0, 0);

    // Movement
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    // Mesh
    this.color = "yellow";
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(5, 5, 5),
      new THREE.MeshBasicMaterial({ color: this.color })
    );
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);

    this.currentTime = Date.now();

    this.speed = 0.1;
  }

  update(deltaTime) {
    if (this.forward) {
      this.position.z += 0.1* deltaTime;
    }
    if (this.backward) {
        this.position.z -= 0.1* deltaTime;
    }

    this.mesh.position.set(this.position.x, this.position.y, this.position.z );
  }
}
