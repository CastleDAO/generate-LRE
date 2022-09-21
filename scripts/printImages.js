const fs = require('fs');
const images = require('images');

async function generateBallot(ballot, id, outputFolder) {
  console.log({ ballot });
  const size = 256;
  const image = images(ballot.parts.background).size(size);

  image
    .draw(images(ballot.parts.sigil).size(size), 0, 0)
    .draw(images(ballot.parts.signature).size(size), 0, 0)

  // Save image
  const imagePath = `${outputFolder}/${id}.png`;
  image.save(imagePath, {
    quality: 100,
  });
}


async function printImages(outputFolder) {
  const rawData = fs.readFileSync(`${outputFolder}/data.json`);
  console.log({ rawData });
  const data = JSON.parse(rawData);

  for (var i = 0; i < data.length; i++) {
    const ballot = data[i];
    console.log('Printed ballot');
    await generateBallot(ballot, ballot.tokenId, outputFolder);
  }
}

module.exports = {
  printImages
};
