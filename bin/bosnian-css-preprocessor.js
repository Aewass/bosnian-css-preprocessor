#!/usr/bin/env node

const { exec } = require("child_process");
const path = require("path");
const chokidar = require("chokidar");

// Get command-line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error(
    "Usage: bosnian-css-preprocessor <input_file> <output_file> [--watch]"
  );
  process.exit(1);
}

const inputFile = path.resolve(process.cwd(), args[0]);
const outputFile = path.resolve(process.cwd(), args[1]);
const shouldWatch = args.includes("--watch");

// Resolve Gulp path relative to the current script location
const gulpPath = path.resolve(
  require.resolve("gulp/bin/gulp"),
  "../../../.bin/gulp"
);
const gulpFile = path.resolve(__dirname, "../gulpfile.js");
const command = `${gulpPath} --gulpfile ${gulpFile} --inputFile ${inputFile} --outputFile ${outputFile}`;

function runGulp() {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing gulp: ${error}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
}

runGulp();

if (shouldWatch) {
  chokidar.watch(inputFile).on("change", runGulp);
}
