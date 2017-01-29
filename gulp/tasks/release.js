"use strict";

const fs = require("fs");
const gulp = require("gulp");
const rename = require('gulp-rename');
const siteConfig = require("../site-config.js");

/**
 * Rename dev folder to docs folder for github
 */
gulp.task("release:docs", function publishDocsTask(done) {
  // create new docs folder with latest
  fs.rename(`./public${siteConfig.basePath}`, "docs", function (err) {
    if (err) {
      throw err;
    }
    done();
  });
});

/**
 * Copy docs dist folder into root dist folder
 */
gulp.task("release:dist", function publishDistTask() {
  return gulp.src(`./docs/dist/*`)
    .pipe(gulp.dest("./dist"));
});

/**
 * Gateway task
 */
gulp.task("release", [
    "release:docs",
    "release:dist"
  ],
  function publishTask(done) {
    done();
  }
);
