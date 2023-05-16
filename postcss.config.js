"use-strict";

// presetenv -> to allow me write modern css like nesting
const postcssPresetEnv = require("postcss-preset-env");

// autoprefixer -> write vendor prefixes for me
const postcssAutoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    postcssPresetEnv({
      stage: 3,
      features: { "nesting-rules": true },
      browsers: "last 2 versions",
    }),
    postcssAutoprefixer(),
  ],
};
