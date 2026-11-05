---
title: "F2C-003 -- Built screen checked against its frame"
description: "This scenario validates the five-pass Figma check for `F2C-003`. It focuses on comparing a built web screen with its authored frame and preserving an honest `INCOMPLETE` verdict when a pass cannot run."
version: 1.0.1.0
---

# F2C-003 -- Built screen checked against its frame

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `F2C-003`.

---

## 1. OVERVIEW

This scenario validates the five-pass Figma check for `F2C-003`. It focuses on comparing a built web screen with its authored frame and giving a reason when a pass cannot run, rather than reporting a pass that never happened.

### Why This Matters

A Figma frame records the intended appearance and states, while the built screen is what people use. The five-pass check catches visual, token, responsive and access gaps. A pass that could not run must never appear as a success: a `NOT RUN` pass makes the overall verdict `INCOMPLETE`, never `PASS`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `F2C-003` and confirm the expected signals without contradictory evidence.

- Objective: confirm the built screen is compared with its authored frame through all five passes, and an unavailable pass is recorded as `NOT RUN` with an overall verdict of `INCOMPLETE`.
- Real user request: `Check the screen we just built against its Figma frame.`
- Prompt: `Check the screen we just built against its Figma frame.`
- Expected execution process: read the frame's file key, node id, authored width W, variants, states and variables without changing the frame. Load `figma-to-code.md` and the web check recipes. Run passes 1 through 4 with `bdg`, then run the Pass 5 width, zoom, keyboard and contrast checks and attempt the manual screen-reader pass. This run has no screen reader available, so record Pass 5 as `NOT RUN` with that reason and set the overall verdict to `INCOMPLETE`.
- Expected signals: Passes 1 through 4 each have evidence and a verdict. Pass 5 records `NOT RUN` with the screen-reader reason. The overall verdict is `INCOMPLETE` and no Figma write occurs.
- Desired user-visible outcome: the agent reports the frame comparison and token findings, explains which checks ran, and states that the overall verdict is `INCOMPLETE` because Pass 5 could not run.
- Pass/fail: PASS if every pass has a verdict and the overall verdict is `INCOMPLETE` because of the `NOT RUN` pass. FAIL if a `NOT RUN` pass is reported as `PASS`, a pass is omitted, or a Figma write runs.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request in plain user language.
2. Decide whether the scenario should stay local or delegate. A read-only Figma pull stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Requires INSPECT-001 PASS (or MCP-001 PASS for the Framelink path), Figma Desktop open with a design file, and the built web screen served in a `bdg` session. The scenario reads Figma and writes nothing to it.

1. Read the frame's file key, node id, authored width W, variants, states and variables  # -> W and the state list recorded, document unchanged
2. Load `figma-to-code.md` and the web check recipes  # -> five passes and capture mechanics cited
3. **Pass 1, same-width comparison:** `bdg cdp Emulation.setDeviceMetricsOverride --params '{"width":<W>,"height":<H>,"deviceScaleFactor":1,"mobile":<bool>}'`, capture with `bdg dom screenshot <path>`, then compare presence, order, wrapping, alignment and overflow  # -> every element present and in order, no overflow at W
4. **Pass 2, state by state:** force each state with `bdg cdp CSS.forcePseudoState --params '{"nodeId":<id>,"forcedPseudoClasses":["hover"]}'` and capture it  # -> each variant and named state has a capture and a verdict
5. **Passes 3a and 3b, token checks:** read resolved styles with `bdg cdp Runtime.evaluate --params '{"expression":"getComputedStyle(...)"}'` and search changed source files for literal colors, sizes and font values  # -> every resolved value matches an installed token or a lag is reported
6. **Pass 4, variable to token:** read each Figma variable and node binding and compare it with the installed package  # -> one row per variable with its verdict
7. **Pass 5, range and access:** check widths below and above W, 200 percent zoom, keyboard traversal, the accessibility tree and contrast, then attempt the manual screen-reader pass  # -> no screen reader available, so record `NOT RUN` with that reason
8. Record the verdict for every pass and set the overall verdict to `INCOMPLETE` because Pass 5 is `NOT RUN`  # -> never reported as `PASS`

| Pass | Evidence to record |
|---|---|
| 1. Same-width comparison | Frame and node id with authored W. Frame and build captures. Verdicts for presence, order, wrapping, alignment and overflow. |
| 2. State by state | Each design variant and named state, its capture and verdict, plus any state recorded as not in design |
| 3a and 3b. Token checks | Resolved style output and the changed-source literal search. Record the repository token checker result when available. |
| 4. Variable to token | One row per Figma variable with its value, installed token, installed value and verdict |
| 5. Range and access | Width, zoom, keyboard and contrast evidence, the accessibility-tree output, and the screen-reader `NOT RUN` reason |

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| F2C-003 | Built screen comparison | Confirm the built screen is compared with its authored frame through all five passes and an unavailable pass is `NOT RUN` | `Check the screen we just built against its Figma frame.` | 1. Read the frame and record W, states and variables -> 2. load `figma-to-code.md` and the web check recipes -> 3. set the authored width with `bdg cdp Emulation.setDeviceMetricsOverride --params '<json>'` and capture -> 4. force states with `bdg cdp CSS.forcePseudoState --params '<json>'` and capture -> 5. check rendered and source tokens -> 6. map variables to installed tokens -> 7. run width, zoom, keyboard and access checks -> 8. record Pass 5 `NOT RUN` and the overall `INCOMPLETE` verdict | Passes 1 through 4 have evidence and verdicts. Pass 5 is `NOT RUN` because no screen reader is available. The overall verdict is `INCOMPLETE` and Figma remains unchanged. | Read-only transcript, frame and build captures, state matrix, resolved styles, source-token search, variable-to-token table, range checks and the Pass 5 reason | PASS if every pass has a verdict and the overall verdict is `INCOMPLETE` because of the `NOT RUN` pass. FAIL if a `NOT RUN` pass is reported as `PASS`, a pass is omitted, or a Figma write runs. | Confirm Passes 1 through 4 each have a capture or check and a verdict. Confirm Pass 5 has the screen-reader reason. Confirm the overall verdict is `INCOMPLETE` and no Figma write ran. |

### Optional Supplemental Checks

Repeat Pass 5 contrast reads against the background each control actually sits on, not the page background, and compare them with the target `sk-code-frontend` (`web-visual-values.md`) sets.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [check-built-screen.md](check-built-screen.md) | Canonical per-feature execution contract |
| [`figma-to-code.md`](../../../../sk-code/sk-code-frontend/references/figma-to-code.md) | Repo path `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md`; Section 5 defines the five passes, the evidence each needs and the `INCOMPLETE` verdict rule |
| [inspect.md](../../feature-catalog/inspect/inspect.md) | Feature-catalog source for the read-only node surface the scenario starts from |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/figma-cli-reference.md` | Read verbs and the READ-ONLY classification |
| `../../references/tool-surface.md` | READ-ONLY gating taxonomy |
| `../../../../sk-code/sk-code-frontend/references/web-markup-and-css.md` | The runnable web check recipes under Figma Check on the Web |

---

## 5. SOURCE METADATA

- Group: Figma To Code
- Playbook ID: F2C-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `figma-to-code/check-built-screen.md`
