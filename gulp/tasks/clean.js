"use strict";

const del = require("del");
const gulp = require("gulp");

/**
 * Delete all output files
 */
gulp.task("clean", function cleanTask() {
  return del([
    "./public/**/*",
    "./temp/**/*",
    "./dist/**/*",
    "./docs/**/*"
  ]);
});
