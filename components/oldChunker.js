import { Scene } from "three";
import TerrainChunk from "./terrainChunk";

export default class ChunkManager {
  constructor(camera, scene) {
    this.camera = camera; // reference to the camera
    this.scene = scene;
    this.chunks = []; // stores cooridnates of existing chunks

    // chunk size 100 = offset 4.95
    // chunk size 256 = offset 4.98

    this.chunkSize = 256;
    this.noiseOffset = 4.98;
    this.bumpScale = 15;
  }

  // checks if camera is out of bounds
  manageChunks() {
    // check camera position in frame
    // if position is new then add a new chunk
    let camX = Math.round(this.camera.position.x / this.chunkSize);
    let camZ = Math.round(this.camera.position.z / this.chunkSize); // when looking from above acts as y cooridante

    for (let x = camX - 1; x < camX + 2; x++) {
      for (let y = camZ - 1; y < camZ + 2; y++) {
        // If chunk doesnt exist at current cooridnates
        if (!this.chunks.find((obj) => obj.x == x && obj.y == y)) {

          // Add chunk
          const chunk = new TerrainChunk(
            x * this.chunkSize,
            y * this.chunkSize,
            x * this.noiseOffset,
            y * this.noiseOffset,
            this.chunkSize,
            this.bumpScale
          );
          this.scene.add(chunk.mesh);

          this.chunks.push({ x: x, y: y });
        }
      }
    }
  } // end of function
}