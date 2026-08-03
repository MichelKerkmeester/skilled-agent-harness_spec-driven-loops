---
title: "SAFE-003 -- 429 backoff and Retry-After"
description: "429 responses trigger Retry-After-aware backoff; failed non-idempotent writes are not blindly replayed."
stage: safety
version: 1.0.0.0
---

# SAFE-003 -- 429 backoff and Retry-After

## 1. OVERVIEW

This scenario validates 429 backoff and Retry-After for `SAFE-003`. It focuses on 429 responses triggering Retry-After-aware backoff while failed non-idempotent writes are not blindly replayed.

### Why This Matters

429 responses trigger Retry-After-aware backoff; failed non-idempotent writes are not blindly replayed. A reproducible run proves the backoff actually honors the server-declared window instead of a guess, and that a failed write is surfaced to the user rather than re-fired.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SAFE-003` and confirm the expected signals without contradictory evidence.

- Objective: 429 responses trigger Retry-After-aware backoff; failed non-idempotent writes are not blindly replayed.
- Real user request: `Keep reading the CMS items until the rate limit kicks in.`
- Prompt: `Execute a read until a 429 occurs (real server response - no mocks).`
- Expected execution process: Trigger a real 429, capture the Retry-After header value, wait that exact duration, retry once, record the 429 body.
- Expected signals: 429 observed with Retry-After (~60s), X-RateLimit-Remaining, and X-RateLimit-Limit headers; backoff duration equals the captured Retry-After value; single retry after the wait; 429 body recorded verbatim.
- Desired user-visible outcome: A clean backoff sequence with no replay and a recorded 429 body.
- Pass/fail: PASS if backoff honors the captured Retry-After value and no ambiguous write is replayed; FAIL if replayed, mocked, or retried before the window elapses.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Execute a read until a 429 occurs (real server response - no mocks).`

### Commands

1. Call `list_collection_items(collection_id)` repeatedly (real server, no mocks) until the response status is `429`.
2. Capture the `Retry-After` header value (seconds) from the 429 response headers.
3. Wait exactly the captured duration — no tool calls during the wait.
4. Retry the identical read exactly once after the window elapses.
5. Record the 429 body verbatim (status, headers, payload) in the evidence log.

### Expected

429 observed with Retry-After (~60s) and X-RateLimit-Remaining/X-RateLimit-Limit headers; backoff duration equals the captured Retry-After value; single retry after the window; 429 body recorded; no blind replay of any write.

### Evidence

Response headers (Retry-After, X-RateLimit-Remaining, X-RateLimit-Limit), recorded 429 body, wait duration vs. Retry-After value, retry outcome, no-replay record (zero create/update/delete calls after the 429).

### Pass / Fail

- **Pass**: backoff honors the captured Retry-After value (wait ≥ header value) and no ambiguous write is replayed
- **Fail**: retry before the window elapses, blind replay of a non-idempotent write, or mocked 429

### Failure Triage

1. Verify the header spelling (`Retry-After`, `X-RateLimit-Remaining`, `X-RateLimit-Limit`); a missing Retry-After means the fallback is a fixed 60s backoff — record which path was taken.
2. If the retry still returns 429, stop and record the second 429 body — do not loop or retry again.
3. Confirm no non-idempotent write (create/update/delete) was called between the first 429 and the retry; if one was, the run FAILS on replay regardless of backoff timing.

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
- Playbook ID: SAFE-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `safety-gate/rate-limit.md`
