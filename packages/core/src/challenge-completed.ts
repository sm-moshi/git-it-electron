/**
 * This module handles the DOM interactions for challenge completion states.
 * It provides an API for setting the page after a challenge has been completed
 * by toggling buttons and updating user data.
 *
 * It is required by each challenge's verify file.
 */

import * as fs from "node:fs";
import type { UserData } from "./user-data.js";
import { getData } from "./user-data.js";

let data: UserData;
let spinner: NodeJS.Timeout;

// DOM elements
const verifyButton = document.getElementById("verify-challenge") as HTMLButtonElement | null;
const directoryPathContent = document.getElementById("directory-path");
const verifySpinner = document.getElementById("verify-spinner") as HTMLElement | null;
const clearStatusButton = document.getElementById("clear-completed-challenge") as HTMLButtonElement | null;

verifyButton?.addEventListener("click", () => {
  // Unless they didn't select a directory
  if (
    directoryPathContent?.innerText &&
    !directoryPathContent.innerText.match(/Please select/)
  ) {
    const verifyList = document.getElementById("verify-list");
    if (verifyList) verifyList.style.display = "block";
    disableVerifyButtons(true);
    startSpinner();
  }
  // If there is no directory button
  if (!directoryPathContent) {
    const verifyList = document.getElementById("verify-list");
    if (verifyList) verifyList.style.display = "block";
    disableVerifyButtons(true);
    startSpinner();
  }
});

function startSpinner(): void {
  spinner = setTimeout(spinnerDelay, 100);
}

function spinnerDelay(): void {
  // If clear button exists then challenge is completed
  if (clearStatusButton?.style.display === "none") {
    if (verifySpinner) verifySpinner.style.display = "inline-block";
  }
}

export function disableVerifyButtons(disabled: boolean): void {
  const verifyBtn = document.getElementById("verify-challenge") as HTMLButtonElement | null;
  const directoryBtn = document.getElementById("select-directory") as HTMLButtonElement | null;

  if (verifyBtn) verifyBtn.disabled = disabled;
  if (directoryBtn) directoryBtn.disabled = disabled;
}

export function enableClearStatus(challenge: string): void {
  // Hide spinner
  // TODO: cancel the timeout here
  if (verifySpinner) verifySpinner.style.display = "none";
  disableVerifyButtons(true);
  if (clearStatusButton) {
    clearStatusButton.style.display = "inline-block";
    clearStatusButton.addEventListener("click", function clicked() {
      // Set challenge to uncompleted and update the user's data file
      data.contents[challenge].completed = false;
      fs.writeFileSync(data.path, JSON.stringify(data.contents, null, 2));

      // Remove the completed status from the page and re-enable verify button
      const challengeElement = document.getElementById(challenge);
      challengeElement?.classList.remove("completed");
      disableVerifyButtons(false);
      removeClearStatus();

      // If there is a list of passed parts of challenge, remove it
      const verifyList = document.getElementById("verify-list");
      if (verifyList) verifyList.style.display = "none";
    });
  }
}

function removeClearStatus(): void {
  if (clearStatusButton) clearStatusButton.style.display = "none";
}

export function completed(challenge: string): void {
  document.addEventListener("DOMContentLoaded", () => {
    checkCompletedness(challenge);

    Object.keys(data.contents).forEach((key) => {
      if (data.contents[key]?.completed) {
        const element = document.getElementById(key);
        element?.classList.add("completed");
      }
    });
  });

  function checkCompletedness(challenge: string): void {
    data = getData();
    if (data.contents[challenge]?.completed) {
      const challengeElement = document.getElementById(challenge);
      challengeElement?.classList.add("completed");

      const header = document.querySelector("header");
      if (header) header.className += " challenge-is-completed";

      // If completed, show clear button and disable verify button
      enableClearStatus(challenge);
      disableVerifyButtons(true);
    } else {
      removeClearStatus();
    }
  }
}

export function challengeIncomplete(): void {
  clearTimeout(spinner);
  // Re-enable the verify button
  disableVerifyButtons(false);
  if (verifySpinner) verifySpinner.style.display = "none";
}