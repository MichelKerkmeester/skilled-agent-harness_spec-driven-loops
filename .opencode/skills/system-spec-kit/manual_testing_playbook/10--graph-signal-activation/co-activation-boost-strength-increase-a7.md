---
title: "017 -- Co-activation boost strength increase (A7)"
description: "This scenario validates Co-activation boost strength increase (A7) for `017`. It focuses on Confirm multiplier impact."
audited_post_018: true
---

# 017 -- Co-activation boost strength increase (A7)

## 1. OVERVIEW

This scenario validates Co-activation boost strength increase (A7) for `017`. It focuses on Confirm multiplier impact.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm multiplier impact and batched lookup behavior.
- Real user request: `` Please validate Co-activation boost strength increase (A7) against the documented validation surface and tell me whether the expected signals are present: Increased co-activation strength produces measurably higher contribution delta vs baseline; related-memory hydration uses one batched `WHERE id IN (...)` fetch; causal-neighbor lookup uses one CTE + join query; Stage 2 calls the neighbor-count precompute once per boosted batch. ``
- Prompt: `Validate co-activation boost strength and cite contribution delta, batched hydration, causal-neighbor query shape, and one precompute per batch.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Increased co-activation strength produces measurably higher contribution delta vs baseline; related-memory hydration uses one batched `WHERE id IN (...)` fetch; causal-neighbor lookup uses one CTE + join query; Stage 2 calls the neighbor-count precompute once per boosted batch
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Contribution delta >0 when strength increased and the batched lookup path eliminates per-row N+1 calls; FAIL: No measurable difference, inverse effect, or per-row lookup behavior persists

---

## 3. TEST EXECUTION

### Prompt

```
Validate co-activation boost strength and cite contribution delta, batched hydration, causal-neighbor query shape, and one precompute per batch.
```

### Commands

1. Baseline run
2. Increase strength
3. Compare contribution
4. Capture batching evidence for similarity-neighbor, causal-neighbor, and Stage 2 count lookup paths

### Expected

Increased co-activation strength produces measurably higher contribution delta vs baseline; related-memory hydration uses one batched `WHERE id IN (...)` fetch; causal-neighbor lookup uses one CTE + join query; Stage 2 calls the neighbor-count precompute once per boosted batch

### Evidence

Baseline vs increased strength output comparison + contribution delta calculation + test/instrumentation evidence for batched `WHERE id IN (...)`, joined causal lookup, and one-shot `getRelatedMemoryCounts()` usage

### Pass / Fail

- **Pass**: Contribution delta >0 when strength increased and the batched lookup path eliminates per-row N+1 calls
- **Fail**: No measurable difference, inverse effect, or per-row lookup behavior persists

### Failure Triage

Verify strength parameter propagation → Check co-activation hydration query shapes → Inspect Stage 2 batching/precompute path

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/co-activation-boost-strength-increase.md](../../feature_catalog/10--graph-signal-activation/co-activation-boost-strength-increase.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--graph-signal-activation/co-activation-boost-strength-increase-a7.md`
