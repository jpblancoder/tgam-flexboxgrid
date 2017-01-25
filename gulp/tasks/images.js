"use strict";

const gulp = require("gulp");

/**
 * Copy site images
 */
gulp.task("images:site", function imagesSiteTask() {
  return gulp.src("./src/site/images/**/*.*")
    .pipe(gulp.dest(`./docs/images`));
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
