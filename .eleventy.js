module.exports = function (eleventyConfig) {
  // Pass through static assets unchanged.
  eleventyConfig.addPassthroughCopy("src/*.css");
  eleventyConfig.addPassthroughCopy("src/*.js");

  // Copy TXT data files to dist root so app.js can fetch them.
  eleventyConfig.addPassthroughCopy({ "WHITELIST.txt": "WHITELIST.txt" });
  eleventyConfig.addPassthroughCopy({ "BLACKLIST.txt": "BLACKLIST.txt" });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
