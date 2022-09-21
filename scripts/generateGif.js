const fs = require('fs');
const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');

const width = 320;
const height = 320;

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

async function generateBallot(noun, id, context, outputFolder) {
  return loadImage(`${outputFolder}/${id}.png`).then((image) => {
    context.drawImage(image, 0, 0, 320, 320);
  });
}

async function generateGif(outputFolder, amount) {
  const rawData = fs.readFileSync(`${outputFolder}/data.json`);
  const data = JSON.parse(rawData);

  const encoder = new GIFEncoder(width, height);

  encoder
    .createReadStream()
    .pipe(fs.createWriteStream(`${outputFolder}/demo.gif`));

  encoder.start();
  encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
  encoder.setDelay(250); // frame delay in ms
  encoder.setQuality(1); // image quality. 10 is default.

  for (var i = 0; i < amount; i++) {
    const noun = data[i];

    await generateBallot(noun, noun.tokenId, context, outputFolder);
    encoder.addFrame(context);
    context.clearRect(0, 0, width, height);
  }

  encoder.finish();
}

module.exports = {
  generateGif,
};
