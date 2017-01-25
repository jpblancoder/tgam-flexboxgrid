"use strict";

const throttle = require("./throttle-animation");
throttle("resize", "optimizedResize");

window.App = (function appInit() {

  const sidebar = require("./sidebar.js");

  /**
   * Public API
   */
  return {
    sidebar
  };

})();
