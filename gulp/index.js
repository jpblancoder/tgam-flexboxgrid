"use strict";

const gulp = require("gulp");
const sassLint = require("gulp-sass-lint");
const requireDir = require("require-dir");
const runSequence = require("run-sequence");

requireDir("./tasks", {recurse: true});

/**
 * Default task
 */
gulp.task("default", function defaultTask(done) {
  runSequence(
    "generate",
    "launch",
    function onSequenceComplete() {
      done();
    }
  );
});

/**
 * Generate static website
 */
gulp.task("generate", function generateTask(done) {
  runSequence(
    "clean",
    ["templates", "styles", "scripts", "images"],
    function onSequenceComplete() {
      done();
    }
  );
});

/**
 * Launch local development server
 */
gulp.task("launch", function launchTask(done) {
  runSequence(
    "serve",
    "watch",
    function onSequenceComplete() {
      done();
    }
  );
});

/**
 * Publish to docs folder from dev folder
 */
gulp.task("publish", function launchTask(done) {
  runSequence(
    "generate",
    "release",
    function onSequenceComplete() {
      done();
    }
  );
});

/**
 * Lint the SASS files
 */
gulp.task("sass:lint", function sassLintTask() {
  let lintPaths = [
    "src/patterns/flexboxgrid/*.scss"
  ];
  return gulp.src(lintPaths, {base: "./"})
    // gulp-sass-lint's "configFile" option doesn't always work properly when
    // .sass-lint.yml is not in the same directory as .gulpfile, so it's safer
    // to use the "options" parameter instead. See:
    // https://github.com/sasstools/gulp-sass-lint/issues/34
    .pipe(sassLint({
      options: {"config-file": "./src/patterns/flexboxgrid/configs/.sass-lint.yml"}
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});
