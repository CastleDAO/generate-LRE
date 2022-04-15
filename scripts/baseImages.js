const fs = require('fs');

const baseImages = {
  base: [],
  signature: [],
  sigil: []
};

function getFileNames() {
  const backgroundsBasePath = './base-images/ballot-base';
  const sigilBasePath = './base-images/ballot-sigil';
  const signaturesBasePath = './base-images/ballot-signature';

  // Load backgrounds
  const backgrounds = fs.readdirSync(backgroundsBasePath);
  baseImages.base = backgrounds.map((i) => `${backgroundsBasePath}/${i}`);

  // Load kits
  const sigils = fs.readdirSync(sigilBasePath);
  baseImages.sigil = sigils.map((i) => `${sigilBasePath}/${i}`);

  // Load heads
  const signatures = fs.readdirSync(signaturesBasePath);
  baseImages.signature = signatures.map((i) => `${signaturesBasePath}/${i}`);
}

getFileNames();

module.exports = {
  baseImages,
};
