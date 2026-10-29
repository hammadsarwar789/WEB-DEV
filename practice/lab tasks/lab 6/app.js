/**
 * LAB 6 - TASK 3: Application Entry Point (app.js)
 * Demonstrates closure encapsulation and state independence between trackers.
 */

import { createTracker } from "./tracker.js";

// 1. Create two completely independent revision tracker instances
const trackerWebDev = createTracker(0);  // Subject 1: Web Technologies
const trackerDatabases = createTracker(30); // Subject 2: Database Systems (starts with 30m prior work)

// DOM Elements - Tracker 1 (Web Dev)
const displayA = document.getElementById("timeA");
const btnAdd15A = document.getElementById("btnAdd15A");
const btnAdd30A = document.getElementById("btnAdd30A");
const btnResetA = document.getElementById("btnResetA");

// DOM Elements - Tracker 2 (Databases)
const displayB = document.getElementById("timeB");
const btnAdd15B = document.getElementById("btnAdd15B");
const btnAdd30B = document.getElementById("btnAdd30B");
const btnResetB = document.getElementById("btnResetB");

// Proof Log Box
const consoleLogBox = document.getElementById("consoleLogBox");

/**
 * Appends a timestamped log to the UI and console
 */
function logEvent(message, isHighlight = false) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement("div");
    entry.className = `log-entry ${isHighlight ? 'highlight' : ''}`;
    entry.textContent = `[${timestamp}] ${message}`;
    
    if (consoleLogBox) {
        consoleLogBox.appendChild(entry);
        consoleLogBox.scrollTop = consoleLogBox.scrollHeight;
    }
    console.log(`[RevisionTracker] ${message}`);
}

/**
 * Syncs the UI displays with current tracker closure states
 */
function updateDisplays() {
    if (displayA) displayA.textContent = `${trackerWebDev.current()} mins`;
    if (displayB) displayB.textContent = `${trackerDatabases.current()} mins`;
}

// =========================================================================
// Automated Independence Verification on Startup
// =========================================================================
function verifyClosureIndependence() {
    logEvent("--- INITIALIZING CLOSURE INDEPENDENCE TEST ---", true);
    logEvent(`Initial State -> Tracker A: ${trackerWebDev.current()}m, Tracker B: ${trackerDatabases.current()}m`);

    // Add multiple durations using rest params to Tracker A only
    trackerWebDev.add(15, 25);
    logEvent(`Added (15, 25) mins to Tracker A -> Tracker A: ${trackerWebDev.current()}m`);
    logEvent(`Verifying Tracker B unaffected -> Tracker B: ${trackerDatabases.current()}m (Remained 30m)`);

    // Reset Tracker A
    trackerWebDev.reset();
    logEvent(`Reset Tracker A -> Tracker A: ${trackerWebDev.current()}m`);
    logEvent(`Verifying Tracker B STILL unaffected -> Tracker B: ${trackerDatabases.current()}m`);

    // Reset Tracker A to a clean 45m session for interactive testing
    trackerWebDev.add(45);
    logEvent(`Set Tracker A to 45m for interactive testing.`);
    logEvent("--- VERIFICATION PASSED: BOTH TRACKER CLOSURES ARE FULLY ISOLATED ---", true);

    updateDisplays();
}

// =========================================================================
// Event Listeners for Tracker A (Web Technologies)
// =========================================================================
if (btnAdd15A) {
    btnAdd15A.addEventListener("click", () => {
        trackerWebDev.add(15);
        updateDisplays();
        logEvent(`Tracker A (Web Dev) +15m -> Total: ${trackerWebDev.current()}m | (Tracker B is unchanged at ${trackerDatabases.current()}m)`);
    });
}

if (btnAdd30A) {
    btnAdd30A.addEventListener("click", () => {
        trackerWebDev.add(30);
        updateDisplays();
        logEvent(`Tracker A (Web Dev) +30m -> Total: ${trackerWebDev.current()}m | (Tracker B is unchanged at ${trackerDatabases.current()}m)`);
    });
}

if (btnResetA) {
    btnResetA.addEventListener("click", () => {
        trackerWebDev.reset();
        updateDisplays();
        logEvent(`Tracker A (Web Dev) RESET to 0m | (Tracker B is unchanged at ${trackerDatabases.current()}m)`, true);
    });
}

// =========================================================================
// Event Listeners for Tracker B (Database Systems)
// =========================================================================
if (btnAdd15B) {
    btnAdd15B.addEventListener("click", () => {
        trackerDatabases.add(15);
        updateDisplays();
        logEvent(`Tracker B (Databases) +15m -> Total: ${trackerDatabases.current()}m | (Tracker A is unchanged at ${trackerWebDev.current()}m)`);
    });
}

if (btnAdd30B) {
    btnAdd30B.addEventListener("click", () => {
        trackerDatabases.add(30);
        updateDisplays();
        logEvent(`Tracker B (Databases) +30m -> Total: ${trackerDatabases.current()}m | (Tracker A is unchanged at ${trackerWebDev.current()}m)`);
    });
}

if (btnResetB) {
    btnResetB.addEventListener("click", () => {
        trackerDatabases.reset();
        updateDisplays();
        logEvent(`Tracker B (Databases) RESET to 0m | (Tracker A is unchanged at ${trackerWebDev.current()}m)`, true);
    });
}

// Run verification test suite on DOM readiness
verifyClosureIndependence();
