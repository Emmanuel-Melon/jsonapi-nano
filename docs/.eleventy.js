module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/styles": "styles",
  });

  return {
    pathPrefix: "/jsonapi-nano", 
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
  };
};