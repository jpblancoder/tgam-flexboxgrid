"use strict";

require("./custom-event-polyfill.js");

// Throttle the window.resize event for better performance
// See: https://developer.mozilla.org/en-US/docs/Web/Events/resize
const throttle = function throttleFn(type, name, obj) {
  var obj2 = obj || window;
  let running = false;
  const func = function detail(eventDetail) {
    if (running) {
      return;
    }
    running = true;
    requestAnimationFrame(function onAnimationFrame() {
      obj2.dispatchEvent(new CustomEvent(name, { bubbles: false, cancelable: false, detail: eventDetail }));
      running = false;
    });
  };
  obj.addEventListener(type, func);
};

module.exports = throttle;
