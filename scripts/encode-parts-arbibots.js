const ethers = require("ethers");
const png = require("png-js");

const { baseImages } = require("./baseImages");

// transparent: 0 (both 0 & 1 are not included in the actual palette arrays, so access needs to subtract 2)
const BASE_PALETTE_TO_COLOR_INDEX = {
  "#000000": 1,
  "#291A72": 2,
  "#240553": 3,
  "#2F4091": 4,
  "#1F0C2C": 5,
  "#142029": 6,
  "#F48925": 7,
  "#F7AC38": 8,
  "#FFEF57": 9,
  "#F0F4F7": 10,
  "#A8ABAD": 11,
  "#7D7F80": 12,
  "#006045": 13,
  "#004538": 14,
  "#A20000": 15,
  "#C4398B": 16,
  "#DC5D86": 17,
  "#F48D8A": 18,
  "#822F22": 19,
  "#7495A8": 20,
  "#58788D": 21,
  "#651415": 22,
  "#810000": 23,
  "#7A0475": 24,
  "#28465A": 25,
  "#3D5C74": 26,
  "#50B04A": 27,
  "#007B46": 28,
  "#CDDDE5": 29,
  "#47094D": 30
};

function decodePixels(path) {
  return new Promise((resolve) => {
    png.decode(path, resolve);
  });
}

function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

async function encodeImage(path) {
  const pixels = await decodePixels(path);

  const rleEncodedData = [];
  let runLength = 0;
  let currentColorIndex = 0;
  let currentRow = 0;
  let pixel = 0;
  for (let i = 0; i < pixels.length; i = i + 4) {
    

    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    let colorIndex = 0;

    if (a == 255) {
      const hexColor = rgbToHex(r, g, b).toUpperCase();

      colorIndex = BASE_PALETTE_TO_COLOR_INDEX[hexColor];

      //console.log("Color index", colorIndex, hexColor);
    }
    // Change color, push it, but also on chagne of row
    if (
      colorIndex != currentColorIndex ||
      runLength == 16 ||
      pixel % 16 === 0
      ) {
      console.log("We are on the currentRow", runLength, 'pixel ', pixel);
      console.log("Adding: ", runLength, currentColorIndex);
      rleEncodedData.push(runLength);
      rleEncodedData.push(currentColorIndex);
      runLength = 0;
      currentColorIndex = colorIndex;
    }
    runLength++;
    pixel++;


    
  }

  console.log(rleEncodedData);

  return ethers.utils.hexlify(rleEncodedData);
}

async function main() {
  const bases = await Promise.all(
    baseImages.base.map(async (f) => {
      const image = await encodeImage(f);
      return {
        image,
        f,
      };
    })
  );

  const signatures = await Promise.all(
    baseImages.signature.map(async (f) => {
      const image = await encodeImage(f);
      return {
        image,
        f,
      };
    })
  );

  const sigils = await Promise.all(
    baseImages.sigil.map(async (f) => {
      const image = await encodeImage(f);
      return {
        image,
        f,
      };
    })
  );

  console.log({ bases, signatures, sigils, BASE_PALETTE_TO_COLOR_INDEX });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function short() {
  const image = await encodeImage(baseImages.base[0]);
}
//short();
