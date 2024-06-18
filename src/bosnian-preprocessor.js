const postcss = require("postcss");
const fs = require("fs");
const path = require("path");

const propertyTranslations = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../translations/propertyTranslations.json")
  )
);
const valueTranslations = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../translations/valueTranslations.json")
  )
);

module.exports = () => {
  return {
    postcssPlugin: "bosnian-preprocessor",
    Once(root) {
      root.walkDecls((decl) => {
        if (propertyTranslations[decl.prop]) {
          decl.prop = propertyTranslations[decl.prop];
        }

        Object.keys(valueTranslations).forEach((key) => {
          const regex = new RegExp(`\\b${key}\\b`, "g");
          decl.value = decl.value.replace(regex, valueTranslations[key]);
        });
      });
    },
  };
};

module.exports.postcss = true;
