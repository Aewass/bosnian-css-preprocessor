#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const bosnianPreprocessor = require("./lib/bosnian-preprocessor");
const nested = require("postcss-nested");
const autoprefixer = require("autoprefixer");
const postcssImport = require("postcss-import");

const inputFilePath = process.argv[2];
const outputFilePath = process.argv[3];

if (!inputFilePath || !outputFilePath) {
  console.error("Usage: bosnian-css-preprocessor <input file> <output file>");
  process.exit(1);
}

fs.readFile(inputFilePath, "utf8", (err, css) => {
  if (err) {
    console.error(`Error reading CSS file: ${err}`);
    process.exit(1);
  }

  postcss([postcssImport, nested, autoprefixer, bosnianPreprocessor()])
    .process(css, { from: inputFilePath, to: outputFilePath })
    .then((result) => {
      fs.writeFile(outputFilePath, result.css, (err) => {
        if (err) {
          console.error(`Error writing CSS file: ${err}`);
          process.exit(1);
        }
        console.log(`Processed CSS written to ${outputFilePath}`);
      });
    })
    .catch((error) => {
      console.error(`PostCSS error: ${error}`);
      process.exit(1);
    });
});
