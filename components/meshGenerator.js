
export default class MeshGenerator {

  generateTerrainMesh(heightMap) {
    this.width = heightMap[0].length;  // num of columns
    this.height = heightMap.length; // num of rows
    this.topLeftX = (this.width - 1) / 2.0;
    this.topLeftZ = (this.height - 1) / 2;

    this.meshData = new MeshData(this.width, this.height);
    this.vertexIndex = 0;

    for (let y = 0; y < this.height; y++) {
      for (let x=0; x < this.width; x++) {
        this.meshData.vertices[this.vertexIndex] = new THREE.Vector3(this.topLeftX + x, heightMap[x][y], this.topLeftZ - y);

        this.meshData.uvs[this.vertexIndex] = new 

        if (x < this.width -1 && y < this.height - 1) {
          this.meshData.addTriangle(this.vertexIndex, this.vertexIndex+this.width+1, this.vertexIndex+width)

          this.meshData.addTriangle(this.vertexIndex+this.width+1, this.vertexIndex, this.vertexIndex+1);

        }
        this.vertexIndex++;
      } // end of x loop
    } // end of y loop

  } // end of generateTerrainMesh
} // end of class

class MeshData {
  constructor( meshWidth, meshHeight ) {
    this.vertices = new Array(meshWidth * meshHeight); // length = meshWidth * meshHeight
    this.triangles = new Array( (meshWidth-1)*(meshHeight-1)*6 ); // length = (meshWidth-1)*(meshHeight-1)*6
    this.triangleIndex = 0;
    this.uvs = new Array( (meshWidth-1)*(meshHeight-1)*6 );
  }

  addTriangle(a, b, c) {
    this.triangles[triangleIndex] = a;
    this.triangles[triangleIndex+1] = b;
    this.triangles[triangleIndex+2] = c;
    this.triangleIndex += 3;
  }

}
