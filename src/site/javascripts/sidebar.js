"use strict";

/**
 * Accessibility implementation decisions for this widget were based, in part, on the following:
 * - General rules of ARIA use: http://w3c.github.io/aria-in-html/
 * - Using default implicit ARIA semantics is preferable to adding redundant roles, etc.:
 *   https://www.w3.org/TR/html-aria/#sec-strong-native-semantics
 * - Using "aria-expanded" for collapsible elements:
 *   https://www.w3.org/WAI/GL/wiki/Using_aria-expanded_to_indicate_the_state_of_a_collapsible_element
 * - I studied the mobile nav menu at https://www.paciellogroup.com/
 */

const animationEnd = require("./utils.js").whichAnimationEvent();

const toggle = document.getElementById("burger-button");
const toggleText = toggle.getElementsByClassName("burger-button__text").item(0);
const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main-content");

let maintainSidebarStateOnResize = false;
let sidebarKey = "flexboxgrid-sidebar-open";

function setSidebarState() {
  var sidebarOpen = sessionStorage.getItem(sidebarKey);

  if (sidebarOpen && sidebarOpen == "true") {
    openImmediately();
  }
}
setSidebarState();

toggle.addEventListener("click", toggleSidebar);
sidebar.addEventListener(animationEnd, onSidebarAnimationEnd);

function toggleSidebar(e) {
  e.preventDefault();
  if (toggle.getAttribute("aria-expanded") === "false") {
    open();
  } else {
    close();
  }
}

function open() {
  if (!sidebar.classList.contains("sidebar--hiding") &&
      !sidebar.classList.contains("sidebar--revealing")) {
    toggle.setAttribute("aria-expanded", true);
    toggleText.textContent = "Hide navigation";
    sidebar.classList.add("sidebar--revealing");
    main.classList.remove("sidebar--hidden");
    main.classList.remove("sidebar--hiding");
    main.classList.add("sidebar--revealing");
    sidebar.removeAttribute("hidden");
    sessionStorage.setItem(sidebarKey, true);
  }
}

function openImmediately() {
  sidebar.classList.remove("sidebar--hiding");
  sidebar.classList.remove("sidebar--revealing");
  main.classList.remove("sidebar--hidden");
  main.classList.remove("sidebar--hiding");
  main.classList.remove("sidebar--revealing");
  sidebar.removeAttribute("hidden");
  toggle.setAttribute("aria-expanded", true);
  toggleText.textContent = "Hide navigation";
}

function close() {
  if (!sidebar.classList.contains("sidebar--hiding") &&
      !sidebar.classList.contains("sidebar--revealing")) {
    toggle.setAttribute("aria-expanded", false);
    toggleText.textContent = "Show navigation";
    sidebar.classList.add("sidebar--hiding");
    main.classList.add("sidebar--hiding");
    main.classList.add("sidebar--hidden");
    sessionStorage.setItem(sidebarKey, false);
  }
}

function onSidebarAnimationEnd(e) {
  // Using classList.remove() with multiple arguments fails in IE11,
  // so we're removing classes separately
  sidebar.classList.remove("sidebar--hiding");
  sidebar.classList.remove("sidebar--revealing");
  main.classList.remove("sidebar--hiding");
  main.classList.remove("sidebar--revealing");
  if (toggle.getAttribute("aria-expanded") === "false") {
    sidebar.setAttribute("hidden", "hidden");
    main.classList.add("sidebar--hidden");
    sessionStorage.setItem(sidebarKey, false);
  }
}

module.exports = {
  open: open,
  close: close
};
