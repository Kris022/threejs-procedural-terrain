import TerrainChunk from "./terrainChunk";

export default class ChunkManager {
  constructor(camera, scene) {
    this.camera = camera; // Reference to the camera
    this.scene = scene;
    this.chunks = []; // Stores cooridnates and mesh of existing chunks

    /* Usefull chunk presets
        chunk size 100 = offset 4.95
        chunk size 256 = offset 4.98
    */
    this.chunkSize = 100;
    this.noiseOffset = 4.95;
    this.bumpScale = 10;

    this.chunkQueue = []; // Holds chunks to be built

    this.chunkRemovalRange = 4; // n chunks range from the camera position

    this.buildStarterChunks();
  }

  manageChunks() {
    // check camera position in frame
    let camX = Math.round(this.camera.position.x / this.chunkSize);
    let camZ = Math.round(this.camera.position.z / this.chunkSize); // when looking from above acts as y cooridante

    this.removeOutOfRangeChunks(camX, camZ);

    for (let x = camX - 2; x <= camX + 2; x++) {
      for (let y = camZ - 2; y <= camZ + 2; y++) {
        // If chunk doesnt exist at current cooridnates
        if (!this.chunks.find((obj) => obj.x == x && obj.y == y)) {
          // Add chunk to the built queue
          this.chunkQueue.push({ x: x, y: y });
          // call buildQueue every frame to build any queued chunks
        }
      }
    }
  } // end of function

  addChunk(cx, cy) {
    // Add chunk
    const chunk = new TerrainChunk(
      cx * this.chunkSize,
      cy * this.chunkSize,
      cx * this.noiseOffset,
      cy * this.noiseOffset,
      this.chunkSize,
      this.bumpScale
    );
    this.scene.add(chunk.mesh);

    this.chunks.push({ mesh: chunk.mesh, x: cx, y: cy });
  }

  removeOutOfRangeChunks(camX, camZ) {
    // Get all chunks outside rendering range
    let removeQueue = this.chunks.filter(
      (chunk) =>
        Math.abs(chunk.x - camX) > this.chunkRemovalRange ||
        Math.abs(chunk.y - camZ) > this.chunkRemovalRange
    );

    if (removeQueue.length === 0) {
      return;
    }

    // Remove old chunks from the chunks array
    this.chunks = this.chunks.filter((item) => !removeQueue.includes(item));

    // Remove chunks from the scene
    removeQueue.forEach((chunk) => {
      this.scene.remove(chunk.mesh);
    });
  }

  processChunkQueue() {
    // Check if the queue is empty
    //When length is 0 undefined
    try {
      if (this.chunkQueue.length === 0) {
        return;
      }
    } catch (error) {
      return;
    }

    // Get the next chunk from the queue
    const chunk = this.chunkQueue.shift();

    // Generate the chunk
    this.addChunk(chunk.x, chunk.y);

    // Schedule the next chunk to be processed in the next frame
    requestAnimationFrame(this.processChunkQueue);
  }

  buildStarterChunks() {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        this.addChunk(x, y);
      }
    }
  }
}
