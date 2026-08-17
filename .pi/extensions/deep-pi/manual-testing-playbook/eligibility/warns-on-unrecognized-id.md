---
title: "DEEP-004 -- Warns on an unrecognized DeepSeek id"
description: "This scenario validates the unrecognized-id warning for `DEEP-004`. It focuses on confirming that an unknown DeepSeek id warns once and stays dormant."
stage: routing
version: 1.0.0.0
---

# DEEP-004 -- Warns on an unrecognized DeepSeek id

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DEEP-004`.

---

## 1. OVERVIEW

This scenario validates the unrecognized-id warning for `DEEP-004`. It focuses on confirming that selecting a `deepseek` model whose id DeepPi does not recognize, such as `deepseek-v5-test`, produces a one-time warning and leaves DeepPi dormant.

### Why This Matters

When DeepSeek ships a new model id, DeepPi should tell the operator it may need updating rather than silently mis-measuring an unknown model.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEEP-004` and confirm the expected signals without contradictory evidence.

- Objective: confirm an unrecognized DeepSeek id warns and stays dormant.
- Real user request: `I selected a new DeepSeek model DeepPi has not seen.`
- Prompt: select a `deepseek` model with an unrecognized id.
- Expected execution process: launch Pi on the unrecognized model and read the notification.
- Expected signals: a warning notification naming the unrecognized model, and DeepPi does not activate.
- Desired user-visible outcome: the operator is told a new DeepSeek release may need a DeepPi update.
- Pass/fail: PASS if the warning names the model and DeepPi stays dormant; FAIL if no warning appears or DeepPi activates.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: use an unrecognized DeepSeek id.
2. Launch Pi on the unrecognized model.
3. Read the warning notification.
4. Confirm DeepPi stays dormant.
5. Record the warning text.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DEEP-004 | Warns on an unrecognized DeepSeek id | Verify the unrecognized-id warning | `select deepseek/deepseek-v5-test` | 1. `bash: pi --model deepseek/deepseek-v5-test` -> 2. read the notification | Step 2: a warning stating `deep-pi doesn't recognize model "deepseek-v5-test" - it may need updating for new DeepSeek releases.` and no activation | The warning text and the tool set | PASS if the warning names the model and DeepPi stays dormant; FAIL if no warning appears or DeepPi activates | 1. Confirm the provider is `deepseek` and the id is not a supported one. 2. Confirm the warning fires once per session, not repeatedly. 3. Compare against DEEP-001, where a recognized id activates. |

### Optional Supplemental Checks

Reselect the same unrecognized id in the session and confirm the warning does not repeat.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../extensions/deeppi/eligibility.ts` | Unrecognized-id detection |
| `../../extensions/deeppi.ts` | Session-start warning notification |
| `../../tests/deeppi.integration.test.ts` | Regression anchor for the one-time warning |

---

## 5. SOURCE METADATA

- Group: Eligibility
- Playbook ID: DEEP-004
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `eligibility/warns-on-unrecognized-id.md`
