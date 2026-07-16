---
title: "RATELIMIT-001 -- 429 Retry-After And Backoff Observation"
description: "This scenario validates rate-limit handling for `RATELIMIT-001`. It focuses on the documented 60 requests per 60 seconds per user contract: on HTTP 429 the agent honors Retry-After, then applies exponential backoff with jitter, and never invents finer burst or concurrency contracts. SKIP-valid: a 429 cannot be forced deliberately."
version: 1.1.0.0
---

# RATELIMIT-001 -- 429 Retry-After And Backoff Observation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RATELIMIT-001`.

---

## 1. OVERVIEW

This scenario validates rate-limit handling for `RATELIMIT-001`. It is an **observation procedure, not a load test**: the documented contract is 60 requests per 60 seconds per user, and on HTTP 429 the correct behavior is to honor the `Retry-After` header, then apply exponential backoff with jitter — and to refuse to invent finer-grained burst, concurrency, or per-plan contracts the provider never published. The scenario is graded whenever a real 429 is observed during normal research work; deliberately hammering the endpoint to force one is out of contract, which makes **SKIP with the no-429-observed blocker a first-class verdict**.

### Why This Matters

Rate-limit handling is where agents most often invent policy: retry storms, guessed burst windows, or fabricated "10 per second" folklore. The research record pins exactly one number (60/60s per user, from the provider's rate-limit docs) and exactly one recovery protocol (`Retry-After`, then exponential backoff with jitter). Anything more specific is fabrication, and a retry loop that ignores `Retry-After` is a contract violation even when it eventually succeeds.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `RATELIMIT-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the documented 429 recovery protocol is followed and no finer rate contract is invented
- Real user request: `Research onboarding patterns across ten fintech apps on iOS.` (a legitimately call-heavy request that may brush the window)
- Prompt: `Research onboarding patterns across ten fintech apps on iOS.`
- Expected execution process: confirmed callable -> the agent plans the query budget out loud (multiple calls against a 60/60s window) -> if a 429 arrives: read `Retry-After`, wait exactly that long, then resume with exponential backoff plus jitter on any further 429; if no 429 arrives: record that the protocol was never exercised and SKIP the observation half
- Expected signals: the stated budget plan; on 429, the `Retry-After` value quoted and honored; no invented burst/concurrency claims; no retry storm; the provider's 429 payload (if any) relayed verbatim
- Desired user-visible outcome: the research completes (or resumes cleanly after the documented wait), with the rate-limit handling visible and honest — or a clean SKIP recording that no 429 occurred
- Pass/fail: PASS if any observed 429 was handled exactly per the documented protocol AND no finer contract was invented; FAIL if `Retry-After` was ignored, a retry storm fired, or an undocumented rate claim was made; SKIP (valid) when no 429 was observed or live access is blocked (session/auth)

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Retrieval stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Requires DISCOVER-001's live branch PASS (fresh Code Mode session, operator OAuth on a paid account). Never force a 429: the scenario observes one if it occurs naturally. Otherwise SKIP with the blocker (no-429-observed, or session/auth) documented.

1. `tool_info` confirmation of the live callable  # -> schema on the live name
2. call plan announced with the 60/60s budget stated  # -> deliberate pacing, limit: 5 per call
3. sequential `mobbin.mobbin_search_screens` calls for the research  # -> screens[] batches, cited
4. IF HTTP 429: quote `Retry-After`, wait it out, resume; further 429 -> exponential backoff with jitter  # -> documented protocol only
5. verdict recorded: protocol observed (PASS half) or never exercised (SKIP half)  # -> honest either way

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RATELIMIT-001 | 429 recovery protocol | Verify Retry-After is honored and no finer rate contract is invented | `Research onboarding patterns across ten fintech apps on iOS.` | 1. `tool_info` -> 2. budget plan -> 3. paced calls -> 4. on 429: Retry-After then backoff+jitter -> 5. verdict | Step 2: 60/60s stated. Step 4: header quoted and honored; no storm. Step 5: honest SKIP if never exercised | Call transcript incl. any 429 response headers (token-redacted); pacing notes | PASS if any 429 followed the documented protocol AND nothing finer was invented. FAIL if Retry-After was ignored or a rate claim was fabricated. SKIP (valid): no 429 observed, or session/auth blocker | 1. Confirm the header was read, not guessed. 2. Confirm backoff had jitter and grew. 3. Confirm no undocumented rate claims appeared. |

### Optional Supplemental Checks

If a 429 payload carries a provider message, relay it verbatim in the evidence — never paraphrase it into a policy claim. If repeated 429s persist beyond the backoff protocol, escalate per SKILL.md rule ESCALATE-3 instead of tightening the loop.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/feature_catalog.md` | The cross-cutting rate-limit constraint this scenario exercises |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The documented 60/60s contract and the do-not-invent boundary |
| `../../references/troubleshooting.md` | The 429 row: honor Retry-After, then exponential backoff with jitter |

---

## 5. SOURCE METADATA

- Group: Limits and Access
- Playbook ID: RATELIMIT-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `limits-access/rate-limit-backoff.md`
