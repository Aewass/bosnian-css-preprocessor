const browserSync = require("browser-sync").create();
const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const postcss = require("postcss");
const bosnianPreprocessor = require("./lib/bosnian-preprocessor");
const nested = require("postcss-nested");
const autoprefixer = require("autoprefixer");
const postcssImport = require("postcss-import");

const srcDir = path.join(__dirname, "src");
const cssFilePath = path.join(srcDir, "styles.css");
const distDir = path.join(__dirname, "dist");
const outputFilePath = path.join(distDir, "styles.css");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Function to process CSS
const processCSS = () => {
  fs.readFile(cssFilePath, "utf8", (err, css) => {
    if (err) {
      console.error(`Error reading CSS file: ${err}`);
      return;
    }

    postcss([postcssImport, nested, autoprefixer, bosnianPreprocessor()])
      .process(css, { from: cssFilePath, to: outputFilePath })
      .then((result) => {
        fs.writeFile(outputFilePath, result.css, (err) => {
          if (err) {
            console.error(`Error writing CSS file: ${err}`);
            return;
          }
          console.log(`Processed CSS written to ${outputFilePath}`);
          browserSync.reload("*.css");
        });
      })
      .catch((error) => {
        console.error(`PostCSS error: ${error}`);
      });
  });
};

// Initialize BrowserSync
browserSync.init({
  server: {
    baseDir: "./",
    middleware: [
      (req, res, next) => {
        const url = req.url.split("?")[0]; // Strip query string

        if (url === "/styles.css") {
          fs.readFile(outputFilePath, "utf8", (err, css) => {
            if (err) {
              res.writeHead(500);
              res.end(`Error reading CSS file: ${err}`);
              return;
            }
            res.setHeader("Content-Type", "text/css");
            res.end(css);
          });
        } else {
          next();
        }
      },
    ],
  },
  files: ["index.html"],
  logFileChanges: true,
  logLevel: "debug",
  logPrefix: "BrowserSync",
  notify: false,
});

console.log("Watching CSS files for changes...");

// Watch for changes in the src directory and process CSS
chokidar.watch(srcDir).on("change", (filePath) => {
  if (filePath.endsWith(".css")) {
    console.log(`File changed: ${filePath}`);
    processCSS();
  }
});

// Initial CSS processing
processCSS();
