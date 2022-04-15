const fs = require('fs');
const { getRandomItemFromArray } = require('../utils');
const { baseImages } = require('../baseImages');

function getRandomItem(id) {
  const perKit = 15;
  const parts = {
    background: getRandomItemFromArray(baseImages.background),
    // background: baseImages.background[1],
    // kit: baseImages.kit[40],
    // kit: baseImages.kit[Math.floor(id / perKit)],
    sigil: getRandomItemFromArray(baseImages.sigil),
    // kit for match up
    // kit: baseImages.kit[id % 2 === 0 ? 20 : 31],
    signature: getRandomItemFromArray(baseImages.signature),
    // head: baseImages.head[3],
    // glasses: baseImages.glasses[2],
  };

  return {
    parts,
    id,
    tokenId: id,
  };
}

function generateData(outputFolder, amount) {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  const nounsArray = [];

  for (var i = 0; i < amount; i++) {
    const noun = getRandomItem(i);
    nounsArray.push(noun);
  }

  fs.writeFileSync(
    `${outputFolder}/data.json`,
    JSON.stringify(nounsArray, null, 2),
  );
}

module.exports = {
  generateData,
};
