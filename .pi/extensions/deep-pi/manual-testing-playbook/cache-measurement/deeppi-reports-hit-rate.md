---
title: "DEEP-005 -- /deeppi reports the cache hit rate"
description: "This scenario validates the report for `DEEP-005`. It focuses on confirming that /deeppi notifies a report including the measured cache hit rate."
stage: routing
version: 1.0.0.0
---

# DEEP-005 -- /deeppi reports the cache hit rate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DEEP-005`.

---

## 1. OVERVIEW

This scenario validates the report for `DEEP-005`. It focuses on confirming that, after a response on a supported model with known token counts, `/deeppi` notifies a report that includes `Cache hit rate:` with the measured percentage.

### Why This Matters

The `/deeppi` report is the whole point of the extension. If it does not surface the measured hit rate, the operator has no visibility into cache economics.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEEP-005` and confirm the expected signals without contradictory evidence.

- Objective: confirm `/deeppi` reports a measured cache hit rate.
- Real user request: `Show me my DeepSeek cache hit rate for this session.`
- Prompt: `/deeppi`
- Expected execution process: on a supported model, complete one response with known cache-read and input tokens, then run `/deeppi`.
- Expected signals: the `/deeppi` notification includes a line beginning `Cache hit rate:` with the measured percentage, for example `Cache hit rate:     80.0%` for an 80% cache-read response.
- Desired user-visible outcome: the operator sees concrete cache economics.
- Pass/fail: PASS if the report includes the measured `Cache hit rate:` line; FAIL if the line is missing or the percentage is wrong.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: report the cache hit rate.
2. Complete one response on a supported model with known token counts.
3. Run `/deeppi`.
4. Confirm the report includes the measured hit rate.
5. Record the report notification.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DEEP-005 | /deeppi reports the cache hit rate | Verify `/deeppi` reports the hit rate | `/deeppi` | 1. `bash: pi --model deepseek/deepseek-v4-pro` -> 2. complete a response with 80,000 cache-read of 100,000 input tokens -> 3. `pi> /deeppi` | Step 3: the notification includes `Cache hit rate:     80.0%` | The `/deeppi` report notification text | PASS if the report includes the measured `Cache hit rate:` line; FAIL if the line is missing or the percentage is wrong | 1. Confirm the model is a supported DeepSeek model (DEEP-001, DEEP-002). 2. Confirm at least one response completed so there is data to report. 3. Confirm the token counts match the expected percentage. |

### Optional Supplemental Checks

Run `/deeppi` before any response and confirm it reports a warming or zero state without crashing.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../extensions/deeppi.ts` | `/deeppi` command and report rendering |
| `../../tests/deeppi.integration.test.ts` | Regression anchor for the reported hit rate |
| `../../tests/report.test.ts` | Regression anchor for report rendering |

---

## 5. SOURCE METADATA

- Group: Cache Measurement
- Playbook ID: DEEP-005
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `cache-measurement/deeppi-reports-hit-rate.md`
