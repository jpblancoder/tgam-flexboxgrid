"use strict";

const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const runSequence = require("run-sequence");
const bourbonIncludePaths = require("node-bourbon").includePaths;
const siteConfig = require("../site-config.js");

/**
 * Compile site styles
 */
gulp.task("styles:site:sass", function () {
  return gulp.src("./src/site/stylesheets/main.scss")
    .pipe(rename({basename: "styles", extname: ".min.css"}))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: "compressed",
      includePaths: bourbonIncludePaths,
      precision: 10
    }).on("error", sass.logError))
    .pipe(autoprefixer({
      browsers: ["last 2 versions"],
      cascade: false
    }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(`.${siteConfig.basePath}/stylesheets`));
});

/**
 * Compile flexbox grid styles
 */
gulp.task("styles:specimen:sass", function () {
  return gulp.src("./src/patterns/flexboxgrid/all.scss")
    .pipe(rename({basename: "flexboxgrid"}))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: ["./src/patterns/flexboxgrid"].concat(bourbonIncludePaths),
      precision: 10
    }).on("error", sass.logError))
    .pipe(autoprefixer({
      browsers: ["last 2 versions"],
      cascade: false
    }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist"));
});

/**
 * Minify flexbox grid styles
 */
gulp.task("styles:specimen:min", function() {
  return gulp.src("./dist/flexboxgrid.css")
    .pipe(cleanCSS({compatibility: "ie8"}))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./dist"));
});

/**
 * Copy distribution folder into docs folder
 */
gulp.task("styles:specimen:docs", function() {
  return gulp.src("./dist/*")
    .pipe(gulp.dest(`.${siteConfig.basePath}/dist`));
});

/**
 * Process the specimen styles
 */
gulp.task("styles:specimen", function stylesSpecimenTask(done) {
  runSequence(
    "styles:specimen:sass",
    "styles:specimen:min",
    "styles:specimen:docs",
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
  }
);
