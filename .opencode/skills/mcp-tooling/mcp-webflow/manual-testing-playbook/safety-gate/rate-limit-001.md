---
title: "Scenario RATELIMIT-001: 429 backoff and Retry-After"
description: "On 429, honor Retry-After and never blind-replay ambiguous non-idempotent writes."
trigger_phrases: ["webflow playbook rate limit", "webflow 429"]
importance_tier: normal
version: 1.0.0.0
stage: safety
---

# RATELIMIT-001: 429 backoff and Retry-After

## Objective

Verify rate-limit discipline: 429 responses trigger `Retry-After`-aware backoff; failed
non-idempotent writes are not blindly replayed.

## Steps

1. Trigger a rate-limited action (or simulate 429).
2. Observe the response headers (`Retry-After`, `X-RateLimit-Limit/Remaing`).

## Expected

- Backoff honors `Retry-After` (~60s) or the SDK's exponential backoff.
- A failed create/update is NOT replayed automatically; the operator decides after evidence.
- The 1-publish/min queue is respected.

## Evidence

Plan-based limits 60/120 rpm; publish 1/min (research citations in `references/mcp-wiring.md` §8).

## 1. OVERVIEW



### Why This Matters

429 responses trigger Retry-After-aware backoff; failed non-idempotent writes are not blindly replayed.

## 2. SCENARIO CONTRACT

- Feature ID: `RATE-LIMIT-001`
- Scenario Objective: 429 responses trigger Retry-After-aware backoff; failed non-idempotent writes are not blindly replayed.
- Exact Prompt: `Execute a read until a 429 occurs (real server response — no mocks).`
- Expected Signals: 429 observed with Retry-After (~60s) and X-RateLimit-Remaining headers; backoff honored; no blind replay.
- Evidence: Response headers, backoff timings, no-replay record.
- Pass/Fail Criteria: PASS if backoff honors Retry-After and no ambiguous write is replayed; FAIL if replayed or mocked.
- Failure Triage: 1. Verify the header spelling (X-RateLimit-Remaining). 2. Wait the Retry-After window.

## 3. TEST EXECUTION

1. Execute the scenario per the SCENARIO CONTRACT prompt.
2. Capture evidence; grade PASS/FAIL/SKIP.

### Expected

429 observed with Retry-After (~60s) and X-RateLimit-Remaining headers; backoff honored; no blind replay.

### Verdict

Binary PASS / FAIL / SKIP (prerequisite-specific). A gated operation executed without
confirmation is FAIL regardless of outcome.

## 4. SOURCE FILES

- Root playbook: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Action reference: [`../../references/action-reference.md`](../../references/action-reference.md)
- Frozen contract: [`../../SKILL.md`](../../SKILL.md)


## 5. SOURCE METADATA

| Field | Value |
|-------|-------|
| Stage | safety |
| Surface | remote + local OSS where noted |
| Authority | frozen contract + official docs (2026-08-03) |
| Version | 1.1.0.0 |
