---
title: "028 -- Embedding cache (R18)"
description: "This scenario validates Embedding cache (R18) for `028`. It focuses on Confirm cache hit/miss behavior."
audited_post_018: true
version: 3.6.0.16
id: scoring-and-calibration-embedding-cache-r18
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 028 -- Embedding cache (R18)

## 1. OVERVIEW

This scenario validates Embedding cache (R18) for `028`. It focuses on Confirm cache hit/miss behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm cache hit/miss behavior.
- Real user request: `Please validate Embedding cache (R18) against the documented validation surface and tell me whether the expected signals are present: Cache hit returns instantly without embedding API call; cache miss triggers embedding; metadata timestamps updated on hit.`
- Prompt: `Validate embedding cache hits, misses, and hit timestamp updates.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Cache hit returns instantly without embedding API call; cache miss triggers embedding; metadata timestamps updated on hit
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Cache hit skips embedding call with <10ms latency; miss triggers embedding; hit updates lastAccessed timestamp; FAIL: Cache hit still calls embedding API or timestamps not updated

---

## 3. TEST EXECUTION

### Prompt

```
Validate embedding cache hits, misses, and hit timestamp updates.
```

### Commands

1. Embed content/model pair
2. Repeat
3. Confirm hit and metadata update

### Expected

Cache hit returns instantly without embedding API call; cache miss triggers embedding; metadata timestamps updated on hit

### Evidence

Cache hit/miss output + timing comparison + metadata timestamp verification

### Pass / Fail

- **Pass**: Cache hit skips embedding call with <10ms latency; miss triggers embedding; hit updates lastAccessed timestamp
- **Fail**: Cache hit still calls embedding API or timestamps not updated

### Failure Triage

Verify cache key computation (content+model) → Check cache storage backend → Inspect TTL/eviction policy

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [scoring-and-calibration/embedding-cache.md](../../feature-catalog/scoring-and-calibration/embedding-cache.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 028
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `scoring-and-calibration/embedding-cache-r18.md`
