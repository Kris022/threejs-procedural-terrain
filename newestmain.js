import { createNoise2D } from "simplex-noise";
import alea from "alea";

const canvas = document.getElementById("noise-preview");

function drawNoise(canvas, noise) {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.width; j++) {
      //  let val = noise[i][j] * 100;
      let val = noise[i][j] * 225;

      //	ctx.fillStyle = `hsl(136, 0%,${val}%)`;
      ctx.fillStyle = `rgb(${val}, ${val},${val})`;
      ctx.fillRect(i, j, 1, 1);
    }
  }
}

let gen = createNoise2D(alea("seed1"));

function noise(nx, ny) {
  // Rescale from -1.0:+1.0 to 0.0:1.0
  return gen(nx, ny) / 2 + 0.5;
}

function octave(nx, ny, octaves) {
  let val = 0; // final noise value
  let freq = 10; // Scale/Zoom value
  let max = 0; // divisor
  let amp = 1;

  for (let i = 0; i < octaves; i++) {
    val += noise(nx * freq, ny * freq) * amp;
    max += amp;
    amp /= 2;
    freq *= 2;
  }

  return val / max;
}

function createNoiseMap() {
  let offsetX = 0.0,
    offsetY = 0.0;
  let frequency = 4.0; // scale
  let octaves = 4;
  let amplitude;
  let presistance;
  let lacunaity;

  let value = [];
  for (let y = 0; y < canvas.height; y++) {
    value[y] = [];
    for (let x = 0; x < canvas.width; x++) {
      let nx = x / canvas.width - 0.5 + offsetY;
      let ny = y / canvas.height - 0.5 + offsetX;

      let d = 1 - (1 - Math.pow(nx, 2)) * (1 - Math.pow(ny, 2));
      let e = octave(nx, ny, 3);

      e = e + (0.1 - d); // /2

      value[y][x] = e; // Math.pow(e, 1);//noise(nx * frequency, ny * frequency);
    }
  }

  return value;
}

function createFllOffMap() {
  let map = [];
  for (let y = 0; y < canvas.height; y++) {
    map[y] = [];
    for (let x = 0; x < canvas.width; x++) {
      let sampleX = x / canvas.height * 2 - 1; // get sample in range [-1, 1]
      let sampleY = y / canvas.height * 2 - 1;
      console.log(sampleX);
      let val = Math.max( Math.abs(sampleX), Math.abs(sampleY));
      map[y][x] = val;
    }
  }
  return map;
}

const noiseMap = createFllOffMap();
drawNoise(canvas, noiseMap);

/*
// Map values to range [0.0, 1.0]
function map_to_range(x) {
	return ((x + Math.abs(x)) % 2) / 2
}

let elevationap = new Array();

let frequency = 1; // Scale
let amplitude = 1; //
let offset;


for (let y = 0; y < canvas.height; y++) {
	elevationap.push([]);
	for (let x = 0; x < canvas.width; x++) {
		let nx = x / canvas.width - 0.5;
		let ny = y / canvas.height - 0.5;

    let e = (1 * noise(nx * 1, ny * 1)) +
    (0.5 * noise(nx * 2, ny * 2)) +
    (0.25 * noise(nx * 4, ny * 4));

    e = e/(1.0+0.5+0.25);

    let val = map_to_range(Math.pow(e, 4));

    elevationap[y].push(val);
	}
}
*/
/*

let e = (amplitude * noise(nx * frequency, ny * frequency)) +
(amplitude/2 * noise(nx * (frequency*2), ny * (frequency*2))) +
(amplitude/2/2 * noise(nx * (frequency*2*2), ny * (frequency*2*2)));

*/
