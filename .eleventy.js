module.exports = function (eleventyConfig) {
  // Pass through static assets unchanged.
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("app.js");
  eleventyConfig.addPassthroughCopy("data");

  return {
    dir: {
      input: ".",
      output: "dist",
    },
    templateFormats: ["html"],
  };
};
