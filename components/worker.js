self.addEventListener("message", function (e) {
  let msg = e.data;
  console.log(msg);
  // Add chunk
  /*
  const chunk = new TerrainChunk(
    msg.x * msg.chunkSize,
    msg.y * msg.chunkSize,
    msg.x * msg.noiseOffset,
    msg.y * msg.noiseOffset,
    msg.chunkSize,
    msg.bumpScale
  );*/

  //self.postMessage(message);
});
