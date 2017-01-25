"use strict";

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function directoryExists(directoryPath) {
  try {
    let stats = fs.lstatSync(path.resolve(directoryPath));
    if (stats.isDirectory()) {
      return true;
    }
  } catch(e) {
    // console.log(e);
  }
  return false;
}

function fileExists(filePath) {
  try {
    let stats = fs.lstatSync(path.resolve(filePath));
    if (stats.isFile()) {
      return true;
    }
  } catch(e) {
    // console.log(e);
  }
  return false;
}

function loadConfigFile(filePath) {
  let config;
  if (fileExists(filePath)) {
    try {
      config = yaml.safeLoad(fs.readFileSync(filePath, "utf8"));
    } catch(e) {
      console.log(e);
    }
  }
  return config;
}

module.exports = {
  directoryExists,
  fileExists,
  loadConfigFile
};
