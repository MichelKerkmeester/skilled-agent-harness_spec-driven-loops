---
title: "RATELIMIT-001 -- 429 backoff and Retry-After"
description: "429 responses trigger Retry-After-aware backoff; failed non-idempotent writes are not blindly replayed."
stage: safety
version: 1.0.0.0
---

# RATELIMIT-001 -- 429 backoff and Retry-After

## 1. OVERVIEW

This scenario validates 429 backoff and Retry-After for `RATELIMIT-001`. It focuses on 429 responses trigger Retry-After-aware backoff; failed non-idempotent writes are not blindly replayed..

### Why This Matters

429 responses trigger Retry-After-aware backoff; failed non-idempotent writes are not blindly replayed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RATELIMIT-001` and confirm the expected signals without contradictory evidence.

- Objective: 429 responses trigger Retry-After-aware backoff; failed non-idempotent writes are not blindly replayed.
- Real user request: `Keep reading the CMS items until the rate limit kicks in.`
- Prompt: `Execute a read until a 429 occurs (real server response - no mocks).`
- Expected execution process: Trigger a real 429, honor Retry-After, do not replay ambiguous writes.
- Expected signals: 429 observed with Retry-After (~60s) and X-RateLimit-Remaining headers; backoff honored; no blind replay.
- Desired user-visible outcome: A clean backoff sequence with no replay.
- Pass/fail: PASS if backoff honors Retry-After and no ambiguous write is replayed; FAIL if replayed or mocked.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Execute a read until a 429 occurs (real server response - no mocks).`

### Commands

1. Repeated `list_collection_items` until 429. 2. Record headers. 3. Backoff and retry once.

### Expected

429 observed with Retry-After (~60s) and X-RateLimit-Remaining headers; backoff honored; no blind replay.

### Evidence

Response headers, backoff timings, no-replay record.

### Pass / Fail

- **Pass**: if backoff honors Retry-After and no ambiguous write is replayed
- **Fail**: if replayed or mocked

### Failure Triage

1. Verify the header spelling (X-RateLimit-Remaining). 2. Wait the Retry-After window.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/feature-catalog.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/action-reference.md` | Action inventory with classes |
| `../../SKILL.md` | Frozen classes and gates |

---

## 5. SOURCE METADATA

- Group: Safety Gate
- Playbook ID: RATELIMIT-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `safety-gate/rate-limit.md`
