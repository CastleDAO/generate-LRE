const fs = require('fs');
const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');

const width = 320;
const height = 320;

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d', { alpha: false });

async function generateNoun(id, context, outputFolder) {
  return loadImage(`${outputFolder}/${id}.png`).then((image) => {
    context.drawImage(image, 0, 0, 320, 320);
  });
}

async function generateGifFromDirectory() {
  // const rawData = fs.readFileSync(`${outputFolder}/data.json`);
  const outputFolder = 'output/landing';
  const data = fs.readdirSync(outputFolder);

  const encoder = new GIFEncoder(width, height);

  encoder
    .createReadStream()
    .pipe(fs.createWriteStream(`${outputFolder}/landingGif.gif`));

  encoder.start();
  encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
  encoder.setDelay(350); // frame delay in ms
  encoder.setQuality(1); // image quality. 10 is default.

  for (var i = 0; i < data.length; i++) {
    const id = data[i].split('.')[0];

    console.log(id);

    await generateNoun(id, context, outputFolder);
    encoder.addFrame(context);
    context.clearRect(0, 0, width, height);
  }

  encoder.finish();
}

generateGifFromDirectory();

module.exports = {
  generateGifFromDirectory,
};
