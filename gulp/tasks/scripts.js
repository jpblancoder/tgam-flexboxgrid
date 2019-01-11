"use strict";

const browserify = require("browserify");
const gulp = require("gulp");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const siteConfig = require("../site-config.js");

/**
 * Bundle the Babel Polyfill as its own file, because it needs to be included
 * on every specimen page
 */
gulp.task("scripts:babel-polyfill", function scriptsBabelPolyfillTask() {
  return browserify(["./src/site/javascripts/babel-polyfill.js"], { debug: true })
    .bundle()
    .pipe(source("babel-polyfill.min.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(`./public${siteConfig.basePath}/javascripts`));
});

/**
 * Transpile, bundle and uglify site JavaScript
 */
gulp.task("scripts:site", function scriptsSiteTask() {
  return browserify(["./src/site/javascripts/main.js"], { debug: true })
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(source("bundle.min.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(`./public${siteConfig.basePath}/javascripts`));
});

/**
 * Concatenate and uglify site vendor JavaScript
 */
gulp.task("scripts:site:vendor", function scriptsSiteVendorTask() {
  return gulp.src("./src/site/vendor/javascripts/**/*.js")
    .pipe(concat("vendor.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(`./public${siteConfig.basePath}/javascripts`));
});

/**
 * Gateway task
 */
gulp.task("scripts", [
  "scripts:babel-polyfill",
  "scripts:site",
  "scripts:site:vendor"
],
function scriptsTask(done) {
  done();
});
