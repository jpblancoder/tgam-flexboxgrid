"use strict";

const gulp = require("gulp");
const siteConfig = require("../site-config.js");

/**
 * Copy site images
 */
gulp.task("images:site", function imagesSiteTask() {
  return gulp.src("./src/site/images/**/*.*")
    .pipe(gulp.dest(`.${siteConfig.basePath}/images`));
});

/**
 * Gateway task
 */
gulp.task("images", [
    "images:site"
  ],
  function imagesTask(done) {
    done();
  }
);
