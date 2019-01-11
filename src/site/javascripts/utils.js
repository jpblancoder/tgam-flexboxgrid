"use strict";

// CSS transition callback polyfill (borrowed from Modernizr)
exports.whichTransitionEvent = function whichTransitionEvent() {
  let t;
  let el = document.createElement("fakeelement");
  let transitions = {
    "transition": "transitionend",
    "OTransition": "oTransitionEnd",
    "MozTransition": "transitionend",
    "WebkitTransition": "webkitTransitionEnd"
  };
  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
};

// CSS animation callback polyfill (borrowed from Modernizr)
exports.whichAnimationEvent = function whichAnimationEvent() {
  let a;
  let el = document.createElement("fakeelement");
  let animations = {
    "animation": "animationend",
    "OAnimation": "oAnimationEnd",
    "MozAnimation": "animationend",
    "WebkitAnimation": "webkitAnimationEnd"
  };
  for (a in animations) {
    if (el.style[a] !== undefined) {
      return animations[a];
    }
  }
};
