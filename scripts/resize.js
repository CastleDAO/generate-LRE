const fs = require('fs');
const images = require('images');

const { baseImages } = require("./baseImages");


function resize(base, path) {
    const image = images(path).size(500);

   // Save image
  const imagePath = `./output/resized/${base}/${path.split('/').pop()}.png`;
  image.save(imagePath, {
    quality: 100,
  });
}
function execute() {
    baseImages.base.forEach(b => {
        resize('ballot-base', b)
    })

    baseImages.sigil.forEach(b => {
        resize('ballot-sigil', b)
    })

    baseImages.signature.forEach(b => {
        resize('ballot-signature', b)
    })
}

execute()