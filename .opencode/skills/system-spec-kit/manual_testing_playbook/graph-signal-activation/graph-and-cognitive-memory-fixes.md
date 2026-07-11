---
title: "081 -- Graph and cognitive memory fixes"
description: "This scenario validates Graph and cognitive memory fixes for `081`. It focuses on Confirm graph/cognitive fix bundle."
audited_post_018: true
version: 3.6.0.16
---

# 081 -- Graph and cognitive memory fixes

## 1. OVERVIEW

This scenario validates Graph and cognitive memory fixes for `081`. It focuses on Confirm graph/cognitive fix bundle.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm graph/cognitive fix bundle.
- Real user request: `Please validate Graph and cognitive memory fixes against the documented validation surface and tell me whether the expected signals are present: Self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned.`
- Prompt: `Validate graph and cognitive memory fixes and cite self-loop prevention, depth clamps, mutation invalidation, and stale-data protection.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if self-loops are blocked, depth stays within clamped bounds, and cache invalidates correctly on mutation

---

## 3. TEST EXECUTION

### Prompt

```
Validate graph and cognitive memory fixes and cite self-loop prevention, depth clamps, mutation invalidation, and stale-data protection.
```

### Commands

1. trigger self-loop/depth/cache scenarios
2. verify clamps/invalidations
3. capture results

### Expected

Self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned

### Evidence

Self-loop attempt output + depth clamp evidence + cache invalidation trace

### Pass / Fail

- **Pass**: self-loops are blocked, depth stays within clamped bounds, and cache invalidates correctly on mutation
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect self-loop guard logic; verify depth clamp constants; check cache invalidation trigger points

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [graph-signal-activation/graph-and-cognitive-memory-fixes.md](../../feature_catalog/graph-signal-activation/graph-and-cognitive-memory-fixes.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 081
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `graph-signal-activation/graph-and-cognitive-memory-fixes.md`
