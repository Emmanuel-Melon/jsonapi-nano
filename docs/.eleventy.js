module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/styles": "styles",
  });

  return {
    pathPrefix: "/jsonapi-nano-docs/",
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
  };
};
