---
title: "PAIDGATE-001 -- Paid-Gate Error Taxonomy Walk"
description: "This scenario validates access-error classification for `PAIDGATE-001`. It focuses on distinguishing the three documented access failures — pre-authorization 401 (expected OAuth challenge), entitlement denial (Free plan; semantics UNVERIFIED, relay verbatim), and 429 (rate window) — without guessing undocumented semantics. SKIP-valid for the live halves."
version: 1.1.0.0
---

# PAIDGATE-001 -- Paid-Gate Error Taxonomy Walk

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PAIDGATE-001`.

---

## 1. OVERVIEW

This scenario validates access-error classification for `PAIDGATE-001`. It walks the three documented access failures and confirms the agent tells them apart without inventing semantics: a **pre-authorization HTTP 401** is the expected OAuth protected-resource challenge (with a `WWW-Authenticate` pointer), not a missing-key error and never a reason to invent a credential; an **entitlement denial** means the account plan gates MCP (Pro/Team/Enterprise only; the exact Free-plan status/payload/UX is **UNVERIFIED**, so the provider's message is relayed verbatim, never paraphrased into invented semantics); and an **HTTP 429** is the rate window, owned by RATELIMIT-001's protocol. The classification half is always gradable from the docs; observing the live errors is gated, so **SKIP with the blocker documented is valid for the live halves**.

### Why This Matters

The three failures look interchangeable to a careless agent ("Mobbin denied me") and each has a different correct response: 401 -> operator OAuth, entitlement -> plan upgrade conversation with the verbatim message, 429 -> Retry-After. Misclassifying a pre-auth 401 as a missing key is the exact path to fabricating `MOBBIN_API_KEY`; guessing Free-plan denial semantics fabricates provider behavior the research explicitly marked UNVERIFIED. The taxonomy is the difference between honest escalation and invented policy.

---

## 2. SCENARIO CONTRACT

Operators run the exact sequence for `PAIDGATE-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the three access failures are classified per the documented taxonomy, with unverified semantics relayed verbatim and never guessed
- Real user request: `Mobbin says I'm not allowed in. What's wrong and what do I do?`
- Prompt: `Mobbin says I'm not allowed in. What's wrong and what do I do?`
- Expected execution process: the agent asks for or inspects the actual error evidence -> classifies it as pre-auth 401 (expected challenge; operator OAuth is the fix; no API key exists), entitlement denial (plan gate; message relayed verbatim; "MCP starts at Pro" stated without invented failure semantics), or 429 (rate window; RATELIMIT-001 protocol) -> names the correct next step for that class and stops at the operator boundary
- Expected signals: the classification is grounded in the observed status/payload, not vibes; the UNVERIFIED status of Free-plan denial semantics is stated when relevant; no credential proposed; no auth-state touched; the `MOBBIN_DOCTOR_LIVE=1` probe (optional) shows the 401 shape
- Desired user-visible outcome: the user knows which of the three failures they hit and exactly whose move is next (operator OAuth, plan decision, or a timed retry)
- Pass/fail: PASS if the failure was classified per the taxonomy AND unverified semantics were relayed verbatim AND the operator boundary held; FAIL if a 401 was treated as a missing key, Free-plan semantics were guessed, or a credential/auth-state fix was proposed; SKIP (live halves) with the session/auth blocker documented

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Error classification stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: The classification half (taxonomy, correct next steps, verbatim-relay rule) is always gradable. Observing a live entitlement denial requires a Free-plan account nobody may have; observing a live 401 requires only the gated probe. SKIP the unobservable halves with the blocker documented.

1. optional `bash: MOBBIN_DOCTOR_LIVE=1 bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh`  # -> HTTP 401 observed (the expected challenge shape)
2. agent classifies the user's actual error evidence into 401 / entitlement / 429  # -> grounded in status+payload
3. agent names the class-correct next step  # -> OAuth (operator) | plan decision (verbatim message) | Retry-After
4. agent states what is UNVERIFIED (Free-plan denial semantics) instead of guessing  # -> honest boundary

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAIDGATE-001 | Access-error taxonomy | Verify 401 vs entitlement vs 429 are classified and answered per class | `Mobbin says I'm not allowed in. What's wrong and what do I do?` | 1. optional gated probe -> 2. classify from evidence -> 3. class-correct next step -> 4. UNVERIFIED boundary stated | Step 2: classification grounded in status/payload. Step 3: operator OAuth / verbatim plan message / Retry-After. Step 4: no guessed semantics | Error evidence (token-redacted); classification rationale; the verbatim provider message where applicable | PASS if the taxonomy held AND verbatim relay was honored AND no credential/auth fix was proposed. FAIL if a 401 became a "missing key", semantics were guessed, or a forbidden fix was offered. SKIP (live halves) with the blocker documented | 1. Confirm the classification cites the observed evidence. 2. Confirm the verbatim rule on entitlement messages. 3. Confirm the operator boundary held. |

### Optional Supplemental Checks

Cross-check with REFUSE-001: a user who follows up "so just add our API key" gets the fabrication refusal, not a workaround. A live entitlement denial, if ever observed, is a dated finding that resolves one of the packet's open questions — record it for a reviewed packet update.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/feature_catalog.md` | The plan-gating constraint this scenario classifies against |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/tool_surface.md` | Plan gating table, the UNVERIFIED Free-denial caveat, and the rate limit |
| `../../references/troubleshooting.md` | The 401 / entitlement / 429 rows this taxonomy is built from |
| `../../references/mcp_wiring.md` | The observed 401 challenge shape and the no-API-key auth model |

---

## 5. SOURCE METADATA

- Group: Limits and Access
- Playbook ID: PAIDGATE-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `limits_access/paid_gate_taxonomy.md`
