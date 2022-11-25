

function interpolate(a0, a1, w) {
  return (a1 - a0) * w + a0;
}

function randomGradient(ix, iy) {
    const v = {x:Math.cos(ix), y:Math.sin(iy)};

    return v;
}

// Computes the dot product of the distance and gradient vectors.
function dotGridGradient(x, y, ix, iy) {
    // Get gradient from integer coordinates
    let gradient = randomGradient(ix, iy);

    // Compute the distance vector
    let dx = x - ix;
    let dy = y - iy;

    // Compute the dot-product
    return (dx*gradient.x + dy*gradient.y);
}

export function perlin(x, y) {
    // Determine grid cell coordinates
    let x0 = Math.floor(x);
    let x1 = x0 + 1;
    let y0 = Math.floor(y);
    let y1 = y0 + 1;

    // Determine interpolation weights
    // Could also use higher order polynomial/s-curve here
    let sx = x - x0;
    let sy = y - y0;

    // Interpolate between grid point gradients

    let n0 = dotGridGradient(x0, y0, x, y);
    let n1 = dotGridGradient(x1, y0, x, y);
    let ix0 = interpolate(n0, n1, sx);

    n0 = dotGridGradient(x0, y1, x, y);
    n1 = dotGridGradient(x1, y1, x, y);
    let ix1 = interpolate(n0, n1, sx);

    let value = interpolate(ix0, ix1, sy);
    return value; // Will return in range -1 to 1. To make it in range 0 to 1, multiply by 0.5 and add 0.5
}
