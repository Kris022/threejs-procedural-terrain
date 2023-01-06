export default class Airplane {
  constructor(x = 0, y = 0, z = 0) {
    // Look
    this.color = 0xf55442;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(5, 5, 5),
      new THREE.MeshBasicMaterial({ color: this.color })
    );

    //
    this.position = new Vector3(x, y, z);
    this.acceleration = 0;
    this.velocity = new Vector3(0, 0, 0);
  }

  moveForward() {

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  }
}
