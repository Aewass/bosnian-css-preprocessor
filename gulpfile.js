const gulp = require("gulp");
const postcss = require("gulp-postcss");
const chokidar = require("chokidar");
const fs = require("fs-extra");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const bosnianPreprocessor = require("./src/bosnian-preprocessor");

const argv = yargs(hideBin(process.argv)).argv;
const inputFile = argv.inputFile;
const outputFile = argv.outputFile;

if (!inputFile || !outputFile) {
  console.error("Usage: bosnian-css-preprocessor <input_file> <output_file>");
  process.exit(1);
}

gulp.task("ensure-input-file", (done) => {
  if (!fs.existsSync(inputFile)) {
    fs.ensureFileSync(inputFile);
    fs.writeFileSync(inputFile, ""); // Create an empty file
  }
  done();
});

gulp.task(
  "css",
  gulp.series("ensure-input-file", () => {
    return gulp
      .src(inputFile, { allowEmpty: true })
      .pipe(postcss([bosnianPreprocessor()]))
      .pipe(
        gulp.dest((file) => {
          file.path = path.join(
            path.dirname(outputFile),
            path.basename(outputFile)
          );
          return file.base;
        })
      );
  })
);

gulp.task("watch", () => {
  chokidar.watch(inputFile).on("change", gulp.series("css"));
});

gulp.task("default", gulp.series("css", "watch"));
