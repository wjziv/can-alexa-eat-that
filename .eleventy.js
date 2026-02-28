module.exports = function (eleventyConfig) {
  // Pass through static assets unchanged.
  [
    "style.css",
    "app.js",
    "sw.js",
    "manifest.webmanifest",
    "icons",
    "CNAME",
    "data",
  ].forEach((path) => eleventyConfig.addPassthroughCopy(path));

  return {
    dir: {
      input: ".",
      output: "dist",
    },
    templateFormats: ["html"],
  };
};
