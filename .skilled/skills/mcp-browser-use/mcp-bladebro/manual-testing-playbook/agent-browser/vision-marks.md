---
title: "BB-008 -- Marked screenshot"
description: "This scenario validates `vision --marks` for `BB-008`. It focuses on a PNG with an image path and interactive marks."
version: 1.0.1.0
---

# BB-008 -- Marked screenshot

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-008`.

---

## 1. OVERVIEW

Plan step 9. A screenshot with badges on interactive elements.

### Why This Matters

Vision is the fallback when the structural model misses a control.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-008` and confirm the expected signals without contradictory evidence.

- Objective: Capture a marked screenshot.
- Real user request: `Take a Bladebro screenshot of the current page with the clickable elements marked.`
- Prompt: `Take a Bladebro screenshot of the current page with the clickable elements marked.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: JSON with an `image_path` to a PNG and a count of marked elements, exit 0
- Desired user-visible outcome: A marked screenshot path.
- Pass/fail: PASS if an image path and marks are returned. FAIL if the call errors or returns no image.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Take a Bladebro screenshot of the current page with the clickable elements marked.`

### Commands

1. `bladebro vision --marks --json`

### Expected

- `image_path` ends in `.png`
- The text reports the marked elements

### Evidence

The JSON and the exit status.

### Pass / Fail

- **Pass**: an image path and marks are returned.
- **Fail**: the call errors or returns no image.

### Failure Triage

1. Check the data root has write access for its `artifacts` folder.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `agent-browser/vision-marks.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Bladebro CLI commands and flags |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/agent-browser/marked-screenshots.md` | Feature catalog entry: Marked screenshots |

---

## 5. SOURCE METADATA

- Group: Agent Browser
- Playbook ID: BB-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agent-browser/vision-marks.md`
