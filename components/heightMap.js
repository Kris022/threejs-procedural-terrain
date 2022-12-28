import { createNoise2D } from 'simplex-noise';
import alea from 'alea';

export default class HeightMap {
	constructor(width, height, seed = '') {
		this.width = width;
		this.height = height;

		this.seed = seed;
		this.noiseGen = createNoise2D();
		if (seed != '') {
			this.noiseGen = createNoise2D(alea(this.seed));
		}

		this.freq = 3; // Scale/Zoom value/mountains
		this.octaves = 3;

		this.val = 0.15; // softness
		this.max = 1; // divisor
		this.amp = 1;
		this.offsetX = 4;
		this.offsetY = 0;

		this.applyFalloff = true;
		this.falloffMap = [];
	}

	clamp(num, min, max) {
		return Math.min(Math.max(num, min), max);
	}

	noise(nx, ny) {
		// Rescale from -1.0:+1.0 to 0.0:1.0
		return this.noiseGen(nx, ny) / 2 + 0.5;
	} // end of noise

	octave(nx, ny, octaves) {
		let val = this.val; // softness
		let freq = this.freq; // Scale/Zoom value/mountains
		let max = this.max; // divisor
		let amp = this.amp;

		for (let i = 0; i < octaves; i++) {
			val += this.noise(nx * freq, ny * freq) * amp;
			max += amp;
			amp /= 2;
			freq *= 2;
		}

		return val / max;
	} // end of octave

	generateNoiseMap() {
		// check if falloff map is to be applied and create it if doesnt exist
		if (this.applyFalloff && this.falloffMap.length == 0) {
			//this.falloffMap = this.createFalloffMap();
			this.falloffMap = this.gradientFalloff();
		}

		// height map to be returned
		let heightMap = [];

		for (let y = 0; y < this.height; y++) {
			heightMap[y] = []; // insert row
			for (let x = 0; x < this.width; x++) {
				let nx = x / this.width - 0.5 + this.offsetY;
				let ny = y / this.height - 0.5 + this.offsetX;

				let e = this.octave(nx, ny, this.octaves); // Compute octaves

				if (this.applyFalloff) {
					e = this.clamp(e - this.falloffMap[y][x], 0, 1);
				}
				//  e = Math.pow(e, 2);

				heightMap[y][x] = e; // Add elevation value to the array
			}
		}

		return heightMap;
	} // end of generateNoiseMap

	createFalloffMap() {
		const a = 1;
		const b = 5;

		let map = [];
		for (let y = 0; y < this.height; y++) {
			map[y] = [];
			for (let x = 0; x < this.width; x++) {
				let sampleX = x / this.height * 2 - 1; // get sample in range [-1, 1]
				let sampleY = y / this.height * 2 - 1;
				let val = Math.max(Math.abs(sampleX), Math.abs(sampleY));
				val = Math.pow(val, a) / (Math.pow(val, a) + Math.pow(b - b * val, a));
				console.log(val);
				map[y][x] = val;
			}
		}
		return map;
	} // end of create falloffMap

	mapRange(value, inMin, inMax, outMin, outMax) {
		// Calculate the proportion of the value within the input range
		const proportion = (value - inMin) / (inMax - inMin);

		// Map the value to the output range using the calculated proportion
		return outMin + (outMax - outMin) * proportion;
	}

	gradientFalloff() {
		let intensity = 200; // color intensity
		// get canvas
		const canvas = document.getElementById('color-preview');
		const ctx = canvas.getContext('2d');

		// cetner point
		let x2 = canvas.width / 2;
		let y2 = canvas.height / 2;

		// draw gradient
		let map = [];
		for (let y = 0; y < this.height; y++) {
			map[y] = [];
			for (let x = 0; x < this.width; x++) {
				let a = x - x2;
				let b = y - y2;

				let dist = Math.sqrt(a * a + b * b);
				let c = dist * 255 / 135;
				c = this.mapRange(c, 0, 255, 0, 1);
				map[y][x] = c;
				/*
        ctx.fillStyle = `rgb(${c},${c},${c})`;
        ctx.fillRect(x, y, 1, 1);
        */
			}
		}

		// return data
		return map;
	}

	drawColorMap(canvas, noise) {
		const ctx = canvas.getContext('2d');
    // clear the canvas
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Biome layers
		const water = 'rgb(98, 154, 245)';
		const sand1 = 'rgb(255, 247, 204)';
		const sand2 = 'rgb(255, 235, 130)';
		const sand3 = 'rgb(245, 218, 66)';
		const grass1 = 'rgb(205, 250, 137)';
		const grass2 = 'rgb(181, 245, 86)';
		const rock1 = 'rgb(153, 153, 153)';
		const rock2 = 'rgb(138, 138, 138)';
		const snow = 'rgb(224, 224, 224)';

		for (let i = 0; i < canvas.width; i++) {
			for (let j = 0; j < canvas.width; j++) {
				let val = noise[i][j];
				if (val < 0.002) {
					ctx.fillStyle = water;
				} else if (val < 0.03) {
					ctx.fillStyle = sand1;
				} else if (val < 0.08) {
					ctx.fillStyle = sand2;
				} else if (val < 0.1) {
					ctx.fillStyle = sand3;
				} else if (val < 0.15) {
					ctx.fillStyle = grass1;
				} else if (val < 0.3) {
					ctx.fillStyle = grass2;
				} else if (val < 0.35) {
					ctx.fillStyle = rock1;
				} else if (val < 0.45) {
					ctx.fillStyle = rock2;
				} else {
					ctx.fillStyle = snow;
				}
				ctx.fillRect(i, j, 1, 1);
			}
		}

		return ctx.getImageData(0, 0, canvas.width, canvas.height);
	}

	drawNoise(canvas, noise) {
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < canvas.width; i++) {
			for (let j = 0; j < canvas.width; j++) {
				let val = noise[i][j] * 225;
				ctx.fillStyle = `rgb(${val}, ${val},${val})`;
				ctx.fillRect(i, j, 1, 1);
			}
		}

		return ctx.getImageData(0, 0, canvas.width, canvas.height);
	}
} // end of class
