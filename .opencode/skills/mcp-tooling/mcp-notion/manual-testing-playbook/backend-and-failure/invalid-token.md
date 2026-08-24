---
title: "FAIL-002 -- Invalid Token"
description: "This scenario validates that calling retrieve-bot-user with a deliberately wrong Notion token surfaces a 401 unauthorized error, never a silent empty success."
stage: routing
version: 0.1.0.0
---

# FAIL-002 -- Invalid Token

## 1. OVERVIEW

This scenario validates the mode's failure signal for a wrong credential: `retrieve-bot-user` with an invalid `notion_NOTION_TOKEN` must surface an explicit `401`/unauthorized error, never a silent empty result that could be mistaken for a valid-but-empty response.

### Why This Matters

A silent empty success on a bad credential is the dangerous failure mode -- it looks like a legitimate "no data" result rather than an authentication problem, and an agent could proceed on that false premise.

---

## 2. SCENARIO CONTRACT

- Feature ID: `FAIL-002`
- Feature Name: Invalid Token
- Scenario Objective: Confirm `retrieve-bot-user` surfaces `401` unauthorized for a wrong token, then restore the valid token and confirm recovery.
- Exact Prompt: `"Call retrieve-bot-user with a deliberately wrong Notion token."`
- Exact Command Sequence: `1. set notion_NOTION_TOKEN to a deliberately invalid value -> 2. notion["notion_retrieve-bot-user"]({}) -> 3. restore notion_NOTION_TOKEN to its valid value -> 4. notion["notion_retrieve-bot-user"]({})`
- Expected Signals: Step 2 surfaces a `401`/unauthorized error with a meaningful message and a non-zero exit; Step 4 succeeds and returns the bot user, confirming recovery.
- Evidence: the error status code and body from Step 2, and the successful Step 4 response.
- Pass/Fail Criteria: PASS if `401`/unauthorized is surfaced with a message and the token is restored and re-confirmed working; FAIL if the call returns an empty success instead of an error.
- Failure Triage: 1. Confirm the invalid token was actually applied for this call. 2. Confirm the error is specifically `401`, not a different failure mode (e.g. a network error masking the real status). 3. Restore the valid token and re-run to confirm recovery before ending the scenario.

**This is a token-perturbing scenario.** Run it in the last wave, and restore `notion_NOTION_TOKEN` to a valid value immediately after execution, before any other scenario runs.

---

## 3. TEST EXECUTION

### Prerequisites

A valid `notion_NOTION_TOKEN` value is available to restore immediately after this scenario. This scenario must run last, after every other scenario that depends on a working token.

### Prompt

`"Call retrieve-bot-user with a deliberately wrong Notion token."`

### Commands

1. Set `notion_NOTION_TOKEN` to a deliberately invalid value.
2. `notion["notion_retrieve-bot-user"]({})`.
3. Restore `notion_NOTION_TOKEN` to its valid value.
4. `notion["notion_retrieve-bot-user"]({})` (confirm recovery).

### Expected

Step 2 surfaces a `401`/unauthorized error with a meaningful message and a non-zero exit. After restoring the token, step 4 succeeds and returns the bot user.

### Evidence

Capture the step-2 error status code and body, and the step-4 successful response confirming recovery.

### Pass / Fail

- **Pass:** `401`/unauthorized is surfaced with a message, and the token restore in step 4 succeeds.
- **Skip:** not applicable -- this scenario has no scratch-data dependency to be missing.
- **Fail:** the call returns an empty success instead of an authentication error.

### Failure Triage

1. Confirm the invalid token was actually applied for this call.
2. Confirm the error is specifically `401`, not a different failure mode masking the real status.
3. Restore the valid token and re-run step 4 to confirm recovery before ending the scenario.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAIL-002 | Invalid Token | Verify retrieve-bot-user surfaces 401 unauthorized for a wrong token, never a silent empty success | `"Call retrieve-bot-user with a deliberately wrong Notion token."`| 1. set invalid token -> 2. `notion["notion_retrieve-bot-user"]({})` -> 3. restore token -> 4. re-call | `401`/unauthorized with message; recovery succeeds | Error status/body, recovery response | PASS if 401 surfaced and recovery succeeds; FAIL if empty success returned | Confirm token applied, confirm status is 401, restore and re-verify |

Cleanup: restore `notion_NOTION_TOKEN` to a valid value before any other scenario runs (done in step 3, confirmed in step 4).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root MCP policy, wave order (last wave, token-perturbing), and result-persistence contract |
| [`../../feature-catalog/FEATURE-CATALOG.md`](../../feature-catalog/FEATURE-CATALOG.md) | Root catalog, section 2 Backend selection (auth prerequisite) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Confirms `retrieve-bot-user` as the connectivity/auth preflight tool |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Section 4 Auth and sharing failures, the recovery recipe this scenario checks |

---

## 5. SOURCE METADATA

- Group: Backend and failure
- Playbook ID: `FAIL-002`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `backend-and-failure/invalid-token.md`
