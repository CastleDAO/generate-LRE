const fs = require('fs');
const { getRandomItemFromArray } = require('../utils');
const { baseImages } = require('../baseImages');

function getRandomItem(id) {
  const parts = {
    background: getRandomItemFromArray(baseImages.background),
    sigil: getRandomItemFromArray(baseImages.sigil),
    signature: getRandomItemFromArray(baseImages.signature),
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

  const itemsArray = [];

  for (var i = 0; i < amount; i++) {
    const ballot = getRandomItem(i);
    itemsArray.push(ballot);
  }

  fs.writeFileSync(
    `${outputFolder}/data.json`,
    JSON.stringify(itemsArray, null, 2),
  );
}

module.exports = {
  generateData,
};
