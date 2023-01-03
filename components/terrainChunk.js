import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import alea from "alea";

export default class TerrainChunk {
  constructor(cx=0, cy=0, ox=0, oy=0, chunkSize=100, bumpScale=10) {
    // Simplex noise generator
    this.noiseGen = createNoise2D(alea("he235llo"));
    // Create noise map for the chunk
    this.noiseMap = this.createNoiseMap(chunkSize, ox, oy);
    // Map noise to a plane geometry and crate a mesh
    this.mesh = this.mapToMesh(this.noiseMap, bumpScale);

    // Place the mesh at chunk cooridnates
    this.mesh.position.set(cx, 0, cy);
  }

  noise(nx, ny) {
    // Rescale from -1.0:+1.0 to 0.0:1.0
    return this.noiseGen(nx, ny) / 2 + 0.5;
  }

  createNoiseMap(size, offsetX = 0, offsetY = 0) {
    let value = [];
    // freq 5 works best with offset 4.95
    const freq = 5;

    for (let y = 0; y < size; y++) {
      value[y] = [];
      for (let x = 0; x < size; x++) {
        let nx = (x / size - 0.5) * freq + offsetX;
        let ny = (y / size - 0.5) * freq + offsetY;

        // Octaves - noise
        let e =
          1.0 * this.noise(1 * nx, 1 * ny) +
          0.5 * this.noise(2 * nx, 2 * ny) +
          0.25 * this.noise(4 * nx, 4 * ny) +
          0.13 * this.noise(8 * nx, 8 * ny) +
          0.06 * this.noise(16 * nx, 16 * ny) +
          0.03 * this.noise(32 * nx, 32 * ny);
        e = e / (1.0 + 0.5 + 0.25 + 0.13 + 0.06 + 0.03);
        e = Math.pow(e, 5.0);

        value[y][x] = e;
      }
    }
    return value;
  }

  createTexture(noiseMap) {
    const chunkSize = noiseMap.length;
    // Get canvas context
    const textureCanvas = new OffscreenCanvas(chunkSize, chunkSize);
  
    const ctx = textureCanvas.getContext("2d");
  
    // Biomes
    const water = "rgb(98, 154, 245)";
    const sand1 = "rgb(255, 247, 204)";
    const sand2 = "rgb(255, 235, 130)";
    const sand3 = "rgb(245, 218, 66)";
    const grass1 = "rgb(205, 250, 137)";
    const grass2 = "rgb(181, 245, 86)";
    const rock1 = "rgb(153, 153, 153)";
    const rock2 = "rgb(138, 138, 138)";
    const snow = "rgb(224, 224, 224)";
  
    // map color to pixel on the canvas
    for (let y = 0; y < noiseMap.length; y++) {
      for (let x = 0; x < noiseMap[y].length; x++) {
        let val = noiseMap[y][x];
  
        if (val < 0.005) {
          ctx.fillStyle = water;
        } else if (val < 0.009) {
          ctx.fillStyle = sand1;
        } else if (val < 0.05) {
          ctx.fillStyle = grass1;
        } else if (val < 0.12) {
          ctx.fillStyle = grass2;
        } else if (val < 0.2) {
          ctx.fillStyle = rock1; // gray
        } else {
          ctx.fillStyle = snow;
        }
  
        ctx.fillRect(x, y, 1, 1);
      }
    }
  
    return textureCanvas;
  }

  mapToMesh(noiseMap, bumpScale = 10) {
    const chunkSize = noiseMap.length;
  
    const geo = new THREE.PlaneGeometry(
      chunkSize,
      chunkSize,
      chunkSize - 1,
      chunkSize - 1
    );
    const texture = new THREE.CanvasTexture(this.createTexture(noiseMap));
    const mat = new THREE.MeshPhongMaterial({
      map: texture,
      wireframe: false,
      flatShading: true,
    });
  
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotateX(-Math.PI / 2);
  
    const verts = mesh.geometry.attributes.position.array;
    let vertIndex = 0;
  
    for (let j = 0; j < chunkSize; j++) {
      for (let i = 0; i < chunkSize; i++) {
        let newZ = noiseMap[j][i];
  
        verts[vertIndex + 2] = newZ * bumpScale;
        vertIndex += 3;
      }
    }
  
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.position.z = 0;
  
    return mesh;
  }

}
