"use strict";

const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const browserslist = require("browserslist");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const runSequence = require("run-sequence");
const siteConfig = require("../site-config.js");

const supportedBrowsers = browserslist("last 4 versions, > 1%, not ie <= 10");
const sassPrecision = 2; // decimal places, default is 5

/**
 * Compile site styles
 */
gulp.task("styles:site:sass", function stylesSiteTask() {
  return gulp.src("./src/site/stylesheets/main.scss")
    .pipe(rename({ basename: "styles", extname: ".min.css" }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: "compressed",
      precision: sassPrecision
    }).on("error", sass.logError))
    .pipe(autoprefixer({
      browsers: supportedBrowsers,
      cascade: false
    }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(`./public${siteConfig.basePath}/stylesheets`));
});

/**
 * Compile flexbox grid styles
 */
gulp.task("styles:specimen:sass", function stylesSpecimenSassTask() {
  return gulp.src("./src/patterns/flexboxgrid/all.scss")
    .pipe(rename({ basename: "flexboxgrid" }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: ["./src/patterns/flexboxgrid"],
      precision: sassPrecision
    }).on("error", sass.logError))
    .pipe(autoprefixer({
      browsers: supportedBrowsers,
      cascade: false
    }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(`./public${siteConfig.basePath}/dist`));
});

/**
 * Minify flexbox grid styles
 */
gulp.task("styles:specimen:min", function stylesSpecimenMinTask() {
  return gulp.src(`./public${siteConfig.basePath}/dist/flexboxgrid.css`)
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(`./public${siteConfig.basePath}/dist`));
});

/**
 * Process the specimen styles
 */
gulp.task("styles:specimen", function stylesSpecimenTask(done) {
  runSequence(
    "styles:specimen:sass",
    "styles:specimen:min",
    function onSequenceComplete() {
      done();
    }
  );
});

/**
 * Process the site styles
 */
gulp.task("styles:site", function stylesSpecimenTask(done) {
  runSequence(
    "styles:site:sass",
    function onSequenceComplete() {
      done();
    }
  );
});

/**
 * Gateway task
 */
gulp.task("styles", [
  "styles:specimen",
  "styles:site"
],
function stylesTask(done) {
  done();
});
