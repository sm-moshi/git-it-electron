/**
 * This module is used by every web page to ensure all external links
 * are opened in the user's default browser.
 */

import { shell } from "electron";

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll<HTMLAnchorElement>("a[href]");

  links.forEach((link) => {
    const url = link.getAttribute("href");
    if (url && url.indexOf("http") > -1) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        shell.openExternal(url);
      });
    }
  });
});