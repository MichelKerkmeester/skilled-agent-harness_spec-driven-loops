/**
 * Example usage of task mode detection
 * @module features/mode-detection/example
 */

import { detectTaskMode, shouldPromptForMode } from "./detector.js";

// Example 1: Quick fix detection
console.log("=== Example 1: Quick Fix ===");
const quickResult = detectTaskMode("Fix typo in README");
console.log("Request:", "Fix typo in README");
console.log("Suggested mode:", quickResult.suggestedMode);
console.log("Confidence:", quickResult.confidence.toFixed(2));
console.log("Signals:", quickResult.signals);
console.log("Should prompt?", shouldPromptForMode(quickResult));
console.log();

// Example 2: Standard feature
console.log("=== Example 2: Standard Feature ===");
const standardResult = detectTaskMode(
  "Add new user profile component with avatar and bio"
);
console.log("Request:", "Add new user profile component with avatar and bio");
console.log("Suggested mode:", standardResult.suggestedMode);
console.log("Confidence:", standardResult.confidence.toFixed(2));
console.log("Signals:", standardResult.signals);
console.log("Should prompt?", shouldPromptForMode(standardResult));
console.log();

// Example 3: Comprehensive refactor
console.log("=== Example 3: Comprehensive Refactor ===");
const comprehensiveResult = detectTaskMode(
  "Refactor the entire authentication system to use JWT tokens across all endpoints and update the database schema"
);
console.log(
  "Request:",
  "Refactor the entire authentication system to use JWT tokens across all endpoints..."
);
console.log("Suggested mode:", comprehensiveResult.suggestedMode);
console.log("Confidence:", comprehensiveResult.confidence.toFixed(2));
console.log("Signals:", comprehensiveResult.signals);
console.log("Should prompt?", shouldPromptForMode(comprehensiveResult));
console.log();

// Example 4: Milestone project
console.log("=== Example 4: Milestone Project ===");
const milestoneResult = detectTaskMode(
  "Build MVP with core features: user authentication, profile management, and basic dashboard for beta launch"
);
console.log(
  "Request:",
  "Build MVP with core features: user authentication, profile management..."
);
console.log("Suggested mode:", milestoneResult.suggestedMode);
console.log("Confidence:", milestoneResult.confidence.toFixed(2));
console.log("Signals:", milestoneResult.signals);
console.log("Should prompt?", shouldPromptForMode(milestoneResult));
console.log();

// Example 5: Ambiguous request
console.log("=== Example 5: Ambiguous Request ===");
const ambiguousResult = detectTaskMode("Update the system");
console.log("Request:", "Update the system");
console.log("Suggested mode:", ambiguousResult.suggestedMode);
console.log("Confidence:", ambiguousResult.confidence.toFixed(2));
console.log("Signals:", ambiguousResult.signals);
console.log("Alternatives:", ambiguousResult.alternatives);
console.log("Should prompt?", shouldPromptForMode(ambiguousResult));
console.log();

// Example 6: Integration with workflow
console.log("=== Example 6: Workflow Integration ===");
function processUserRequest(request: string): void {
  const result = detectTaskMode(request);

  if (shouldPromptForMode(result)) {
    console.log(`\n🤔 Detected mode: ${result.suggestedMode}`);
    console.log(`   Confidence: ${(result.confidence * 100).toFixed(0)}%`);
    if (result.alternatives.length > 0) {
      console.log(`   Alternatives: ${result.alternatives.join(", ")}`);
    }
    console.log("   → Would prompt user to confirm or choose");
  } else {
    console.log(`\n✓ Auto-detected mode: ${result.suggestedMode}`);
    console.log(`  Confidence: ${(result.confidence * 100).toFixed(0)}%`);
    console.log("  → Proceeding automatically");
  }
}

processUserRequest("Fix bug in login");
processUserRequest("Build new feature");
processUserRequest("Refactor entire codebase");
