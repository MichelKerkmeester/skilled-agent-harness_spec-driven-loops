---
title: "pi-cache-optimizer: Manual Testing Playbook"
description: "Operator-facing manual validation package for the pi-cache-optimizer Pi extension, covering the /cache-optimizer command surface, the OpenAI prompt_cache_key optimization, and the environment opt-outs."
version: 1.0.0.0
---

# pi-cache-optimizer: Manual Testing Playbook

This document is the operator directory and review surface for manually validating the `pi-cache-optimizer` Pi extension. It explains how to run each scenario against a live Pi session, what to observe, how to capture evidence, and how to grade the result. Per-feature files carry the exact prompt, command sequence, expected signals, and pass/fail rule for one scenario each.

The extension reduces provider cache misses: it reorders stable system-prompt content, compresses skill listings, and injects an OpenAI `prompt_cache_key` fallback into openai-compatible request payloads when no effective key exists. It also exposes a `/cache-optimizer` command for enabling, diagnosing, and configuring that behavior.

---

Canonical package artifacts:
- `manual-testing-playbook.md`
- `command-surface/`
- `cache-key-optimization/`
- `opt-out/`

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete once its `PASS`, `FAIL`, or `SKIP` outcome and reason are recorded with the captured evidence. This extension ships outside a spec-kit skill tree, so runs are recorded under this package's sibling `benchmark/reports/` folder using the canonical run-folder shape.

---

## 1. OVERVIEW

This playbook defines seven deterministic scenarios across three categories that validate the operator-visible behavior of the extension. Each feature keeps a stable ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-08-17): the `/cache-optimizer` command surface (enable, disable, footer-mode config), the core `prompt_cache_key` injection that makes caching effective, and the environment opt-out that suppresses it. Provider-side cache hit rates are best-effort and out of scope; these scenarios validate what the extension itself controls.

### Realistic Test Model

1. A realistic user request frames what the operator wants the cache optimizer to do.
2. The operator runs the exact command sequence against a live Pi session.
3. The operator captures the command notification, the request payload change, or the persisted state.
4. The scenario passes only when the observed signals match the desired outcome without contradiction.

### What Each Feature File Explains

