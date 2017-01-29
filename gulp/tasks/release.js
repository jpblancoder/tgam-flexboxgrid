"use strict";

const gulp = require("gulp");
const runSequence = require("run-sequence");
const siteConfig = require("../site-config.js");

/**
 * Copy development public folder to root docs folder for github
 */
gulp.task("release:docs", function publishDocsTask(done) {
  return gulp.src(`./public${siteConfig.basePath}/**/*`)
    .pipe(gulp.dest("./docs"));
});

/**
 * Copy docs dist folder into root dist folder
 */
gulp.task("release:dist", function publishDistTask() {
  return gulp.src(`./docs/dist/**/*`)
    .pipe(gulp.dest("./dist"));
});

/**
 * Gateway task
 */
 gulp.task("release", function releaseTask(done) {
   runSequence(
     "release:docs",
     "release:dist",
     function onSequenceComplete() {
       done();
     }
   );
 });
