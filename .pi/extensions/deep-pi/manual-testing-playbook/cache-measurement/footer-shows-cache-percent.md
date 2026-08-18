---
title: "DEEP-006 -- Footer shows the measured cache percent"
description: "This scenario validates the footer for `DEEP-006`. It focuses on confirming that the deeppi footer updates from warming to a measured cache percent after a response."
stage: routing
version: 1.0.0.0
---

# DEEP-006 -- Footer shows the measured cache percent

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DEEP-006`.

---

## 1. OVERVIEW

This scenario validates the footer for `DEEP-006`. It focuses on confirming that the `deeppi` status footer updates from `DeepPi · warming` to a measured cache percent, for example `DeepPi · 80% cache`, after a response with 80% cache-read tokens.

### Why This Matters

The footer is the at-a-glance signal of cache health. It must reflect the live hit rate so an operator can watch caching improve without opening the full report.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEEP-006` and confirm the expected signals without contradictory evidence.

- Objective: confirm the footer shows the measured cache percent after a response.
- Real user request: `Let me watch my cache hit rate in the footer.`
- Prompt: send a request and observe the footer.
- Expected execution process: on a supported model, complete a response with 80% cache-read tokens and read the footer.
- Expected signals: the `deeppi` footer changes from `DeepPi · warming` to `DeepPi · 80% cache`.
- Desired user-visible outcome: the footer reflects the live cache hit rate.
- Pass/fail: PASS if the footer updates to the measured cache percent; FAIL if it stays warming or shows a wrong percent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: watch the footer.
2. Complete one response on a supported model with known token counts.
3. Read the footer before and after the response.
4. Confirm the footer reflects the measured percent.
5. Record the footer value.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DEEP-006 | Footer shows the measured cache percent | Verify the footer shows the cache percent | `Summarize this file.` | 1. `bash: pi --model deepseek/deepseek-v4-pro` -> 2. read the footer (warming) -> 3. complete a response with 80,000 cache-read of 100,000 input tokens -> 4. read the footer | Step 2: footer reads `DeepPi · warming`; Step 4: footer reads `DeepPi · 80% cache` | The footer value before and after the response | PASS if the footer updates to the measured cache percent; FAIL if it stays warming or shows a wrong percent | 1. Confirm the model is a supported DeepSeek model. 2. Confirm a response completed so the footer has data. 3. Confirm the token counts match the expected percentage. |

### Optional Supplemental Checks

Complete a second response with a different cache-read ratio and confirm the footer percent updates accordingly.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../extensions/deeppi.ts` | `message_end` footer update |
| `../../tests/deeppi.integration.test.ts` | Regression anchor for the footer percent |

---

## 5. SOURCE METADATA

- Group: Cache Measurement
- Playbook ID: DEEP-006
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `cache-measurement/footer-shows-cache-percent.md`
