/**
 * Renderer Process—This module is required by the index page.
 * It touches the DOM by showing progress in challenge completion.
 * It also handles the clear buttons and writing to user-data.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { ipcRenderer } from "electron";
import type { UserData } from "./user-data.js";
import { getData } from "./user-data.js";

document.addEventListener("DOMContentLoaded", () => {
  const data = getData();

  // Buttons
  const clearAllButtons = document.querySelectorAll<HTMLButtonElement>(".js-clear-all-challenges");
  const leftOffButton = document.getElementById("left-off-from") as HTMLAnchorElement | null;

  // Sections
  const showFirstRun = document.getElementById("show-first-run") as HTMLElement | null;
  const showWipRun = document.getElementById("show-wip-run") as HTMLElement | null;
  const showFinishedRun = document.getElementById("show-finished-run") as HTMLElement | null;

  updateIndex(data.contents);

  // Listen for Clear All Button Events, trigger confirmation dialog
  clearAllButtons.forEach((button) => {
    button.addEventListener("click", () => {
      ipcRenderer.send("confirm-clear");
    });
  });

  ipcRenderer.on("confirm-clear-response", (event, response: number) => {
    if (response === 1) return;
    else clearAllChallenges(data);
  });

  /**
   * Go through each challenge in user data to see which are completed
   */
  function updateIndex(challengeData: Record<string, any>): void {
    const circles = document.querySelectorAll<HTMLElement>(".progress-circle");
    let counter = 0;
    let completed = 0;

    for (const challengeKey in challengeData) {
      if (challengeData[challengeKey]?.completed) {
        // A challenge is completed so show the WIP run HTML
        if (showWipRun) showWipRun.style.display = "block";
        if (showFirstRun) showFirstRun.style.display = "none";
        if (showFinishedRun) showFinishedRun.style.display = "none";

        // Mark the corresponding circle as completed
        circles[counter]?.classList.add("completed");

        // Show the button to go to next challenge
        if (leftOffButton) {
          leftOffButton.href = path.join(
            __dirname,
            "..",
            "challenges",
            `${challengeData[challengeKey].next_challenge}.html`
          );
        }
        completed++;
        counter++;
      } else {
        counter++;
      }
    }

    if (completed === 0) {
      // No challenges are complete, show the first run HTML
      if (showFirstRun) showFirstRun.style.display = "block";
      if (showWipRun) showWipRun.style.display = "none";
      if (showFinishedRun) showFinishedRun.style.display = "none";
    }

    if (completed === Object.keys(challengeData).length) {
      // All of the challenges are complete! Show the finished run HTML
      if (showFirstRun) showFirstRun.style.display = "none";
      if (showWipRun) showWipRun.style.display = "none";
      if (showFinishedRun) showFinishedRun.style.display = "block";
    }
  }

  function clearAllChallenges(userData: UserData): void {
    for (const challengeKey in userData.contents) {
      if (userData.contents[challengeKey]?.completed) {
        userData.contents[challengeKey].completed = false;
      }
    }

    fs.writeFileSync(userData.path, JSON.stringify(userData.contents, null, 2));

    // If they clear all challenges, go back to first run HTML
    const circles = document.querySelectorAll<HTMLElement>(".progress-circle");
    circles.forEach((circle) => {
      circle.classList.remove("completed");
    });

    if (showFirstRun) showFirstRun.style.display = "block";
    if (showWipRun) showWipRun.style.display = "none";
    if (showFinishedRun) showFinishedRun.style.display = "none";
  }
});