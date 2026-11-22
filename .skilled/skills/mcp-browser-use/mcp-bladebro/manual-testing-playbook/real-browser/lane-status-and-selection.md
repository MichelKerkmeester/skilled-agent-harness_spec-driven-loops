---
title: "BB-010 -- Real-browser lane status and selection"
description: "This scenario validates `rb status`, `rb use`, `rb profile` and `rb mode` for `BB-010`. It focuses on the lane showing the operator-chosen browser, profile and clone mode."
version: 1.0.1.0
---

# BB-010 -- Real-browser lane status and selection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-010`.

---

## 1. OVERVIEW

Plan step 11. The operator chose the Aside browser binary and a cookie-only staged copy of its signed-in profile, in `clone` mode, for example.com only.

### Why This Matters

The lane drives a real browser as the user. Selection must show exactly what the operator approved before the lane turns on.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-010` and confirm the expected signals without contradictory evidence.

- Objective: Select the browser binary, profile and clone mode, and confirm them in the status.
- Real user request: `Point the Bladebro real-browser lane at the browser and profile I picked, in clone mode, and show its status.`
- Prompt: `Point the Bladebro real-browser lane at the browser and profile I picked, in clone mode, and show its status.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: each command exits 0 and the final status shows the chosen binary, the chosen profile and `clone`
- Desired user-visible outcome: The lane is staged and still off.
- Pass/fail: PASS if the status matches the operator choice. FAIL if any command errors or the status shows another browser or profile.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Point the Bladebro real-browser lane at the browser and profile I picked, in clone mode, and show its status.`

### Commands

1. `bladebro rb status --json`
2. `bladebro rb use --binary <browser binary>`
3. `bladebro rb profile <profile dir>`
4. `bladebro rb mode clone`
5. `bladebro rb status`

### Expected

- `binary override:` the chosen path
- `profile set to` the chosen dir
- `mechanism set to clone`
- Status `STANDBY` with the chosen values

### Evidence

Every output. Profile contents are never quoted.

### Pass / Fail

- **Pass**: the status matches the operator choice.
- **Fail**: any command errors or the status shows another browser or profile.

### Failure Triage

1. If the status shows another profile, reset with `bladebro rb profile auto` and select again.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `real-browser/lane-status-and-selection.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Agent-browser and real-browser lanes |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Bladebro CLI commands and flags |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/real-browser/lane-selection-and-status.md` | Feature catalog entry: Lane selection and status |

---

## 5. SOURCE METADATA

- Group: Real Browser
- Playbook ID: BB-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `real-browser/lane-status-and-selection.md`
