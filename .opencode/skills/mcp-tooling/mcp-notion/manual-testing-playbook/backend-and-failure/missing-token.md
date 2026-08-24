---
title: "FAIL-001 -- Missing Token"
description: "This scenario validates that calling retrieve-bot-user with no Notion token configured fails with a named-credential error, not a generic crash."
stage: routing
version: 0.1.0.0
---

# FAIL-001 -- Missing Token

## 1. OVERVIEW

This scenario validates the mode's failure signal when `notion_NOTION_TOKEN` is unset: `retrieve-bot-user` must fail with an error that names the missing credential, not a generic or silent failure.

### Why This Matters

A generic crash gives an operator no path to recovery. A named-credential error tells them exactly what to set, which matters most in a headless run where no human is watching the terminal in real time.

---

## 2. SCENARIO CONTRACT

- Feature ID: `FAIL-001`
- Feature Name: Missing Token
- Scenario Objective: Confirm `retrieve-bot-user` fails with a named-credential error when `notion_NOTION_TOKEN` is unset, then restore the token and confirm recovery.
- Exact Prompt: `"Call retrieve-bot-user with no Notion token configured."`
- Exact Command Sequence: `1. unset notion_NOTION_TOKEN -> 2. notion["notion_retrieve-bot-user"]({}) -> 3. restore notion_NOTION_TOKEN -> 4. notion["notion_retrieve-bot-user"]({})`
- Expected Signals: Step 2 fails with an auth error naming the token, not a generic crash, and a non-zero exit; Step 4 succeeds and returns the bot user, confirming recovery.
- Evidence: the error message/body from Step 2, the exit code, and the successful Step 4 response.
- Pass/Fail Criteria: PASS if the failure names the missing token credential and the token is restored and re-confirmed working; FAIL if it crashes generically, hangs, or silently returns empty instead of erroring.
- Failure Triage: 1. Confirm the token was actually unset for this run (not just blank in one shell). 2. Confirm the error path is reached and not served by a cached client. 3. Restore `notion_NOTION_TOKEN` and re-run to confirm recovery before ending the scenario.

**This is a token-perturbing scenario.** Run it in the last wave, and restore `notion_NOTION_TOKEN` to a valid value immediately after execution, before any other scenario runs.

---

## 3. TEST EXECUTION

### Prerequisites

A valid `notion_NOTION_TOKEN` value is available to restore immediately after this scenario. This scenario must run last, after every other scenario that depends on a working token.

### Prompt

`"Call retrieve-bot-user with no Notion token configured."`

### Commands

1. Unset `notion_NOTION_TOKEN`.
2. `notion["notion_retrieve-bot-user"]({})`.
3. Restore `notion_NOTION_TOKEN` to its valid value.
4. `notion["notion_retrieve-bot-user"]({})` (confirm recovery).

### Expected

Step 2 fails with an error that explicitly names the missing token credential and exits non-zero. After restoring the token, step 4 succeeds and returns the bot user.

### Evidence

Capture the step-2 error message/body, its exit code, and the step-4 successful response confirming recovery.

### Pass / Fail

- **Pass:** the failure names the missing credential, and the token restore in step 4 succeeds.
- **Skip:** not applicable -- this scenario has no scratch-data dependency to be missing.
- **Fail:** the call crashes generically, hangs, or silently returns an empty success instead of erroring.

### Failure Triage

1. Confirm the token was actually unset for this run, not merely blank in a different shell.
2. Confirm the error path is genuinely reached and not served by a cached client.
3. Restore `notion_NOTION_TOKEN` and re-run step 4 to confirm recovery before ending the scenario.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAIL-001 | Missing Token | Verify retrieve-bot-user fails with a named-credential error when the token is unset | `"Call retrieve-bot-user with no Notion token configured."`| 1. unset token -> 2. `notion["notion_retrieve-bot-user"]({})` -> 3. restore token -> 4. re-call | Named-credential error, non-zero exit; recovery succeeds | Error message, exit code, recovery response | PASS if failure names the token and recovery succeeds; FAIL if generic crash or silent empty success | Confirm unset, confirm error path, restore and re-verify |

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
- Playbook ID: `FAIL-001`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `backend-and-failure/missing-token.md`
