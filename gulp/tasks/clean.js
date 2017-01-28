"use strict";

const del = require("del");
const gulp = require("gulp");
const siteConfig = require("../site-config.js");

/**
 * Delete all output files
 */
gulp.task("clean", function cleanTask() {
  return del([
    "./temp",      // entire dir
    "./dist/**/*", // all contents
    "./docs/**/*", // all contents
    `./${siteConfig.basePath}/**/*` // all contents
  ]);
});
