---
title: "DEEP-002 -- Active on deepseek-v4-pro"
description: "This scenario validates activation for `DEEP-002`. It focuses on confirming that selecting deepseek-v4-pro activates DeepPi's tool and footer."
stage: routing
version: 1.0.0.0
---

# DEEP-002 -- Active on deepseek-v4-pro

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DEEP-002`.

---

## 1. OVERVIEW

This scenario validates activation for `DEEP-002`. It focuses on confirming that selecting the `deepseek/deepseek-v4-pro` model activates the `edit_lines` tool and sets the `deeppi` status footer to `DeepPi · warming`.

### Why This Matters

Pro is the second supported model. Activation must behave the same as on Flash so the operator gets consistent measurement across both.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEEP-002` and confirm the expected signals without contradictory evidence.

- Objective: confirm DeepPi activates on deepseek-v4-pro.
- Real user request: `Switch me to DeepSeek Pro and track the cache.`
- Prompt: select the `deepseek/deepseek-v4-pro` model.
- Expected execution process: launch Pi on the model and observe the tool set and footer at session start.
- Expected signals: the `edit_lines` tool is active and the `deeppi` footer reads `DeepPi · warming`.
- Desired user-visible outcome: DeepPi is clearly active on the second supported model.
- Pass/fail: PASS if `edit_lines` is active and the footer reads `DeepPi · warming`; FAIL if the tool is absent or the footer is unset.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: activate DeepPi on Pro.
2. Launch Pi on the supported model.
3. Observe the tool set and footer at session start.
4. Compare against the desired outcome.
5. Record the footer value and the tool set.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DEEP-002 | Active on deepseek-v4-pro | Verify DeepPi activates on Pro | `select deepseek/deepseek-v4-pro` | 1. `bash: pi --model deepseek/deepseek-v4-pro` -> 2. observe the tool set and footer | Step 2: `edit_lines` is active and the `deeppi` footer reads `DeepPi · warming` | The footer value and the active tool set | PASS if `edit_lines` is active and the footer reads `DeepPi · warming`; FAIL if the tool is absent or the footer is unset | 1. Confirm the model is exactly `deepseek/deepseek-v4-pro`. 2. Confirm the extension is loaded. 3. Compare against DEEP-001 to confirm both supported models behave the same. |

### Optional Supplemental Checks

Compare the footer to DEEP-001 to confirm Flash and Pro activate identically.

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
- Playbook ID: DEEP-002
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `eligibility/active-on-pro.md`