- The realistic user request that frames the test.
- The exact prompt and command sequence to run in Pi.
- The expected notification, payload change, or state.
- The desired user-visible outcome.
- The implementation and automated-test anchors that justify the scenario.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is a project where the extension is loaded (`.pi/settings.json` lists `extensions/pi-cache-optimizer` in `packages`).
2. Pi is installed and runs in interactive TUI mode.
3. A model is selected before running `doctor`, `stats`, or the payload scenarios. The command surface scenarios that need a model say so.
4. No scenario here mutates `models.json`. `/cache-optimizer fix` is confirmation-gated and is not exercised by this package.
5. Environment opt-outs are unset at the start of a scenario unless the scenario sets them.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact command sequence run.
- The active model at the time of the test.
- The command notification text and its severity.
- The provider-request payload before and after, when a payload scenario is under test.
- The scenario verdict with a one-line rationale.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Shell commands shown as `bash: <command>`.
- Text typed into the Pi TUI input line shown as `pi> <input>`.
- Environment variables shown as `env: NAME=value`.
- `->` separates sequential steps.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`.
2. The referenced per-feature files under each category folder.
3. Scenario execution evidence.
4. Triage notes for every non-pass outcome.

### Scenario Acceptance Rules

For each executed scenario, check that preconditions were satisfied, the command sequence ran as written, the expected signals are present, evidence is complete, and the outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks are true.
- `FAIL`: an expected signal is missing or contradicted.
- `SKIP`: a specific sandbox or runtime blocker prevents execution.

### Feature And Release Rules

A feature is `PASS` when all its scenarios pass, `FAIL` if any fails. The extension is releasable when no feature is `FAIL`, the two cache-key-optimization scenarios pass, all seven scenarios are covered, and no unresolved blocking triage item remains. Any cache-key-optimization `FAIL` (CACHE-005, CACHE-006) forces the extension verdict to `FAIL`, because the injection is the core value.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This package is small enough for one operator to run in sequence. The guidance below applies only if the scenarios are split across operators.

### Operational Rules

1. Run the two cache-key-optimization scenarios first, since they gate the release.
2. Reset optimizer state to startup default between scenarios by running `/reload` or restarting Pi.
3. Unset the opt-out environment variables between scenarios unless the scenario sets them.
4. Record the notification text verbatim and the payload diff for payload scenarios.

### What Belongs In Per-Feature Files

- The realistic user request.
- The exact prompt and command sequence.
- The expected notification, payload change, or state.
- Scenario-specific triage and caveats.

---

## 7. COMMAND SURFACE (`CACHE-001..CACHE-004`)

### CACHE-001 | Enable reports enabled

#### Description
Verify that `/cache-optimizer enable` turns the optimizer on for the process and reports it.

#### Scenario Contract
Prompt: `/cache-optimizer enable`

Run enable and confirm the notification begins `✅ Pi Cache Optimizer enabled for this Pi process` at info severity.

Desired user-visible outcome: the operator gets a clear confirmation that the optimizer is on.

#### Test Execution
> **Feature File:** [CACHE-001](command-surface/enable-reports-enabled.md)

### CACHE-002 | Disable reports disabled

#### Description
Verify that `/cache-optimizer disable` turns the optimizer off and reports it as a warning.

#### Scenario Contract
Prompt: `/cache-optimizer disable`

Run disable and confirm the notification begins `⏸️ Pi Cache Optimizer disabled for this Pi process` at warning severity.

Desired user-visible outcome: the operator gets a clear confirmation that the optimizer is off.

#### Test Execution
> **Feature File:** [CACHE-002](command-surface/disable-reports-disabled.md)

### CACHE-003 | Footer mode config persists

#### Description
Verify that `/cache-optimizer config footer-mode session` sets and confirms the footer mode.

#### Scenario Contract
Prompt: `/cache-optimizer config footer-mode session`

Run the config command and confirm the notification reads `✅ Footer mode set to session`.

Desired user-visible outcome: the operator can persist a footer mode and see it confirmed.

#### Test Execution
> **Feature File:** [CACHE-003](command-surface/footer-mode-config-persists.md)

### CACHE-004 | Invalid footer mode shows usage

#### Description
Verify that an unrecognized footer mode prints usage without changing state.

#### Scenario Contract
Prompt: `/cache-optimizer config footer-mode bogus`

Run an invalid mode and confirm the notification starts with `Usage: /cache-optimizer config footer-mode total|session|process`.

Desired user-visible outcome: a typo is caught with a helpful usage message.

#### Test Execution
> **Feature File:** [CACHE-004](command-surface/invalid-footer-mode-usage.md)

---

## 8. CACHE KEY OPTIMIZATION (`CACHE-005..CACHE-006`)

### CACHE-005 | Injects prompt_cache_key

#### Description
Verify that the request hook injects a `prompt_cache_key` into an openai-compatible payload that has none.

#### Scenario Contract
Prompt: send any normal request on an openai-compatible model.

Confirm the outgoing provider payload gains a non-empty `prompt_cache_key`.

Desired user-visible outcome: requests carry a stable cache key so the provider can serve cache hits.

#### Test Execution
> **Feature File:** [CACHE-005](cache-key-optimization/injects-prompt-cache-key.md)

### CACHE-006 | Preserves a caller-supplied key

#### Description
Verify that a payload that already has a `prompt_cache_key` is left unchanged.

#### Scenario Contract
Prompt: send a request whose payload already sets `prompt_cache_key`.

Confirm the extension does not overwrite the caller's key.

Desired user-visible outcome: an explicit caller key wins over the fallback.

#### Test Execution
> **Feature File:** [CACHE-006](cache-key-optimization/preserves-caller-key.md)

---

## 9. OPT OUT (`CACHE-007`)

### CACHE-007 | Env opt-out disables injection

#### Description
Verify that `PI_CACHE_OPTIMIZER_NO_OPENAI_CACHE_KEY=1` disables the `prompt_cache_key` injection.

#### Scenario Contract
Prompt: `env: PI_CACHE_OPTIMIZER_NO_OPENAI_CACHE_KEY=1`

With the variable set, confirm the request hook injects no `prompt_cache_key`.

Desired user-visible outcome: an operator who opts out gets no payload mutation.

#### Test Execution
> **Feature File:** [CACHE-007](opt-out/env-opt-out-disables-injection.md)

---

## 10. CACHE ECONOMICS (`CACHE-008..CACHE-009`)

### CACHE-008 | Unreported signal is not a miss

#### Description
Verify a response carrying no cache fields is counted as unmeasured and left out of the hit ratio, while its tokens and cost still record.

#### Scenario Contract
Prompt: send a normal request on a channel that omits cache fields from its usage block.

Confirm `unmeasuredRequests` increments, tokens and cost increment, and `hitRequests` does not.

Desired user-visible outcome: the report distinguishes "we could not measure this" from "this missed cache".

#### Test Execution
> **Feature File:** [CACHE-008](cache-economics/unreported-signal-is-not-a-miss.md)

### CACHE-009 | Zero cached-read rate prices

#### Description
Verify an explicit `cacheRead: 0` prices as free rather than reporting unpriced, while a missing or negative rate still does not price.

#### Scenario Contract
Prompt: send a request on a model whose cost block has a positive input rate and a zero cached-read rate.

Confirm `pricedRequests` increments and the report shows a real cost and savings figure.

Desired user-visible outcome: a model with free cached reads reports its true saving.

#### Test Execution
> **Feature File:** [CACHE-009](cache-economics/zero-cached-read-rate-prices.md)

---

## 11. CAPABILITY DECLARATION (`CACHE-010`)

### CACHE-010 | Model declares no cache reporting

#### Description
Verify `reportsCacheUsage: false` routes a model's requests to unmeasured rather than to a miss, and that an unset flag changes nothing.

#### Scenario Contract
Prompt: send a normal request on a model whose compat block declares the flag false.

Confirm `unmeasuredRequests` increments with tokens and cost still recorded, and that removing the flag restores prior behavior.

Desired user-visible outcome: a model that cannot report is set aside instead of dragging the hit rate down.

#### Test Execution
> **Feature File:** [CACHE-010](capability-declaration/model-declares-no-cache-reporting.md)

---

## 12. RETRY LOOP GUARD (`CACHE-011`)

### CACHE-011 | Repeat and streak escalate separately

#### Description
Verify a repeated request and a run of differing failures escalate on their own counters, each with a message describing what actually happened.

#### Scenario Contract
Prompt: drive consecutive all-failed tool batches, first with an identical error and then with differing errors.

Confirm identical failures warn on the 3rd batch and abort on the 4th, while differing failures warn on the 4th turn and abort on the 6th.

Desired user-visible outcome: the turn stops before the budget does, and the message names the real reason.

#### Test Execution
> **Feature File:** [CACHE-011](retry-loop-guard/repeat-and-streak-escalate-separately.md)

---

## 13. HASH-VERIFIED EDITS (`CACHE-012`)

### CACHE-012 | A moved line is refused

#### Description
Verify an edit is refused once lines were inserted or removed since the read, including where an identical line has shifted into the target position.

#### Scenario Contract
Prompt: read a file with repeated identical lines, insert a line above the target, then replay the original edit.

Confirm the edit is refused naming the line count at read time against the count now, and that the file is unchanged.

Desired user-visible outcome: a stale edit fails loudly instead of landing on the wrong line.

#### Test Execution
> **Feature File:** [CACHE-012](hash-verified-edits/moved-line-is-refused.md)

---

## 14. KEY REJECTION PERSISTENCE (`CACHE-013`)

### CACHE-013 | Rejection persists, reset forgets

#### Description
Verify a learned `prompt_cache_key` rejection survives a process restart, and that `reset` clears it for the active model.

#### Scenario Contract
Prompt: trigger a matching 400, restart the process, then run `/cache-optimizer reset`.

Confirm the restarted process omits the key without a second 400, and that after reset the key is attempted again.

Desired user-visible outcome: a rejecting provider costs one failed request rather than one per session, and the decision is reversible.

#### Test Execution
> **Feature File:** [CACHE-013](key-rejection-persistence/rejection-survives-restart-and-reset-forgets.md)

---

## 15. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `tests/review-findings.test.ts` | `prompt_cache_key` injection, preservation, opt-out gates, and rejection persistence | CACHE-005, CACHE-006, CACHE-007, CACHE-013 |
| `tests/cache-economics.test.ts` | Usage classification, the unmeasured counter, pricing, and the capability flag | CACHE-008, CACHE-009, CACHE-010 |
| `tests/retry-loop-guard.test.ts` | Batch assembly and both escalation counters | CACHE-011 |
| `tests/hash-verified-edits.test.ts` | Line hashing, edit validation, and the refusal paths | CACHE-012 |

---

## 16. SCENARIO CROSS-REFERENCE INDEX

No feature catalog exists for this extension, so the index below is the authoritative scenario directory.

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| CACHE-001 | Enable reports enabled | Command Surface | [CACHE-001](command-surface/enable-reports-enabled.md) |
| CACHE-002 | Disable reports disabled | Command Surface | [CACHE-002](command-surface/disable-reports-disabled.md) |
| CACHE-003 | Footer mode config persists | Command Surface | [CACHE-003](command-surface/footer-mode-config-persists.md) |
| CACHE-004 | Invalid footer mode shows usage | Command Surface | [CACHE-004](command-surface/invalid-footer-mode-usage.md) |
| CACHE-005 | Injects prompt_cache_key | Cache Key Optimization | [CACHE-005](cache-key-optimization/injects-prompt-cache-key.md) |
| CACHE-006 | Preserves a caller-supplied key | Cache Key Optimization | [CACHE-006](cache-key-optimization/preserves-caller-key.md) |
| CACHE-007 | Env opt-out disables injection | Opt Out | [CACHE-007](opt-out/env-opt-out-disables-injection.md) |
| CACHE-008 | Unreported signal is not a miss | Cache Economics | [CACHE-008](cache-economics/unreported-signal-is-not-a-miss.md) |
| CACHE-009 | Zero cached-read rate prices | Cache Economics | [CACHE-009](cache-economics/zero-cached-read-rate-prices.md) |
| CACHE-010 | Model declares no cache reporting | Capability Declaration | [CACHE-010](capability-declaration/model-declares-no-cache-reporting.md) |
| CACHE-011 | Repeat and streak escalate separately | Retry Loop Guard | [CACHE-011](retry-loop-guard/repeat-and-streak-escalate-separately.md) |
| CACHE-012 | A moved line is refused | Hash-Verified Edits | [CACHE-012](hash-verified-edits/moved-line-is-refused.md) |
| CACHE-013 | Rejection persists, reset forgets | Key Rejection Persistence | [CACHE-013](key-rejection-persistence/rejection-survives-restart-and-reset-forgets.md) |
