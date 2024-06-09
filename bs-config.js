const browserSync = require("browser-sync").create();
const path = require("path");
const fs = require("fs");
const postcss = require("postcss");
const bosnianPreprocessor = require("./lib/bosnian-preprocessor");
const nested = require("postcss-nested");
const autoprefixer = require("autoprefixer");
const postcssImport = require("postcss-import");

const cssFilePath = path.join(__dirname, "src/styles.css");

// Middleware to serve CSS with PostCSS processing
const cssMiddleware = (req, res, next) => {
  const url = req.url.split("?")[0];

  console.log(`Requested URL: ${url}`);

  if (url === "/styles.css") {
    fs.readFile(cssFilePath, "utf8", (err, css) => {
      if (err) {
        console.error(`Error reading CSS file: ${err}`);
        res.writeHead(500);
        res.end(`Error reading CSS file: ${err}`);
        return;
      }

      postcss([postcssImport, nested, autoprefixer, bosnianPreprocessor()])
        .process(css, { from: cssFilePath })
        .then((result) => {
          console.log("Processed CSS:", result.css);
          res.setHeader("Content-Type", "text/css");
          res.end(result.css);
        })
        .catch((error) => {
          console.error("PostCSS error:", error);
          res.writeHead(500);
          res.end(`PostCSS error: ${error}`);
        });
    });
  } else {
    next();
  }
};

module.exports = {
  server: {
    baseDir: "./",
    middleware: [cssMiddleware],
  },
  files: ["src/*.css", "index.html"],
  logFileChanges: true,
  logLevel: "debug",
  logPrefix: "BrowserSync",
  notify: false,
};

console.log("BrowserSync is running...");
