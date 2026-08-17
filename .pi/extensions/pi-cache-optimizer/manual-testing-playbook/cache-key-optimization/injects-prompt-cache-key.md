---
title: "CACHE-005 -- Injects prompt_cache_key"
description: "This scenario validates the core cache-key injection for `CACHE-005`. It focuses on confirming that the request hook adds a non-empty prompt_cache_key to an openai-compatible payload that has none."
stage: routing
version: 1.0.0.0
---

# CACHE-005 -- Injects prompt_cache_key

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-005`.

---

## 1. OVERVIEW

This scenario validates the core cache-key injection for `CACHE-005`. It focuses on confirming that the `before_provider_request` hook injects a non-empty `prompt_cache_key` into an openai-compatible request payload that does not already have an effective key.

### Why This Matters

The `prompt_cache_key` fallback is what makes provider prompt caching effective on openai-compatible channels that would otherwise miss. If it is not injected, the whole extension delivers no caching benefit.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-005` and confirm the expected signals without contradictory evidence.

- Objective: confirm the hook injects a `prompt_cache_key` on an openai-compatible payload.
- Real user request: `Make sure my requests carry a stable cache key so caching works.`
- Prompt: send any normal request on an openai-compatible model.
- Expected execution process: on an openai-compatible model, let the request hook run and inspect the outgoing payload.
- Expected signals: the outgoing provider payload gains a non-empty `prompt_cache_key` derived from the session.
- Desired user-visible outcome: requests carry a stable cache key so the provider can serve cache hits.
- Pass/fail: PASS if the payload gains a non-empty `prompt_cache_key`; FAIL if the key is absent or empty.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: requests should carry a cache key.
2. Select an openai-compatible model.
3. Run a request and inspect the outgoing payload through a logging proxy or the deterministic harness.
4. Confirm the `prompt_cache_key` is present and non-empty.
5. Record the before and after payload.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-005 | Injects prompt_cache_key | Verify the hook injects a cache key | `Summarize this file.` | 1. `bash: pi --model openai/gpt-4o` -> 2. `pi> Summarize this file.` -> 3. inspect the outgoing payload | Step 3: the outgoing payload gains a non-empty `prompt_cache_key` that was absent before | The payload before and after the request hook | PASS if the payload gains a non-empty `prompt_cache_key`; FAIL if it is absent or empty | 1. Confirm the model is openai-compatible (`/cache-optimizer doctor` shows the API). 2. Confirm no opt-out env var is set (CACHE-007). 3. Confirm the model is not in the unsupported set the extension detected from prior 400s. |

### Optional Supplemental Checks

Confirm the injected key is stable across two requests in the same session, so the provider sees the same prefix key.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | `before_provider_request` hook and `addOpenAIPromptCacheKey` |
| `../../tests/review-findings.test.ts` | Regression anchor for cache-key injection |

---

## 5. SOURCE METADATA

- Group: Cache Key Optimization
- Playbook ID: CACHE-005
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `cache-key-optimization/injects-prompt-cache-key.md`
