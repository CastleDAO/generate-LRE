const ethers = require("ethers");
const png = require("png-js");

const { baseImages } = require("./baseImages");

// transparent: 0 (both 0 & 1 are not included in the actual palette arrays, so access needs to subtract 2)
const BASE_PALETTE_TO_COLOR_INDEX = {
  "#000000": 1,
  "#92E5E8": 2,
  "#B76D3B": 3,
  "#DC5D86": 4,
  "#F9DAA2": 5,
  "#50B04A": 6,
  "#A20000": 7,
  "#FFEF57": 8,
  "#7495A8": 9,
  "#94C952": 10,
  "#F0F4F7": 11,
  "#C2340B": 12,
  "#00292A": 13,
  "#007B46": 14,
  "#47094D": 15,
  "#7A0475": 16,
  "#810000": 17,
  "#F48925": 18,
  "#F7AC38": 19,
  "#292929": 20,
  "#477E95": 21,
  "#649DB3": 22,
  "#8CBDCF": 23,
  "#382E49": 24,
  "#404D6A": 25,
  "#446680": 26,
  "#004538": 27,
  "#006045": 28,
  "#B7B2A5": 29,
  "#F0EDDD": 30,
  "#DCDAD5": 31,
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
