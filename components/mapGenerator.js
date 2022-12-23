// Generate gray scale values for the canvas to be used as a displacement map
// As well as cretes the color to be used as a texture

export default class MapGenerator {
	constructor(width, height, ctx, noiseMap) {
    this.width = width;
    this.height = height;
    this.ctx = ctx;	// Canvas context
    this.noiseMap = noiseMap	// Array of noise values
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

	drawTexture(colorCanvas) {
		let colorCtx = colorCanvas.getContext('2d'); // texture canvas?

		const groundColor = "rgb(98, 158, 41)";
		const mountainColor = "rgb(135, 144, 150)";
		const sand = "rgb(230, 221, 142)";
		const water = "rgb(74, 133, 217)";

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				 if (this.colors[y][x] > 60.0) {
					 colorCtx.fillStyle = mountainColor;
				 }
				 else if (this.colors[y][x] > 40.0) {
					 colorCtx.fillStyle = sand;
				 }
				 else if (this.colors[y][x] > 10.0) {
					 colorCtx.fillStyle = groundColor;

				 }
				 else {
					 console.log(this.colors[y][x]);
					 colorCtx.fillStyle = water;

				 }
				 colorCtx.fillRect(x, y, 1, 1);
			}}// end of for loops
	}

}
