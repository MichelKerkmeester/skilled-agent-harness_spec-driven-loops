---
title: "204 -- Embedding retry orchestrator"
description: "This scenario validates Embedding retry orchestrator for `204`. It focuses on verifying lexical-only fallback, pending retry state, cache-aware background retries, and successful vector refresh after provider recovery."
audited_post_018: true
version: 3.6.0.13
---

# 204 -- Embedding retry orchestrator

## 1. OVERVIEW

This scenario validates Embedding retry orchestrator for `204`. It focuses on verifying lexical-only fallback, pending retry state, cache-aware background retries, and successful vector refresh after provider recovery.

---

## 2. SCENARIO CONTRACT


- Objective: Verify failed embeddings fall back to pending lexical-only storage and are later repaired by the background retry manager with retry/backoff tracking.
- Real user request: `Please validate Embedding retry orchestrator against memory_save and tell me whether the expected signals are present: Provider outage yields saved memory with pending embedding status and lexical-only fallback; retry manager scans and processes pending items; embedding cache participates in deduplication; retry count/progressive backoff state changes across failures; successful retry updates memory index and vector storage.`
- Prompt: `Validate the embedding retry orchestrator against memory_save and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Provider outage yields saved memory with pending embedding status and lexical-only fallback; retry manager scans and processes pending items; embedding cache participates in deduplication; retry count/progressive backoff state changes across failures; successful retry updates memory index and vector storage
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if pending memories remain searchable lexically during outage and are later upgraded with vectors by retry orchestration; FAIL if failed embeddings are dropped, pending items are never retried, or success does not refresh index/vector state

---

## 3. TEST EXECUTION

### Prompt

```
Validate the embedding retry orchestrator against memory_save and return pass/fail with cited evidence.
```

### Commands

1. Simulate embedding-provider unavailability during `memory_save` or `memory_index_scan`
2. Confirm the spec-doc record is still saved and marked pending without vectors, with lexical-only fallback intact
3. Restore provider availability and run or wait for the retry manager batch job
4. Confirm pending items are retried, retry counters/backoff metadata update appropriately, and cache reuse is visible when content was embedded before
5. Verify successful retry clears the pending state and refreshes vector/index rows for the affected memory

### Expected

Provider outage yields saved memory with pending embedding status and lexical-only fallback; retry manager scans and processes pending items; embedding cache participates in deduplication; retry count/progressive backoff state changes across failures; successful retry updates memory index and vector storage

### Evidence

Save/index transcript during outage + pending status evidence + retry-manager run output + cache/retry stats + final vector/index state after recovery

### Pass / Fail

- **Pass**: pending memories remain searchable lexically during outage and are later upgraded with vectors by retry orchestration
- **Fail**: failed embeddings are dropped, pending items are never retried, or success does not refresh index/vector state

### Failure Triage

Inspect retry-manager batch selection and backoff logic; verify embedding cache reuse; check pending-status persistence during fallback; confirm retry success path clears stale vector rows and writes refreshed embeddings

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline-architecture/embedding-retry-orchestrator.md](../../feature_catalog/pipeline-architecture/embedding-retry-orchestrator.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 204
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline-architecture/embedding-retry-orchestrator.md`
