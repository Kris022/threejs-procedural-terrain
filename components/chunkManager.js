import { Scene } from "three";
import TerrainChunk from "./terrainChunk";

export default class ChunkManager {
  constructor(camera, scene) {
    this.camera = camera; // reference to the camera
    this.scene = scene;
    this.chunks = [{ x: 0, y: 0 }]; // stores cooridnates of existing chunks

    this.noiseOffset = 4.95;
  }

  // checks if camera is out of bounds
  isOutOfBounds() {
    // check camera position in frame
    // if position is new then add a new chunk
    let camX = Math.round(this.camera.position.x / 100);
    let camZ = Math.round(this.camera.position.z / 100); // when looking from above acts as y cooridante

    if (this.chunks.find((obj) => obj.x == camX && obj.y == camZ)) {
      console.log("chunk exists");
    } else {
      const chunk = new TerrainChunk(
        camX * 100,
        camZ * 100,
        camX * this.noiseOffset,
        camZ * this.noiseOffset
      );
      this.scene.add(chunk.mesh);

      this.chunks.push({ x: camX, y: camZ });
      console.log("adding chunk");
    }
  }
}
