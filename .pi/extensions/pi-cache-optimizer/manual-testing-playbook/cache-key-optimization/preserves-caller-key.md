---
title: "CACHE-006 -- Preserves a caller-supplied key"
description: "This scenario validates key preservation for `CACHE-006`. It focuses on confirming that a payload that already sets prompt_cache_key is left unchanged."
stage: routing
version: 1.0.0.0
---

# CACHE-006 -- Preserves a caller-supplied key

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-006`.

---

## 1. OVERVIEW

This scenario validates key preservation for `CACHE-006`. It focuses on confirming that when a request payload already sets an effective `prompt_cache_key`, the extension leaves it unchanged rather than overwriting it with the session fallback.

### Why This Matters

A router or caller may set its own cache key on purpose. Overwriting it would break the caller's cache strategy, so the fallback must yield to an explicit key.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-006` and confirm the expected signals without contradictory evidence.

- Objective: confirm an existing `prompt_cache_key` is preserved.
- Real user request: `My router already sets a cache key; do not override it.`
- Prompt: send a request whose payload already sets `prompt_cache_key`.
- Expected execution process: run the request hook against a payload that already carries a `prompt_cache_key` and inspect the result.
- Expected signals: the `prompt_cache_key` value is unchanged after the hook.
- Desired user-visible outcome: an explicit caller key wins over the fallback.
- Pass/fail: PASS if the caller's key is unchanged; FAIL if it is overwritten or removed.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: preserve an existing cache key.
2. Arrange a payload that already sets `prompt_cache_key`.
3. Run the request hook and inspect the result.
4. Confirm the key is unchanged.
5. Record the before and after key.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-006 | Preserves a caller-supplied key | Verify an existing cache key is preserved | `Continue the task.` | 1. arrange a payload with `prompt_cache_key: "caller-key"` -> 2. run the request hook -> 3. inspect the result | Step 3: the payload still reads `prompt_cache_key: "caller-key"`, unchanged | The payload key before and after the hook | PASS if the caller key is unchanged; FAIL if it is overwritten or removed | 1. Confirm the caller key was non-empty. 2. Confirm the model is openai-compatible so the hook is active. 3. Compare against CACHE-005, where an absent key is injected. |

### Optional Supplemental Checks

Set an empty-string `prompt_cache_key` and confirm the extension treats it as absent and injects the fallback.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | `hasEffectivePromptCacheKey` guard in the request hook |
| `../../tests/review-findings.test.ts` | Regression anchor for caller-key preservation |

---

## 5. SOURCE METADATA

- Group: Cache Key Optimization
- Playbook ID: CACHE-006
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `cache-key-optimization/preserves-caller-key.md`
