---
title: "FAIL-003 -- Rate-Limit Backoff"
description: "This scenario validates that the mode honors Notion's ~3 requests/second limit and backs off on 429 per Retry-After plus jitter, instead of a tight retry loop."
stage: routing
version: 0.1.0.0
---

# FAIL-003 -- Rate-Limit Backoff

## 1. OVERVIEW

This scenario validates rate-limit discipline: a small burst of read calls above ~3 requests/second must trigger a `429`, and the mode's retry must honor the returned `Retry-After` header plus jitter rather than hammering the endpoint in a tight immediate-retry loop.

### Why This Matters

A tight retry loop against a `429` compounds the problem instead of recovering from it, and can escalate into a longer lockout. Honoring `Retry-After` is what turns a rate-limit hit into a transient, self-healing delay instead of a cascading failure.

---

## 2. SCENARIO CONTRACT

- Feature ID: `FAIL-003`
- Feature Name: Rate-Limit Backoff
- Scenario Objective: Issue a small read-only burst above ~3 req/s, observe a `429`, and confirm the retry honors `Retry-After` plus jitter before eventually succeeding.
- Exact Prompt: `"Issue a burst of read calls above 3/second and confirm the mode backs off instead of hammering."`
- Exact Command Sequence: `1. issue a small burst of repeated notion["notion_retrieve-bot-user"] ({}) calls above 3 req/s -> 2. observe a 429 response -> 3. confirm the retry waits per the returned Retry-After value plus jitter, then succeeds`
- Expected Signals: Step 2 returns `429` with a `Retry-After` header; Step 3's retry timing matches `Retry-After` plus jitter, not an immediate tight retry, and eventually succeeds.
- Evidence: the request timing/transcript, the observed `Retry-After` header value, and the eventual success response.
- Pass/Fail Criteria: PASS if the mode backs off per `Retry-After` and then succeeds; FAIL if it retries immediately in a tight loop or gives up without succeeding; SKIP if the burst does not trigger a `429` at all (rate-limit threshold not reached in this environment).
- Failure Triage: 1. Confirm the burst actually exceeded ~3 req/s. 2. Confirm the `429` response carried a `Retry-After` header. 3. Re-run with a slightly larger burst if `429` was not triggered, keeping the burst read-only and small.

---

## 3. TEST EXECUTION

### Prerequisites

`notion_NOTION_TOKEN` is set and valid; the burst uses only the read-only `retrieve-bot-user` call so no scratch content is created or mutated.

### Prompt

`"Issue a burst of read calls above 3/second and confirm the mode backs off instead of hammering."`

### Commands

1. Issue a small burst of repeated `notion["notion_retrieve-bot-user"] ({})` calls above ~3 requests/second.
2. Observe a `429` response.
3. Confirm the retry waits per the returned `Retry-After` value plus jitter, then succeeds.

### Expected

The burst triggers a `429` carrying a `Retry-After` header; the retry timing matches that value plus jitter rather than an immediate tight loop, and the call eventually succeeds.

### Evidence

Capture the request timing/transcript, the observed `Retry-After` header value, and the eventual success response.

### Pass / Fail

- **Pass:** the mode backs off per `Retry-After` plus jitter and then succeeds.
- **Skip:** the burst does not trigger a `429` in this environment (rate-limit threshold not reached).
- **Fail:** the mode retries immediately in a tight loop, or gives up without eventually succeeding.

### Failure Triage

1. Confirm the burst actually exceeded ~3 requests/second.
2. Confirm the `429` response carried a `Retry-After` header.
3. Re-run with a slightly larger burst if `429` was not triggered, keeping the burst read-only and small.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAIL-003 | Rate-Limit Backoff | Verify the mode backs off on 429 per Retry-After instead of hammering | `"Issue a burst of read calls above 3/second and confirm the mode backs off instead of hammering."` | 1. burst `notion["notion_retrieve-bot-user"] ({})` above 3 req/s -> 2. observe 429 -> 3. confirm Retry-After + jitter backoff, then success | 429 observed with Retry-After; backoff timing matches, then succeeds | Request timing, Retry-After value, eventual success | PASS if backoff honored and succeeds; SKIP if 429 not triggered; FAIL if tight retry loop or no eventual success | Confirm burst rate, confirm Retry-After header, re-run larger burst if needed |

Cleanup: none (read-only burst).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy, wave order, and result-persistence contract |
| [`../../feature-catalog/FEATURE-CATALOG.md`](../../feature-catalog/FEATURE-CATALOG.md) | Root catalog, section 10 Operational doctrine (rate limit and version pinning) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Confirms `retrieve-bot-user` as the lightweight read used for the burst |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Section 5 Rate limit 429 (backoff plus jitter), the recovery recipe this scenario checks |

---

## 5. SOURCE METADATA

- Group: Backend and failure
- Playbook ID: `FAIL-003`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `backend-and-failure/rate-limit-backoff.md`
