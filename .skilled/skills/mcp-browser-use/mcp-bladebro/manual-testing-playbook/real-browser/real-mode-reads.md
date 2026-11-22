---
title: "BB-012 -- Reads and actions in the real-browser lane"
description: "This scenario validates page reads and an eval in the real-browser lane for `BB-012`. It focuses on see content, see model and act eval working without the injection layer."
version: 1.0.1.0
---

# BB-012 -- Reads and actions in the real-browser lane

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BB-012`.

---

## 1. OVERVIEW

Plan step 13. The same reads as BB-006 and BB-007, now driven through the real browser.

### Why This Matters

This is the proof that the real-browser lane works on macOS with the chosen browser.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BB-012` and confirm the expected signals without contradictory evidence.

- Objective: Read example.com, read its model and evaluate one expression in the real lane.
- Real user request: `In the real-browser lane, read example.com, list its controls and evaluate the page title.`
- Prompt: `In the real-browser lane, read example.com, list its controls and evaluate the page title.`
- Expected execution process: run the commands in order from the repository root on macOS, read each output and exit status, then judge them against the pass/fail criteria.
- Expected signals: each call returns `ok: true` and exits 0
- Desired user-visible outcome: The real lane reads and acts.
- Pass/fail: PASS if all three calls succeed. FAIL if any call errors. Record it without a retry, then roll back with `bladebro rb off`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `In the real-browser lane, read example.com, list its controls and evaluate the page title.`

### Commands

1. `bladebro see content https://example.com --json`
2. `bladebro see model --json`
3. `bladebro act eval "document.title" --json`

### Expected

- The example.com text
- A ref for the "Learn more" link
- The eval result

### Evidence

All three outputs, plus the browser launch log on a failure.

### Pass / Fail

- **Pass**: all three calls succeed.
- **Fail**: any call errors. Record it without a retry, then roll back with `bladebro rb off`.

### Failure Triage

1. `Chrome launch failed: no page target available` means the launched browser exposed no page target. Read the launch log for the DevTools line and extension errors.
2. Try another Chromium-family binary only in a new, separately approved run.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `real-browser/real-mode-reads.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Agent-browser and real-browser lanes |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Bladebro CLI commands and flags |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/real-browser/clone-mode.md` | Feature catalog entry: Clone mode |

---

## 5. SOURCE METADATA

- Group: Real Browser
- Playbook ID: BB-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `real-browser/real-mode-reads.md`
