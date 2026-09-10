---
title: "CACHE-009 -- An explicit zero cached-read rate prices as free"
description: "This scenario validates that a cost block stating a zero cached-read rate is priced as free rather than rejected as unpriced for `CACHE-009`, and that missing or negative rates still report unpriced."
stage: routing
version: 1.0.0.0
---

# CACHE-009 -- An explicit zero cached-read rate prices as free

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-009`.

---

## 1. OVERVIEW

This scenario validates that an authoritative `cacheRead: 0` in a model's cost block is treated as a real rate meaning cached reads are free, while an absent or negative rate still reports unpriced.

### Why This Matters

Several providers genuinely do not charge for cached reads. Rejecting a zero rate as missing data made every one of those models report "unpriced", which removed the savings figure the extension exists to produce. The registry has no absent state to confuse it with: a model with no cost block arrives with a zero **input** rate too, and that is what marks it unpriced.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-009` and confirm the expected signals without contradictory evidence.

- Objective: confirm a zero cached-read rate prices, and that missing and negative rates do not.
- Real user request: `Cached reads are free on this model. Why does the report say unpriced?`
- Prompt: send a request on a model whose cost block states a positive input rate and a zero cached-read rate.
- Expected execution process: run one request, then read the economics lines for that model.
- Expected signals: `pricedRequests` increments, input cost is computed, and the savings line shows a real number against the uncached baseline.
- Desired user-visible outcome: a model with free cached reads reports its true saving instead of hiding behind "unpriced".
- Pass/fail: PASS if the zero rate prices and the savings figure appears; FAIL if it reports unpriced, or if a missing or negative rate is priced.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: a free cached read should still produce a cost and a saving.
2. Confirm the model's cost block has a positive input rate and a zero cached-read rate.
3. Run one request on that model.
4. Read the economics output and confirm the request was priced.
5. Repeat against a model with no cost block and confirm it still reports unpriced.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-009 | Zero cached-read rate prices | Verify an explicit zero rate is a price, not missing data | `Summarize this file.` | 1. confirm the cost block reads `input > 0` and `cacheRead: 0` -> 2. `bash: pi --approve -p "Summarize this file." --model <that model>` -> 3. `pi> /cache-optimizer stats` | Step 3: `pricedRequests` increments and the report shows an input cost and a savings figure rather than "unpriced" | The cost block, and the economics lines before and after | PASS if the request prices and savings appears; FAIL if it reports unpriced, or if a model with no cost block prices | 1. Confirm the input rate is positive -- a zero input rate is the signature of a model with no cost data and stays unpriced by design. 2. Confirm the rate is exactly zero and not negative, which is rejected. 3. Confirm the reading came from the model's own cost block rather than a registry fallback. |

### Optional Supplemental Checks

Confirm the savings line names its baseline as the same input tokens billed fully uncached, so the number stays checkable by hand.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | Model pricing lookup and the cost and baseline arithmetic |
| `../../tests/cache-economics.test.ts` | Regression anchor for the pricing predicate |

---

## 5. SOURCE METADATA

- Group: Cache Economics
- Playbook ID: CACHE-009
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `cache-economics/zero-cached-read-rate-prices.md`
