---
title: "CACHE-007 -- Env opt-out disables injection"
description: "This scenario validates the environment opt-out for `CACHE-007`. It focuses on confirming that PI_CACHE_OPTIMIZER_NO_OPENAI_CACHE_KEY=1 suppresses the prompt_cache_key injection."
stage: routing
version: 1.0.0.0
---

# CACHE-007 -- Env opt-out disables injection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-007`.

---

## 1. OVERVIEW

This scenario validates the environment opt-out for `CACHE-007`. It focuses on confirming that setting `PI_CACHE_OPTIMIZER_NO_OPENAI_CACHE_KEY=1` makes the request hook inject no `prompt_cache_key`, even on an openai-compatible model.

### Why This Matters

Some operators or downstream proxies do not want the extension mutating the payload. The explicit opt-out must fully suppress the injection so the operator keeps control.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-007` and confirm the expected signals without contradictory evidence.

- Objective: confirm the env opt-out suppresses the cache-key injection.
- Real user request: `Do not add a cache key to my requests.`
- Prompt: `env: PI_CACHE_OPTIMIZER_NO_OPENAI_CACHE_KEY=1`
- Expected execution process: set the variable, start Pi, run a request on an openai-compatible model, and inspect the outgoing payload.
- Expected signals: the request hook returns no payload change, so no `prompt_cache_key` is injected.
- Desired user-visible outcome: an operator who opts out gets no payload mutation.
- Pass/fail: PASS if no `prompt_cache_key` is injected while the variable is set; FAIL if a key is still injected.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: suppress the cache-key injection.
2. Set the opt-out variable before starting Pi.
3. Run a request on an openai-compatible model and inspect the outgoing payload.
4. Confirm no `prompt_cache_key` was injected.
5. Record the variable and the payload.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-007 | Env opt-out disables injection | Verify the env opt-out suppresses injection | `env: PI_CACHE_OPTIMIZER_NO_OPENAI_CACHE_KEY=1` | 1. `env: PI_CACHE_OPTIMIZER_NO_OPENAI_CACHE_KEY=1` -> 2. `bash: pi --model openai/gpt-4o` -> 3. `pi> Summarize this file.` -> 4. inspect the outgoing payload | Step 4: the payload carries no injected `prompt_cache_key` | The variable value and the outgoing payload | PASS if no `prompt_cache_key` is injected while the variable is set; FAIL if a key is still injected | 1. Confirm the variable was exported before Pi started. 2. Run the same request without the variable (CACHE-005) and confirm a key is then injected, proving the difference is the opt-out. 3. Confirm the model is openai-compatible so the hook would otherwise inject. |

### Optional Supplemental Checks

Set the legacy inverse form `PI_CACHE_OPTIMIZER_OPENAI_CACHE_KEY=0` and confirm the same suppression.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | `shouldInjectOpenAIPromptCacheKey` env gate in the request hook |
| `../../tests/review-findings.test.ts` | Regression anchor for the opt-out gate |

---

## 5. SOURCE METADATA

- Group: Opt Out
- Playbook ID: CACHE-007
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `opt-out/env-opt-out-disables-injection.md`
