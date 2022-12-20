import * as THREE from "three";

export default class Chunk {
  constructor(scene) {
    this.size = { width: 500, height: 500, wSegment: 128, hSegment: 128 };
    
    this.geometry = new THREE.PlaneGeometry(
      this.size.width,
      this.size.height,
      this.size.wSegment,
      this.size.hSegment
    );
    this.material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene = scene;
    this.mesh.rotateX(-Math.PI / 2);

    this.scene.add(this.mesh);
  }
}
