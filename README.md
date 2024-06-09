# Bosnian CSS Preprocessor

A PostCSS plugin to translate CSS properties and values from Bosnian to English.

## Installation

### Global Installation

Install the package globally to use the CLI tool:

```bash
npm install -g bosnian-css-preprocessor
```

You can use the CLI tool to process your CSS files from Bosnian to English:

```bash
bosnian-css-preprocessor <input file> <output file>
```

e.g.

```bash
bosnian-css-preprocessor src/styles.css dist/styles.css
```

### Live Reloading

To automatically process your CSS files and see changes immediately, you can use the built-in watcher.

```json
{
  "scripts": {
    "watch-css": "node node_modules/bosnian-css-preprocessor/watch.js"
  }
}
```

Then run:

```bash
npm run watch-css
```

### Writing CSS

You can write your CSS files using Bosnian terms, and they will be translated by the plugin:

```css
/* src/styles.css */
body {
  boja: crvena;
  pozadina: plava;
}
```

Will be translated to:

```css
/* dist/styles.css */
body {
  color: red;
  background: blue;
}
```
