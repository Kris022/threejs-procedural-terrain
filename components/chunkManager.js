import TerrainChunk from "./terrainChunk";

export default class ChunkManager {
  constructor(camera, scene) {
    this.camera = camera; // reference to the camera
    this.scene = scene;
    this.chunks = []; // stores cooridnates of existing chunks

    // chunk size 100 = offset 4.95
    // chunk size 256 = offset 4.98

    this.chunkSize = 100;
    this.noiseOffset = 4.95;
    this.bumpScale = 15;

    this.queue = []; // chunkQueue

    this.buildStarterChunks();
  }

  // checks if camera is out of bounds
  manageChunks() {
    // check camera position in frame
    // if position is new then add a new chunk
    let camX = Math.round(this.camera.position.x / this.chunkSize);
    let camZ = Math.round(this.camera.position.z / this.chunkSize); // when looking from above acts as y cooridante

    for (let x = camX - 4; x < camX + 5; x++) {
      for (let y = camZ - 4; y < camZ + 5; y++) {
        // If chunk doesnt exist at current cooridnates
        if (!this.chunks.find((obj) => obj.x == x && obj.y == y)) {
          // add all chunks to be built to the queue
          this.queue.push({ x: x, y: y });
          // call buildQueue every frame to build any queued chunks

         // this.addChunk(x, y);
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

    this.chunks.push({ x: cx, y: cy });
  }

  processChunkQueue() {
    // Check if the queue is empty
    if (this.queue.length === 0) {
      return;
    }
  
    // Get the next chunk from the queue
    const chunk = this.queue.shift();
  
    // Generate the chunk
    this.addChunk(chunk.x, chunk.y);
  
    // Schedule the next chunk to be processed in the next frame
    requestAnimationFrame(this.processChunkQueue);
  }

  // add chunks in queue
  buildChunksInQueue(queue) {
    for (let index = 0; index < queue.length; index++) {
      const chunk = new TerrainChunk(
        queue[index].x * this.chunkSize,
        queue[index].y * this.chunkSize,
        queue[index].x * this.noiseOffset,
        queue[index].y * this.noiseOffset,
        this.chunkSize,
        this.bumpScale
      );
      this.scene.add(chunk.mesh);

      this.chunks.push({ x: queue[index].x, y: queue[index].y });
    }
  }

  buildStarterChunks() {
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        this.addChunk(x, y);
      }
    }
  }
}
