const fs = require('fs');
const images = require('images');

async function generateFooty(footy, id, outputFolder) {
  console.log({ footy });
  const size = 256;
  const image = images(footy.parts.background).size(size);
  // const image = images(footy.parts.kit).size(size);

  image
    .draw(images(footy.parts.sigil).size(size), 0, 0)
    .draw(images(footy.parts.signature).size(size), 0, 0)

  // Save image
  const imagePath = `${outputFolder}/${id}.png`;
  image.save(imagePath, {
    quality: 100,
  });
}

async function generateMatchupFooties(footy1, footy2, id, outputFolder) {
  console.log({ footy1 });
  console.log({ footy2 });
  const size = 256;
  const image = images(footy1.parts.background).size(size * 2, size);
  // const image = images(footy.parts.kit).size(size);

  image
    .draw(images(footy1.parts.kit).size(size), 0, 0)
    .draw(images(footy1.parts.accessory).size(size), 0, 0)
    .draw(images(footy1.parts.head).size(size), 0, 0)
    .draw(images(footy1.parts.glasses).size(size), 0, 0)
    .draw(images(footy2.parts.kit).size(size), 256, 0)
    .draw(images(footy2.parts.accessory).size(size), 256, 0)
    .draw(images(footy2.parts.head).size(size), 256, 0)
    .draw(images(footy2.parts.glasses).size(size), 256, 0);

  // Save image
  const imagePath = `${outputFolder}/${id}.png`;
  image.save(imagePath, {
    quality: 100,
  });
}

async function printMatchupImages(outputFolder) {
  const rawData = fs.readFileSync(`${outputFolder}/data.json`);
  const data = JSON.parse(rawData);

  for (var i = 0; i < data.length; i = i + 5) {
    const footy1 = data[i];
    const footy2 = data[i + 1];
    // await generateFooty(footy, footy.tokenId, outputFolder);
    await generateMatchupFooties(footy1, footy2, footy1.tokenId, outputFolder);
    // await generateSquadFooties(footies, outputFolder);
    footies = [];
  }
}

async function printImages(outputFolder) {
  const rawData = fs.readFileSync(`${outputFolder}/data.json`);
  console.log({ rawData });
  const data = JSON.parse(rawData);

  for (var i = 0; i < data.length; i++) {
    const footy = data[i];
    console.log('Printed footy');
    await generateFooty(footy, footy.tokenId, outputFolder);
    // await generateMatchupFooties(footy1, footy2, footy1.tokenId, outputFolder);
    // await generateMatchupFooties(footy1, footy2, footy1.tokenId, outputFolder);
  }
}

async function generateSquadFooties(footies, outputFolder) {
  const numFooties = footies.length;
  const size = 256;
  const image = images(footies[0].parts.background).size(
    size * numFooties,
    size,
  );
  // const image = images(footy.parts.kit).size(size);

  for (let i = 0; i < numFooties; i++) {
    image
      .draw(images(footies[i].parts.kit).size(size), i * 256, 0)
      .draw(images(footies[i].parts.accessory).size(size), i * 256, 0)
      .draw(images(footies[i].parts.head).size(size), i * 256, 0)
      .draw(images(footies[i].parts.glasses).size(size), i * 256, 0);
  }

  // Save image
  const imagePath = `${outputFolder}/${footies[0].id}.png`;
  image.save(imagePath, {
    quality: 100,
  });
}

async function printSquadImages(outputFolder) {
  const rawData = fs.readFileSync(`${outputFolder}/data.json`);
  const data = JSON.parse(rawData);

  let footies = [];

  for (var i = 0; i < data.length; i = i + 5) {
    for (let j = 0; j < 5; j++) {
      let footy = data[i + j];
      footies.push(footy);
    }
    // await generateFooty(footy, footy.tokenId, outputFolder);
    // await generateMatchupFooties(footy1, footy2, footy1.tokenId, outputFolder);
    await generateSquadFooties(footies, outputFolder);
    footies = [];
  }
}

async function printImages(outputFolder) {
  const rawData = fs.readFileSync(`${outputFolder}/data.json`);
  console.log({ rawData });
  const data = JSON.parse(rawData);

  for (var i = 0; i < data.length; i++) {
    const footy = data[i];
    console.log('Printed footy');
    await generateFooty(footy, footy.tokenId, outputFolder);
    // await generateMatchupFooties(footy1, footy2, footy1.tokenId, outputFolder);
    // await generateMatchupFooties(footy1, footy2, footy1.tokenId, outputFolder);
  }
}

module.exports = {
  printImages,
  printSquadImages,
  printMatchupImages,
};
