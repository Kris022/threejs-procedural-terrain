export default class MapGenerator {
	constructor(width, height, ctx, noiseMap) {
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.noiseMap = noiseMap
		this.colors = []; // 2d array storing color values
	}

	lerp(start, end, t) {
		return (1 - t) * start + t * end;
	}

	generateColors() {
		for (let y = 0; y < this.height; y++) {
			this.colors.push([]);
			for (let x = 0; x < this.width; x++) {
				this.colors[y].push(this.noiseMap[y][x] * 20); // create color value lerp(black, white, noiseValue)
			}
		} // end for
	}

	drawNoise() {

    if (this.colors.length == 0) {
      this.generateColors();
    }

		// map color to pixel on the canvas
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				let val = this.colors[y][x];
				//console.log(val);
				this.ctx.fillStyle = `rgb(${val}, ${val}, ${val})`; // set colors value
				this.ctx.fillRect(x, y, 1, 1);
			}
		}
	}
}
