"use strict";

require("./custom-event-polyfill.js");

/**
 * Throttle the window.resize event for better performance
 * See: https://developer.mozilla.org/en-US/docs/Web/Events/resize
 */
const throttle = function(type, name, obj) {
  obj = obj || window;
  let running = false;
  const func = function(eventDetail) {
    if (running) {
      return;
    }
    running = true;
    requestAnimationFrame(function onAnimationFrame() {
      obj.dispatchEvent(new CustomEvent(name, {bubbles: false, cancelable: false, detail: eventDetail}));
      running = false;
    });
  };
  obj.addEventListener(type, func);
};

module.exports = throttle;
