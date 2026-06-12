module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/styles": "styles",
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
  };
};
