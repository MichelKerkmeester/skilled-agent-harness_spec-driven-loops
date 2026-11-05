---
title: "F2C-002 -- Off-token frame values are reported as drift"
description: "This scenario validates token drift reporting for `F2C-002`. It focuses on a frame value that matches no installed token and no scale step, and the agent reporting it instead of rounding it."
version: 1.0.1.0
---

# F2C-002 -- Off-token frame values are reported as drift

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `F2C-002`.

---

## 1. OVERVIEW

This scenario validates token drift reporting for `F2C-002`. It focuses on confirming that a frame value with no installed token and no scale step is reported as drift and handed to `sk-code-frontend` (`web-visual-values.md`), never rounded silently into code.

### Why This Matters

A design library can be newer than the token package an application installs, and frames also carry one-off values. The failure this guards against is an agent rounding `18px` to `16px`, pasting a value that resolves nowhere, or naming a token that exists only in a newer package. Drift is a finding to report, not a number to tidy up.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `F2C-002` and confirm the expected signals without contradictory evidence.

- Objective: confirm a frame value with no installed token and no scale step is reported as drift and handed to `sk-code-frontend` (`web-visual-values.md`).
- Real user request: `This frame uses 18px padding and a 44px gap, which match nothing in our tokens. Implement it in the app.`
- Prompt: `This frame uses 18px padding and a 44px gap, which match nothing in our tokens. Implement it in the app.`
- Expected execution process: read the node without changing it, record the authored frame width W, compare each value against the installed tokens first and the design scales second, report every unmatched value as drift with the nearest installed token and nearest scale step, then hand the decision to `sk-code-frontend` (`web-visual-values.md`) as the reference's workflow step requires.
- Expected signals: the `18px` padding and `44px` gap are both listed as drift with their nearest installed equivalent and nearest scale step. The reply names `sk-code-frontend` (`web-visual-values.md`) as the owner of the decision, and no rounded value appears in code. A pass that cannot run is marked `NOT RUN` with a reason and the Figma check verdict is `INCOMPLETE`.
- Desired user-visible outcome: the agent reports each drift value with its nearest installed equivalent and the five-pass evidence, and explains that the design decision is handed to `sk-code-frontend` (`web-visual-values.md`) rather than made in code.
- Pass/fail: PASS if every unmatched value is reported as drift, the nearest token and scale step are named, and the decision is handed to `sk-code-frontend` (`web-visual-values.md`). The verdict is `PASS` when all passes pass and `INCOMPLETE` when any pass is `NOT RUN` with a reason. FAIL if a value is rounded or written into code without being reported, or if `PASS` is reported despite a `NOT RUN` pass.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. A read-only Figma pull stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Requires INSPECT-001 PASS (or MCP-001 PASS for the Framelink path), Figma Desktop open with a design file, and an application repository checked out read-only. Run the shell steps from the application repository root. The scenario reads Figma and writes nothing to it.

1. `figma-ds-cli get` on the frame (read-only)  # -> raw values returned
2. `bash: rg -n '"design-tokens"' package.json`  # -> installed token package and version named
3. `bash: rg -n "^4  8  12  16  24  32  48" .skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md`  # -> spacing scale the value must belong to
4. agent compares each value with the installed tokens, then with the scales  # -> unmatched values listed as drift
5. agent hands each drift value to `sk-code-frontend` (`web-visual-values.md`) and records the five-pass evidence  # -> nearest token and scale step named, nothing rounded into code

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| F2C-002 | Off-token frame values are reported as drift | Confirm a frame value with no installed token and no scale step is reported as drift, not rounded into code | `This frame uses 18px padding and a 44px gap, which match nothing in our tokens. Implement it in the app.` | 1. Read the frame and record W -> 2. `bash: rg -n '"design-tokens"' package.json` -> 3. `bash: rg -n "^4  8  12  16  24  32  48" .skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md` -> 4. compare each value with tokens then the scales -> 5. hand each drift value to `sk-code-frontend` (`web-visual-values.md`) and record the five-pass evidence | W and the state matrix are recorded. Pass 3a records resolved values and Pass 3b records the source search. Pass 4 lists each Figma variable and its installed-token result. Pass 5 records range and access verdicts. The `18px` padding and `44px` gap are listed as drift with a nearest token and scale step. Any `NOT RUN` pass gives an `INCOMPLETE` verdict. | Read-only transcript, W and captures, state matrix, render and source checks, variable-to-token table, range and access results, and the drift list with nearest values | PASS if every unmatched value is reported as drift with a nearest token and scale step, and the decision is handed to `sk-code-frontend` (`web-visual-values.md`). The verdict is `PASS` when all passes pass and `INCOMPLETE` when any pass is `NOT RUN` with a reason. FAIL if a value is rounded or written into code without being reported, or if `PASS` is reported despite a `NOT RUN` pass. | Confirm the drift list names each frame value, its nearest installed token and its nearest scale step. Check that no rounded value appears in code. Require `INCOMPLETE` if any pass is `NOT RUN`. |

### Optional Supplemental Checks

Read the Project Profile Slot precedence in `SKILL.md` and confirm the reply followed installed tokens before the design scales, and the scales before any project profile.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [token-drift.md](token-drift.md) | Canonical per-feature execution contract |
| [`figma-to-code.md`](../../../../sk-code/sk-code-frontend/references/figma-to-code.md) | Repo path `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md`; a row with no token is a finding to report, and workflow step 4 hands an open value to `sk-code-frontend` (`web-visual-values.md`) |
| [`web-visual-values.md`](../../../../sk-code/sk-code-frontend/references/web-visual-values.md) | The design scales and the precedence order the drift decision is handed to |
| [inspect.md](../../feature-catalog/inspect/inspect.md) | Feature-catalog source for the read-only node surface the scenario starts from |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/figma-cli-reference.md` | Read verbs and the READ-ONLY classification |
| `../../references/tool-surface.md` | READ-ONLY gating taxonomy |

---

## 5. SOURCE METADATA

- Group: Figma To Code
- Playbook ID: F2C-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `figma-to-code/token-drift.md`
