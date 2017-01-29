"use strict";

const fs = require("fs");
const gulp = require("gulp");
const rename = require('gulp-rename');
const tap = require("gulp-tap");
const handlebars = require('gulp-compile-handlebars');
const beautify_html = require("js-beautify").html;
const path = require("path");
const Prism = require("prismjs");
const rmdir = require("rimraf");
const runSequence = require("run-sequence");
const helpers = require("../helpers.js");
const siteConfig = require("../site-config.js");

// Primary navigation tree
let navTree;

// Static templates
let specimenPageTemplate;
let specimenSnippetTemplate;
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
  specimenPageTemplate = handlebars.Handlebars.compile(
    fs.readFileSync("./src/site/templates/specimen-page.hbs", "utf8")
  );
  specimenSnippetTemplate = handlebars.Handlebars.compile(
    fs.readFileSync("./src/site/templates/specimen-snippet.hbs", "utf8")
  );
  pageTemplate = handlebars.Handlebars.compile(
    fs.readFileSync("./src/site/templates/page.hbs", "utf8")
  );
});

/**
 * Generate a duplicate "partial" file of the encoded SCSS for display
 */
gulp.task("templates:specimens:scss", function templatesSpecimensScssTask() {
  return gulp.src("./src/specimens/**/*.sass")
    .pipe(tap(file => {
      // Scrape metadata
      let specimen = file.contents.toString();

      // Format HTML for display
      let prismed = Prism.highlight(specimen, Prism.languages.css);

      // SCSS code cannot be viewed in isolation
      specimen = specimenSnippetTemplate({
        title: "SCSS",
        language: "scss",
        body: prismed
      });

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
gulp.task("templates:specimens:html", function templatesSpecimensHtmlTask() {
  return gulp.src("./src/specimens/**/*.hbs")
    .pipe(tap(file => {
      // Scrape metadata
      let specimen = file.contents.toString();

      // common beautify html options
      let beautifyOptions = {
        indent_size: 2,
        preserve_newlines: false,
        wrap_line_length: 0,
        unformatted: []
      };

      // Debug classes that wrap code in codepen
      let debugClasses = "l-container--debug";

      // Required codepen CSS
      let codepenCSS = "// Optional debug class: " + debugClasses + "\n";
      codepenCSS += "// Required body styles:\n";
      codepenCSS += "*, *:before, *:after { box-sizing: border-box; }";

      // Format HTML for display
      let wrapped = beautify_html(`<div class="${debugClasses}">\n${specimen}\n</div>`, beautifyOptions);
      let formatted = beautify_html(specimen, beautifyOptions);
      let prismed = Prism.highlight(formatted, Prism.languages.markup);

      // Codepen.io prefill: https://blog.codepen.io/documentation/api/prefill/
      let codepenData = {
        title: "TGAM Flexbox Grid",
        editors: "110", // panels: html show, css show, js hide
        head: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
        html: wrapped,
        css: codepenCSS,
        css_pre_processor: "scss",
        css_external: siteConfig.distURL
      };

      // Stringify the html for form submission to Codepen
      var codepenJSON = JSON.stringify(codepenData).replace(/"/g, "&​quot;").replace(/'/g, "&apos;");

      // Get part of the url for the specimen
      let filePath = file.path.split(siteConfig.basePath + "/src")[1].replace(".hbs", ".html");

      // HTML code can be viewed in isolation
      specimen = specimenSnippetTemplate({
        title: "HTML",
        language: "markup",
        iframeSrc: siteConfig.basePath + filePath,
        body: prismed,
        codepen: codepenJSON,
        uniqueId: "specimen-codepen-" + (new Date%9e6).toString(36)
      });

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
 * Generate an HTML page for each specimen
 */
gulp.task("templates:specimens:pages", function templatesSpecimensPagesTask() {
  return gulp.src("./src/specimens/**/*.hbs")
    .pipe(tap(file => {
      let jsonData = {};
      // Compile specimen template
      let specimenTemplate = handlebars.Handlebars.compile(file.contents.toString());
      let specimenHtml = specimenTemplate(jsonData);

      // Pass specimen HTML into specimen page template
      let pageHtml = specimenPageTemplate({
        metaTitle: "TGAM Flexbox Grid",
        basePath: siteConfig.basePath,
        wrapClasses: "l-container--debug",
        body: specimenHtml
      });
      // Replace file contents with page HTML
      file.contents = new Buffer(pageHtml);
      return file;
    }))
    // .pipe(rename({basename: "index", extname: ".html"}))
    .pipe(rename({extname: ".html"}))
    .pipe(gulp.dest(`./public${siteConfig.basePath}/specimens`));
});

/**
 * Generate site pages
 */
gulp.task("templates:site:pages", function templatesSitePagesTask() {
  let templateData = {
    basePath: siteConfig.basePath,
    navTree: navTree
  };

  let options = {
    ignorePartials: true,
    batch: ["./temp", "./src/site/templates", "./src/specimens"],
    helpers: {
      // used in primary/secondary nav partials
      basePath: function(str) {
        return templateData.basePath;
      }
    }
  };

  return gulp.src("./src/site/pages/**/*.hbs")
    .pipe(handlebars(templateData, options))
    .pipe(tap(file => {
      // Identify which item in the nav tree corresponds to the current page
      // (the regex replacement removes "filename.hbs")
      let filePath = file.path.split("/src/site/pages/")[1].replace(/\/*[\w\d\s]*.hbs/g, "");
      let updatedTree = applyActivePathToTree(navTree, filePath);

      // Pass page HTML into page template
      let pageHtml = pageTemplate({
        metaTitle: "TGAM Flexbox Grid",
        basePath: siteConfig.basePath,
        bodyClasses: "",
        body: file.contents.toString(),
        navTree: updatedTree
      });

      // Replace file contents with snippet HTML
      file.contents = new Buffer(pageHtml);
      return file;
    }))
    .pipe(rename({extname: ".html"}))
    .pipe(gulp.dest(`./public${siteConfig.basePath}`));
});

/**
 * Deinitialization
 */
gulp.task("templates:deinit", function templatesDeinitTask(done) {
  // Delete "temp" directory
  let dirPath = path.resolve("./temp");
  if (helpers.directoryExists(dirPath)) {
    rmdir(dirPath, {}, error => {
      if (error) {
        console.log(error);
      }
    });
  }
  done();
});

/**
 * Gateway task
 */
gulp.task("templates", function templatesTask(done) {
  runSequence(
    "templates:init",
    "templates:specimens:scss",
    "templates:specimens:html",
    "templates:specimens:pages",
    "templates:site:pages",
    "templates:deinit",
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
