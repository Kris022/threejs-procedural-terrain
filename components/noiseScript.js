import { createNoise2D } from 'simplex-noise';

function RNG(seed) {
  // LCG using GCC's constants
  this.m = 0x80000000; // 2**31;
  this.a = 1103515245;
  this.c = 12345;

  this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
}
RNG.prototype.nextInt = function() {
  this.state = (this.a * this.state + this.c) % this.m;
  return this.state;
}
RNG.prototype.nextFloat = function() {
  // returns in range [0,1]
  return this.nextInt() / (this.m - 1);
}
RNG.prototype.nextRange = function(start, end) {
  // returns in range [start, end): including start, excluding end
  // can't modulu nextInt because of weak randomness in lower bits
  var rangeSize = end - start;
  var randomUnder1 = this.nextInt() / this.m;
  return start + Math.floor(randomUnder1 * rangeSize);
}
RNG.prototype.choice = function(array) {
  return array[this.nextRange(0, array.length)];
}



export default class NoiseScript {
	constructor() {
		this.noiseMap = [];
		this.noise2D = createNoise2D();
	}

	inverseLerp(value, min, max) {
		return (value - min) / (max - min);
	}

	generateNoiseMap(mapWidth, mapHeight, scale, octaves, presistance, lacunarity, seed, offset) {
		const prng = new RNG(seed);
		let octaveOffsets = [];

		for (var i = 0; i < octaves; i++) {
			let offsetX = prng.nextRange(-1000, 1000) + offset.x;
			let offsetY = prng.nextRange(-1000, 1000) + offset.y;
			octaveOffsets.push({x:offsetX, y:offsetY});

		}

		// Clamp the scale so its always above 0
		if (scale <= 0) {
			scale = 0.0001;
		}

		let maxNoiseHeight = Number.NEGATIVE_INFINITY; // smallest float value
		let minNoiseHeight = Number.MAX_VALUE; // biggest float value

		// Generate the map as 2d array
		for (let y = 0; y < mapHeight; y++) {
			this.noiseMap.push([]); // Insert row
			for (let x = 0; x < mapWidth; x++) {
				let amplitude = 1;
				let frequency = 1; // rate of changes between height values
				let noiseHeight = 0;

				for (let i = 0; i < octaves; i++) {
					let sampleX = x / scale * frequency + octaveOffsets[i].x;
					let sampleY = y / scale * frequency + octaveOffsets[i].y;

					// Get the noise value
					let simplexValue = this.noise2D(sampleX, sampleY) * 2 - 1;
					noiseHeight = simplexValue * amplitude;

					amplitude *= presistance;
					frequency *= lacunarity;
				} // end of octaves loop

				if (noiseHeight > maxNoiseHeight) {
					maxNoiseHeight = noiseHeight;
				} else if (noiseHeight < minNoiseHeight) {
					minNoiseHeight = noiseHeight;
				}
				this.noiseMap[y].push(noiseHeight); // insert to the array
			}
		}

		for (let y = 0; y < mapHeight; y++) {
			for (let x = 0; x < mapWidth; x++) {
				this.noiseMap[y][x] = this.inverseLerp(minNoiseHeight, maxNoiseHeight, this.noiseMap[y][x]);
			}
		}
		return this.noiseMap;
	}
}
