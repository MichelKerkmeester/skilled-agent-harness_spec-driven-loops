---
title: "CACHE-010 -- A model can declare that it never reports cache usage"
description: "This scenario validates that a model declaring `reportsCacheUsage: false` routes its requests to unmeasured rather than to a miss for `CACHE-010`, and that an unset flag changes nothing."
stage: routing
version: 1.0.0.0
---

# CACHE-010 -- A model can declare that it never reports cache usage

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-010`.

---

## 1. OVERVIEW

This scenario validates the `reportsCacheUsage` compat flag: `false` routes every request for that model to unmeasured, an unset flag leaves behavior exactly as it was, and `true` still lets response contents decide.

### Why This Matters

Per-response detection cannot help where the host normalizes cache fields to zero before the extension sees them. Without a way to declare that a model never reports, such a model produces a stream of requests scored as misses. The flag states it once instead.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-010` and confirm the expected signals without contradictory evidence.

- Objective: confirm the declaration routes requests to unmeasured while tokens and cost still record.
- Real user request: `This model never reports cache usage. Stop counting it against my hit rate.`
- Prompt: send a normal request on a model whose compat block declares `reportsCacheUsage: false`.
- Expected execution process: record the request, then read the counters for that model.
- Expected signals: `unmeasuredRequests` increments; tokens and cost still increment; `hitRequests` does not.
- Desired user-visible outcome: a model that cannot report is set aside instead of dragging the hit rate down.
- Pass/fail: PASS if the declaring model lands in unmeasured and an unset flag is unchanged; FAIL if the declaration is ignored, or if it forces a hit.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: a non-reporting model should not be counted as missing.
2. Add `reportsCacheUsage: false` to that model's compat block.
3. Run one request and read the counters.
4. Remove the flag, run again, and confirm the earlier behavior returns.
5. Repeat step 3 through a virtual routing provider, where the stats model may carry no compat of its own.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-010 | Model declares no cache reporting | Verify the declaration routes to unmeasured and is honored through routing | `Summarize this file.` | 1. set `compat.reportsCacheUsage: false` for the model -> 2. `bash: pi --approve -p "Summarize this file." --model <that model>` -> 3. read the counters -> 4. remove the flag and repeat | Step 3: `unmeasuredRequests` +1 with tokens and cost recorded; step 4: the counters behave as before the flag | The compat block and the counters for both runs | PASS if the declaration routes to unmeasured and its removal restores prior behavior; FAIL if ignored, or if it forces a hit | 1. Confirm the flag is on the model the stats path actually reads -- on a virtual routing provider the stats model can arrive without compat, and the active model is the fallback. 2. Confirm the value is boolean `false`, not a string. 3. Confirm the model would otherwise have reported, so the change is attributable to the flag. |

### Optional Supplemental Checks

Confirm `reportsCacheUsage: true` does not manufacture a hit: presence in the response still decides.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | The compat flag, its resolution through routing, and the recording path |
| `../../tests/cache-economics.test.ts` | Regression anchor including the routing fallback case |

---

## 5. SOURCE METADATA

- Group: Capability Declaration
- Playbook ID: CACHE-010
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `capability-declaration/model-declares-no-cache-reporting.md`
