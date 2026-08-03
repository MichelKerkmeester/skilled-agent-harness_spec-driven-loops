---
title: "Scenario RATELIMIT-001: 429 backoff and Retry-After"
description: "On 429, honor Retry-After and never blind-replay ambiguous non-idempotent writes."
trigger_phrases: ["webflow playbook rate limit", "webflow 429"]
importance_tier: normal
version: 1.0.0.0
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
