---
title: "BB-011 -- Real-browser lane on in clone mode"
description: "This scenario validates `rb on` in clone mode for `BB-011`. It focuses on the profile import and the lane reporting ON and ACTIVE."
version: 1.0.1.0
---

# BB-011 -- Real-browser lane on in clone mode

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-011`.

---

## 1. OVERVIEW

Plan step 12, the lane switch. Whether the tools work in the real lane is BB-012.

### Why This Matters

Clone mode imports the profile and never writes to the source, which is why it is the approved mechanism.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-011` and confirm the expected signals without contradictory evidence.

- Objective: Turn the lane on and confirm the import.
- Real user request: `Turn the Bladebro real-browser lane on in clone mode.`
- Prompt: `Turn the Bladebro real-browser lane on in clone mode.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: `rb on` exits 0 with an import line and `Real-Browser Lane: ON`, the status reads `ACTIVE` with the clone up to date
- Desired user-visible outcome: The lane is on.
- Pass/fail: PASS if the lane reports ON and ACTIVE. FAIL if the switch errors or the import fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Turn the Bladebro real-browser lane on in clone mode.`

### Commands

1. `bladebro rb on`
2. `bladebro rb status`

### Expected

- `imported N files`
- `mechanism clone`
- `Real-Browser Lane: ACTIVE`

### Evidence

Both outputs.

### Pass / Fail

- **Pass**: the lane reports ON and ACTIVE.
- **Fail**: the switch errors or the import fails.

### Failure Triage

1. Roll back with `bladebro rb off` and `bladebro rb forget`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `real-browser/lane-on-clone.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Agent-browser and real-browser lanes |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/real-browser/clone-mode.md` | Feature catalog entry: Clone mode |

---

## 5. SOURCE METADATA

- Group: Real Browser
- Playbook ID: BB-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `real-browser/lane-on-clone.md`
