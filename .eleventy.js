const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-es');
const htmlmin = require('html-minifier');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes) {
  const size = parseInt(sizes, 10);
  let metadata = await Image(src, {
    widths: [size, size * 1.5, size * 2],
    formats: ["avif", "webp"],
    outputDir: './_site/img',
    useCache: true
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = eleventyConfig => {
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);

  // Eleventy Navigation https://www.11ty.dev/docs/plugins/navigation/
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  eleventyConfig.addFilter('generateTagLinks', tags => {
    return '<ul>' + tags.filter(t => t !== 'plant').map(tag => `
      <li><a href="/tags/${tag}" rel="tag">${tag}</a></li>
    `).join('') + '</ul>';
  });

  eleventyConfig.addAsyncFilter('generateCreditLinks', async links => {
    const creditLinks = await Promise.all(links.map(async (link) => {
      const file = link.split('/').pop();
      const apiUrl = `https://commons.wikimedia.org/w/rest.php/v1/file/${file}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        return `<a href="${link}">${link}</a>`;
      }

      const data = await response.json();

      return `<a href="${link}">${data.title}</a> skapad av <a href="https://commons.wikimedia.org/wiki/User:${data.latest.user.name}">${data.latest.user.name}</a>`;
    }));

    return `<ul>${creditLinks.map(anchor => `<li>${anchor}</li>`).join('')}</ul>`;
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

  const thumbnailOriginalSrc = latinName => {
    const path = latinName
      .split(' ')
      .map(s => s.toLocaleLowerCase())
      .join('-');

    return './static/img/thumb/' + path + '.jpg';
  };

  eleventyConfig.addFilter('thumbnailOriginalSrc', thumbnailOriginalSrc);

  eleventyConfig.addAsyncFilter('thumbnail256', async latinName => {
    const src = thumbnailOriginalSrc(latinName);

    const metadata = await Image(src, {
      widths: [256],
      formats: ["jpg"],
      outputDir: './_site/img',
      useCache: true
    });

    return metadata['jpeg'][0].url;
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", code => new CleanCSS({}).minify(code).styles);

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
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
  eleventyConfig.addCollection('posts', function(collection) {
    return collection.getAllSorted().filter(function(item) {
      return item.inputPath.match(/^\.\/posts\//) !== null;
    });
  });

  eleventyConfig.addCollection('plants', function(collection) {
    // Also accepts an array of globs!
    return collection.getFilteredByGlob(["plants/*.md"]);
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("static/font");
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

  /*
  eleventyConfig.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );
  */

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
