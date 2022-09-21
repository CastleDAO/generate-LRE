# Ballot generator


This repository serves to encode images in the base64 format used for the on-chain ballot contract. 

Including images in `base-images`, they will be parsed an generate a base64 output.

First: run `node scripts/generatePalette.js` to generate a JSON palette that will need to be added to the ballot contract.

Second: include the pallete JSON into the script `encode-parts` and run it with `node scripts/encode-parts.js`. This will create a "bitecode.txt" on the "output" folder, this is the solidity code to be added to the ballot contract.


