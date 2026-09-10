---
title: "CACHE-008 -- An unreported cache signal is not a miss"
description: "This scenario validates that a response carrying no cache fields is counted as unmeasured and excluded from the hit ratio for `CACHE-008`, while its tokens and cost still record in full."
stage: routing
version: 1.0.0.0
---

# CACHE-008 -- An unreported cache signal is not a miss

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-008`.

---

## 1. OVERVIEW

This scenario validates that a response reporting no cache fields at all is classified as **unmeasured** rather than scored as a cache miss, and that its tokens and cost are still recorded.

### Why This Matters

A response with no cache signal cannot be called a hit or a miss. Scoring it as a miss makes the hit rate read lower than reality with no way to tell measurement failure from genuine misses. The opposite error is worse: dropping the request entirely would remove real spend from the cost and savings lines, understating what caching is worth.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-008` and confirm the expected signals without contradictory evidence.

- Objective: confirm an unreported cache signal lands in `unmeasuredRequests`, not in the hit ratio.
- Real user request: `My hit rate looks wrong. Is it actually missing, or is the provider just not telling us?`
- Prompt: send a normal request on a model or proxy that omits cache fields from its usage block.
- Expected execution process: record the request, then read the persisted counters for that model.
- Expected signals: `unmeasuredRequests` increments; `totalInputTokens` and the cost fields increment; `hitRequests` and the measured denominator do not move.
- Desired user-visible outcome: the report distinguishes "we could not measure this" from "this missed cache".
- Pass/fail: PASS if tokens and cost record while the ratio excludes the sample; FAIL if the request is scored as a miss, or if its tokens or cost are dropped.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: distinguish an unmeasurable request from a real miss.
2. Note the current counters for the target model.
3. Send one request on a channel that omits cache fields.
4. Re-read the counters and compare each field against the expectation below.
5. Send one request with an explicit zero cache field and confirm it is treated differently.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-008 | Unreported signal is not a miss | Verify an absent cache signal is excluded from the ratio but not from cost | `Summarize this file.` | 1. read `pi-cache-optimizer-stats.json` for the model -> 2. `bash: pi --approve -p "Summarize this file." --model <channel omitting cache fields>` -> 3. re-read the same counters | Step 3: `unmeasuredRequests` +1, `totalInputTokens` and cost +delta, `hitRequests` unchanged | The counter block before and after, field by field | PASS if cost and tokens record while `hitRequests` and the measured denominator stay put; FAIL if scored as a miss or if cost was dropped | 1. Confirm the channel really omits the fields rather than sending zeros -- an explicit zero is a measured miss by design. 2. Confirm the model does not declare `reportsCacheUsage` (CACHE-010), which routes to the same counter for a different reason. 3. Check the raw adapter path, since Pi normalizes most channels to present-with-zero. |

### Optional Supplemental Checks

Confirm `totalRequests` still counts the request, so the measured denominator is `totalRequests` minus `unmeasuredRequests` rather than a separate tally.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | Usage classification, `unmeasuredRequests`, and the stats recording path |
| `../../tests/cache-economics.test.ts` | Regression anchor for classification and counter behavior |

---

## 5. SOURCE METADATA

- Group: Cache Economics
- Playbook ID: CACHE-008
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `cache-economics/unreported-signal-is-not-a-miss.md`
