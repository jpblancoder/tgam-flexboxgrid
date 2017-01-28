"use strict";

const fs = require("fs");
const gulp = require("gulp");
const rename = require('gulp-rename');
const siteConfig = require("../site-config.js");

/**
 * Rename dev folder to docs folder for github
 */
gulp.task("docs", function publishSiteTask(done) {
  // create new docs folder with latest
  fs.rename(`./public${siteConfig.basePath}`, "docs", function (err) {
    if (err) {
      throw err;
    }
    done();
  });
});
