import * as THREE from 'three';
import HeightMap from './heightMap';

// change name to terrainchunk or chunk
export default class ChunkGenerator {
  constructor(scene, canvas, seed="") {
    this.scene = scene;
    this.canvas = canvas; // canvas for texture creation

    this.width = canvas.width;
    this.height = canvas.height;
    this.mesh;
  //  this.geometry = new THREE.PlaneGeometry(100, 100, noiseCanvas.width - 1, noiseCanvas.height - 1);

    // Generate nosie map
    this.mapGenerator = new HeightMap(this.canvas.width, this.canvas.height, seed);
    this.mapGenerator.applyFalloff = true;
    this.heightMap = this.mapGenerator.generateNoiseMap();
    this.noiseData = this.mapGenerator.drawNoise(this.canvas, this.heightMap); //
  }

  map(val, smin, smax, emin, emax) {
  	const t = (val - smin) / (smax - smin);
  	return (emax - emin) * t + emin;
  }

  applyNoiseToMesh(mesh, data) {
  	const verts = mesh.geometry.attributes.position.array; // get verticies of geometry
  	let vertIndex = 0; // current vertex index
  	const heightMultiplier = 1.25; //

  	for (let j = 0; j < data.height; j++) {
  		for (let i = 0; i < data.width; i++) {
  			const n = j * data.height + i;
  			const col = data.data[n * 4]; // the red channel
  			let newZ = this.map(col, 0, 255, -10, 10); // map from 0:255 to -10:10 and set to vertez z

  			verts[vertIndex + 2] = newZ;
  			vertIndex += 3;
  		}
  	}

  }

  createChunk() {
    // create geometry
    const terrainGeo = new THREE.PlaneGeometry(100, 100, this.width - 1, this.height - 1);

    // draw the texture
    this.mapGenerator.drawColorMap(this.canvas, this.heightMap);
    const canvasTexture = new THREE.CanvasTexture(this.canvas);

    // create material and apply the texture
    const terrainMat = new THREE.MeshPhongMaterial({
      map: canvasTexture,
      wireframe: false,
      flatShading: true,
    });

    // create the mesh
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);

    // Apply noise to the mesh's vertices
    this.applyNoiseToMesh(terrain, this.noiseData);

    // compute normals
    terrain.geometry.computeVertexNormals();
    terrain.receiveShadow = true;
    terrain.castShadow = true;
    terrain.rotateX((-Math.PI) / 2);
    this.mesh = terrain;
    // add to the scene
    this.scene.add(this.mesh);
  }

}
