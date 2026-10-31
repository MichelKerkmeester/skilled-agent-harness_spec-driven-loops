---
title: "480 -- Golden render of every level"
description: "This scenario validates that every level renders to the stored golden snapshots and that each document keeps its frozen anchor count."
version: 1.0.0.0
id: template-authoring-golden-render-all-levels
---

# 480 -- Golden render of every level

## 1. OVERVIEW

This scenario validates the two template guards phase 4 adds. The golden test renders every level and compares the result with a stored snapshot. The fill guidance test renders every level and document and checks the anchor count and the one fill line per section. The scenario runs both and reads their test counts.

### Why This Matters

A fill instruction sits inside a template that a renderer prunes. A change that reads well in the source can alter the rendered shape, move an anchor or drop a section. The stored snapshots catch the shape change, and the anchor counts catch the structural change.

---

## 2. SCENARIO CONTRACT

Operators run both template guards and read the pass counts.

- Objective: Prove that the golden render prints `12 passed` and the fill guidance test prints `16 passed` without a snapshot update.
- Playbook ID: 480.
- Real user request: `Render every level and confirm the stored snapshots still match and every document still holds its anchors.`
- Prompt: `Render every level and confirm the stored snapshots still match and every document still holds its anchors.`
- Preconditions: A checkout with Node and the installed `node_modules` under `.skilled/skills/system-spec-kit`, and phase 4 closed so both test files exist. The scenario needs no network.
- Expected execution process: Run the golden test without a snapshot update, then run the fill guidance test, then read the `Tests` line from each run.
- Expected signals: The golden run prints `Tests  12 passed (12)`. The fill run prints `Tests  16 passed (16)`. Neither run prints `failed`.
- Desired user-visible outcome: The operator sees both guards green on the unchanged tree.
- Pass/fail: PASS if both runs print their expected pass count and neither prints a failure. FAIL if a run fails or updates a snapshot.

---

## 3. TEST EXECUTION

### Prompt
