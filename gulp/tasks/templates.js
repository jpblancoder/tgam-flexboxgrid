"use strict";

const fs = require("fs");
const gulp = require("gulp");
const rename = require('gulp-rename');
const tap = require("gulp-tap");
const handlebars = require('gulp-compile-handlebars');
const beautify_html = require("js-beautify").html;
const Prism = require("prismjs");
const runSequence = require("run-sequence");
const helpers = require("../helpers.js");

// Primary navigation tree
let navTree;

// Static templates
let pageTemplate;

/**
 * Initialization
 */
gulp.task("templates:init", function templatesInitTask() {
  // Load nav menu configuration file
  let config = helpers.loadConfigFile("./src/site/navigation.yml");
  if (config.primaryNav) {
    navTree = config.primaryNav;
  }
  // Compile static templates
  pageTemplate = handlebars.Handlebars.compile(
    fs.readFileSync("./src/site/templates/page.hbs", "utf8")
  );
});

/**
 * Generate a duplicate "partial" file of the encoded SCSS for display
 */
gulp.task("templates:scss", function templatesSpecimensSnippetsTask() {
  return gulp.src("./src/site/code/**/*.sass")
    .pipe(tap(file => {
      // Scrape metadata
      let specimen = file.contents.toString();

      // Format HTML for display
      specimen = Prism.highlight(specimen, Prism.languages.css);

      // Wrap the encoded HTML in some tags
      specimen = "<div class='prettyprint'><pre><h4>SCSS</h4><code class='language-scss'>" + specimen + "</code></pre></div>";

      // Replace file contents with snippet HTML
      file.contents = new Buffer(specimen);
      return file;
    }))
    .pipe(rename({
      suffix: "-scss",
      extname: ".hbs"
    }))
    .pipe(gulp.dest("./temp"));
});

/**
 * Generate a duplicate "partial" file of the encoded HTML for display
 */
gulp.task("templates:html", function templatesSpecimensSnippetsTask() {
  return gulp.src("./src/site/code/**/*.hbs")
    .pipe(tap(file => {
      // Scrape metadata
      let specimen = file.contents.toString();

      // Format HTML for display
      specimen = beautify_html(specimen, {
        indent_size: 2,
        preserve_newlines: false,
        wrap_line_length: 0,
        unformatted: []
      });
      specimen = Prism.highlight(specimen, Prism.languages.markup);

      // Wrap the encoded HTML in some tags
      specimen = "<div class='prettyprint'><pre><h4>HTML</h4><code class='language-markup'>" + specimen + "</code></pre></div>";

      // Replace file contents with snippet HTML
      file.contents = new Buffer(specimen);
      return file;
    }))
    .pipe(rename({
      suffix: "-code"
    }))
    .pipe(gulp.dest("./temp"));
});

/**
 * Generate site pages
 */
gulp.task("templates:site", function templatesSitePagesTask() {
  let templateData = {
    basePath: "/",
    navTree: navTree
  };

  let options = {
    ignorePartials: true,
    // partials: {
        // footer: '<footer>the end</footer>'
    // },
    batch: ["./src/site/code", "./src/site/templates", "./temp"]
    // helpers: {
    //   capitals: function(str) {
    //     return str.toUpperCase();
    //   }
    // }
  };

  return gulp.src("./src/site/pages/**/*.hbs")
    .pipe(handlebars(templateData, options))
    .pipe(tap(file => {
      // Identify which item in the nav tree corresponds to the current page
      // (the regex replacement removes "filename.hbs")
      let filePath = file.path.split("/src/site/pages/")[1].replace(".hbs", ".html");
      let updatedTree = applyActivePathToTree(navTree, filePath);

      // Pass page HTML into page template
      let pageHtml = pageTemplate({
        basePath: "/",
        body: file.contents.toString(),
        navTree: updatedTree
      });

      // Replace file contents with snippet HTML
      file.contents = new Buffer(pageHtml);
      return file;
    }))
    .pipe(rename({extname: ".html"}))
    .pipe(gulp.dest("./docs"));
});

/**
 * Gateway task
 */
gulp.task("templates", function templatesTask(done) {
  runSequence(
    "templates:init",
    "templates:html",
    "templates:scss",
    "templates:site",
    function onSequenceComplete() {
      done();
    }
  );
});

/**
 * Returns a copy of the original tree, with an "active" property added
 * to the object who's "path" property matches the search string
 */
function applyActivePathToTree(tree, searchString) {
  const findPath = function iterate(obj, search) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (prop === "path") {
          if (removeOuterSlashes(obj[prop]) === search) {
            obj.active = true;
          }
        } else if (typeof obj[prop] == "object") {
          iterate(obj[prop], search);
        }
      }
    }
  };
  let treeCopy = JSON.parse(JSON.stringify(tree));
  findPath(treeCopy, removeOuterSlashes(searchString));
  return treeCopy;
}

/**
 * Removes leading and trailing slashes from string
 */
function removeOuterSlashes(str) {
  return str.replace(/^\/|\/$/g, "");
}
