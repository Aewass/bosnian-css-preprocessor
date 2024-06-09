const fs = require("fs");
const path = require("path");

const propertyTranslationsPath = path.join(
  __dirname,
  "../translations/propertyTranslations.json"
);
const propertyTranslations = JSON.parse(
  fs.readFileSync(propertyTranslationsPath, "utf8")
);

const valueTranslationsPath = path.join(
  __dirname,
  "../translations/valueTranslations.json"
);
const valueTranslations = JSON.parse(
  fs.readFileSync(valueTranslationsPath, "utf8")
);

const invertedPropertyTranslations = Object.fromEntries(
  Object.entries(propertyTranslations).map(([key, value]) => [value, key])
);

const invertedValueTranslations = Object.fromEntries(
  Object.entries(valueTranslations).map(([key, value]) => [value, key])
);

module.exports = () => {
  return {
    postcssPlugin: "bosnian-preprocessor",
    Once(root) {
      root.walkDecls((decl) => {
        if (invertedPropertyTranslations[decl.prop]) {
          decl.prop = invertedPropertyTranslations[decl.prop];
        }

        Object.keys(invertedValueTranslations).forEach((key) => {
          const regex = new RegExp(`\\b${key}\\b`, "g");
          if (regex.test(decl.value)) {
            decl.value = decl.value.replace(
              regex,
              invertedValueTranslations[key]
            );
          }
        });
      });
    },
  };
};

module.exports.postcss = true;
