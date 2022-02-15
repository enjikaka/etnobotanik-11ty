const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-es');
const htmlmin = require('html-minifier');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');

module.exports = eleventyConfig => {

  // Eleventy Navigation https://www.11ty.dev/docs/plugins/navigation/
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  eleventyConfig.addFilter('generateTagLinks', tags => {
    return '<ul>' + tags.map(tag => `
      <li><a href="/tags/${tag}" rel="tag">${tag}</a></li>
    `).join('') + '</ul>';
  });

  eleventyConfig.addFilter('generateCreditLinks', links => {
    return '<ul>' + links.map(link => `
      <li><a href="${link}">${new URL(link).hostname}</a></li>
    `).join('') + '</ul>';
  });

  eleventyConfig.addFilter('nordensFloraSrc', latinName => {
    const path = latinName
      .split(' ')
      .map(s => s.toLocaleLowerCase())
      .join('-');

    return '/static/img/nordens-flora/' + path + '.jpg';
  });

  eleventyConfig.addFilter('fitch', latinName => {
    const path = latinName
      .split(' ')
      .map(s => s.toLocaleLowerCase())
      .join('-');

    return '/static/img/fitch/' + path + '.svg';
  });

  eleventyConfig.addFilter('floraVonDeutschlandSrc', latinName => {
    const path = latinName
      .split(' ')
      .map(s => s.toLocaleLowerCase())
      .join('-');

    return '/static/img/flora-von-deutschland-500/' + path + '.jpg';
  });

  eleventyConfig.addFilter('floraVonDeutschlandSrcset', latinName => {
    const widths = [500, 750, 1024];
    const path = latinName
      .split(' ')
      .map(s => s.toLocaleLowerCase())
      .join('-');

    return widths.map(
      width =>
        `/static/img/flora-von-deutschland-${width}/${path}.jpg ${width}w`
    );
  });

  eleventyConfig.addFilter('thumbnailSrc', latinName => {
    const path = latinName
      .split(' ')
      .map(s => s.toLocaleLowerCase())
      .join('-');

    return '/static/img/thumb-1x/' + path + '.jpg';
  });

  eleventyConfig.addFilter('thumbnailSrcset', latinName => {
    const widths = [64, 128, 256];
    const path = latinName
      .split(' ')
      .map(s => s.toLocaleLowerCase())
      .join('-');

    return widths.map(
      width => `/static/img/thumb-${width}/${path}.jpg ${width}w`
    );
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function (code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // only content in the `posts/` directory
  eleventyConfig.addCollection('posts', function (collection) {
    return collection.getAllSorted().filter(function (item) {
      return item.inputPath.match(/^\.\/posts\//) !== null;
    });
  });

  eleventyConfig.addCollection('plants', function (collection) {
    // Also accepts an array of globs!
    return collection.getFilteredByGlob(["plants/*.md"]);
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("_includes/assets/");

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: false
  };

  eleventyConfig.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );

  return {
    templateFormats: ["md", "njk", "html", "liquid"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
