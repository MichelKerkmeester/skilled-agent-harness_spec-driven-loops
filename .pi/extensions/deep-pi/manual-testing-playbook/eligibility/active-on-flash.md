---
title: "DEEP-001 -- Active on deepseek-v4-flash"
description: "This scenario validates activation for `DEEP-001`. It focuses on confirming that selecting deepseek-v4-flash activates DeepPi's tool and footer."
stage: routing
version: 1.0.0.0
---

# DEEP-001 -- Active on deepseek-v4-flash

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DEEP-001`.

---

## 1. OVERVIEW

This scenario validates activation for `DEEP-001`. It focuses on confirming that selecting the `deepseek/deepseek-v4-flash` model activates the `edit_lines` tool and sets the `deeppi` status footer to `DeepPi · warming`.

### Why This Matters

Flash is one of the two supported models. If DeepPi does not activate on it, the operator gets no cache measurement where it is meant to work.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEEP-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm DeepPi activates on deepseek-v4-flash.
- Real user request: `I'm on DeepSeek Flash; start measuring my cache economics.`
- Prompt: select the `deepseek/deepseek-v4-flash` model.
- Expected execution process: launch Pi on the model and observe the tool set and footer at session start.
- Expected signals: the `edit_lines` tool is active and the `deeppi` footer reads `DeepPi · warming`.
- Desired user-visible outcome: DeepPi is clearly active on a supported model.
- Pass/fail: PASS if `edit_lines` is active and the footer reads `DeepPi · warming`; FAIL if the tool is absent or the footer is unset.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: activate DeepPi on Flash.
2. Launch Pi on the supported model.
3. Observe the tool set and footer at session start.
4. Compare against the desired outcome.
5. Record the footer value and the tool set.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DEEP-001 | Active on deepseek-v4-flash | Verify DeepPi activates on Flash | `select deepseek/deepseek-v4-flash` | 1. `bash: pi --model deepseek/deepseek-v4-flash` -> 2. observe the tool set and footer | Step 2: `edit_lines` is active and the `deeppi` footer reads `DeepPi · warming` | The footer value and the active tool set | PASS if `edit_lines` is active and the footer reads `DeepPi · warming`; FAIL if the tool is absent or the footer is unset | 1. Confirm the model is exactly `deepseek/deepseek-v4-flash`. 2. Confirm the extension is loaded (`pi list`). 3. Compare against DEEP-003, where a proxy route stays dormant. |

### Optional Supplemental Checks

Switch to a non-DeepSeek model and confirm the footer clears, proving activation is model-driven.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../extensions/deeppi/eligibility.ts` | `isDeepPiModel` acceptance rule |
| `../../extensions/deeppi.ts` | Session-start activation of the tool and footer |
| `../../tests/deeppi.integration.test.ts` | Regression anchor for activation |

---

## 5. SOURCE METADATA

- Group: Eligibility
- Playbook ID: DEEP-001
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `eligibility/active-on-flash.md`
