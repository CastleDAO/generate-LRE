const ethers = require("ethers");
const png = require("png-js");
const fs = require("fs");
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
  "#58788D": 13,
  "#FFFFFF": 14,
  "#A20000": 15,
  "#006045": 16,
  "#004538": 17,
  "#C4398B": 18,
  "#DC5D86": 19,
  "#F48D8A": 20,
  "#822F22": 21,
  "#7495A8": 22,
  "#651415": 23,
  "#810000": 24,
  "#7A0475": 25,
  "#28465A": 26,
  "#3D5C74": 27,
  "#50B04A": 28,
  "#007B46": 29,
  "#CDDDE5": 30,
  "#47094D": 31,
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
      console.log("We are on the currentRow", runLength, "pixel ", pixel);
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

  const content = `
    string[] public backgroundNames = [${bases
      .map((b) => `"${b.f.split("/").pop().replace(".png", "")}"`)
      .join(",")}];

    bytes[] public backgrounds = [${bases
      .map((b) => `bytes(hex"${b.image.replace("0x", "")}") \n`)
      .join(", \n")}];
  
    string[] public logoNames = [${signatures
      .map((b) => `"${b.f.split("/").pop().replace(".png", "")}"`)
      .join(",")}];
    
    bytes[] public logos = [${signatures
      .map((b) => `bytes(hex"${b.image.replace("0x", "")}") \n`)
      .join(", \n")}];

    string[] public decorationNames = [${sigils
      .map((b) => `"${b.f.split("/").pop().replace(".png", "")}"`)
      .join(",")}];
  
      bytes[] public decorations = [${sigils
        .map((b) => `bytes(hex"${b.image.replace("0x", "")}") \n`)
        .join(", \n")}];

  `;

  fs.writeFileSync("./output/bytecode.txt", content);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
