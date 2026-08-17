---
title: "deep-pi: Manual Testing Playbook"
description: "Operator-facing manual validation package for the deep-pi Pi extension, covering model eligibility for direct DeepSeek models and the /deeppi cache-economics report."
version: 1.0.0.0
---

# deep-pi: Manual Testing Playbook

This document is the operator directory and review surface for manually validating the `deep-pi` extension. It explains how to run each scenario against a live Pi session, what to observe, how to capture evidence, and how to grade the result. Per-feature files carry the exact prompt, command sequence, expected signals, and pass/fail rule for one scenario each.

DeepPi is active only for the direct DeepSeek models `deepseek-v4-flash` and `deepseek-v4-pro`. On a supported model it activates the `edit_lines` tool, shows a `DeepPi` status footer, and answers `/deeppi` with a cache-economics report. On every other provider or model it is dormant.

---

Canonical package artifacts:
- `manual-testing-playbook.md`
- `eligibility/`
- `cache-measurement/`

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete once its `PASS`, `FAIL`, or `SKIP` outcome and reason are recorded with the captured evidence. This extension ships outside a spec-kit skill tree, so runs are recorded under this package's sibling `benchmark/reports/` folder using the canonical run-folder shape.

---

## 1. OVERVIEW

This playbook defines six deterministic scenarios across two categories that validate the operator-visible behavior of the extension. Each feature keeps a stable ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-08-17): model eligibility (active on the two supported DeepSeek models, dormant on proxies and unrelated providers, and a one-time warning on an unrecognized DeepSeek id) and the cache-economics measurement surfaced through the status footer and the `/deeppi` report. The paid live benchmark (`DEEPPI_LIVE=1 npm run benchmark:live`) is out of scope and is never run here.

### Realistic Test Model

1. A realistic user request frames what the operator wants DeepPi to measure.
2. The operator selects a model and runs the exact command sequence against a live Pi session.
3. The operator captures the status footer, the tool set, or the `/deeppi` report notification.
4. The scenario passes only when the observed signals match the desired outcome without contradiction.

### What Each Feature File Explains

- The realistic user request that frames the test.
- The exact prompt and command sequence to run in Pi.
- The expected footer, tool change, warning, or report.
- The desired user-visible outcome.
- The implementation and automated-test anchors that justify the scenario.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is a project where the extension is loaded (`.pi/settings.json` lists `extensions/deep-pi` in `packages`).
2. Pi is installed and runs in interactive TUI mode.
3. The `deepseek` provider is authenticated so the supported models are selectable.
4. No scenario here calls a paid API. The live benchmark stays off; `DEEPPI_LIVE` is unset.
5. Model eligibility is refreshed on model change, so switching models mid-session is a valid way to compare active and dormant states.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact command sequence run.
- The active model at the time of the test.
- The `deeppi` status footer value.
- The active tool set (whether `edit_lines` is present).
- The `/deeppi` report notification text, when the report is under test.
- The scenario verdict with a one-line rationale.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Shell commands shown as `bash: <command>`.
- Text typed into the Pi TUI input line shown as `pi> <input>`.
- Keystrokes shown as `key: <keys>`.
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
- `SKIP`: a specific sandbox or runtime blocker prevents execution, such as an unauthenticated DeepSeek provider.

### Feature And Release Rules

A feature is `PASS` when all its scenarios pass, `FAIL` if any fails. The extension is releasable when no feature is `FAIL`, the eligibility scenarios pass, all six scenarios are covered, and no unresolved blocking triage item remains. Any eligibility `FAIL` (DEEP-001 through DEEP-004) forces the extension verdict to `FAIL`, because activating on the wrong models is the primary risk.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This package is small enough for one operator to run in sequence. The guidance below applies only if the scenarios are split across operators.

### Operational Rules

1. Run the eligibility scenarios first, since they gate the release.
2. Give each model its own session, or switch models with the model picker and re-check the footer.
3. Record the footer verbatim, since the warming and cache-percent states are distinct signals.
4. Keep the measurement scenarios deterministic by feeding a known response rather than a live paid call.

### What Belongs In Per-Feature Files

- The realistic user request.
- The exact prompt and command sequence.
- The expected footer, tool change, warning, or report.
- Scenario-specific triage and caveats.

---

## 7. ELIGIBILITY (`DEEP-001..DEEP-004`)

### DEEP-001 | Active on deepseek-v4-flash

#### Description
Verify that selecting `deepseek-v4-flash` activates DeepPi.

#### Scenario Contract
Prompt: select the `deepseek/deepseek-v4-flash` model.

On session start the `edit_lines` tool becomes active and the `deeppi` footer reads `DeepPi · warming`.

Desired user-visible outcome: DeepPi is clearly active on a supported model.

#### Test Execution
> **Feature File:** [DEEP-001](eligibility/active-on-flash.md)

### DEEP-002 | Active on deepseek-v4-pro

#### Description
Verify that selecting `deepseek-v4-pro` activates DeepPi.

#### Scenario Contract
Prompt: select the `deepseek/deepseek-v4-pro` model.

On session start the `edit_lines` tool becomes active and the `deeppi` footer reads `DeepPi · warming`.

Desired user-visible outcome: DeepPi is clearly active on the second supported model.

#### Test Execution
> **Feature File:** [DEEP-002](eligibility/active-on-pro.md)

### DEEP-003 | Dormant on a proxy route

#### Description
Verify that a proxied DeepSeek route such as `openrouter/deepseek/deepseek-v4-pro` leaves DeepPi dormant.

#### Scenario Contract
Prompt: select the `openrouter` route to a DeepSeek model.

On session start the `deeppi` footer stays unset and the default tool set is unchanged.

Desired user-visible outcome: DeepPi does not activate on an indirect route it cannot measure.

#### Test Execution
> **Feature File:** [DEEP-003](eligibility/dormant-on-proxy-route.md)

### DEEP-004 | Warns on an unrecognized DeepSeek id

#### Description
Verify that an unrecognized DeepSeek id such as `deepseek-v5-test` produces a one-time warning and stays dormant.

#### Scenario Contract
Prompt: select a `deepseek` model with an id DeepPi does not recognize.

On session start a warning names the unrecognized model and DeepPi does not activate.

Desired user-visible outcome: the operator is told a new DeepSeek release may need a DeepPi update.

#### Test Execution
> **Feature File:** [DEEP-004](eligibility/warns-on-unrecognized-id.md)

---

## 8. CACHE MEASUREMENT (`DEEP-005..DEEP-006`)

### DEEP-005 | /deeppi reports the cache hit rate

#### Description
Verify that `/deeppi` reports a measured cache hit rate after a response on a supported model.

#### Scenario Contract
Prompt: `/deeppi`

After a response with known cache-read and input tokens, `/deeppi` notifies a report that includes `Cache hit rate:` with the measured percentage.

Desired user-visible outcome: the operator sees the concrete cache economics for the session.

#### Test Execution
> **Feature File:** [DEEP-005](cache-measurement/deeppi-reports-hit-rate.md)

### DEEP-006 | Footer shows the measured cache percent

#### Description
Verify that the status footer updates from warming to a measured cache percent after a response.

#### Scenario Contract
Prompt: send a request and observe the footer.

After a response with 80% cache-read tokens, the `deeppi` footer reads `DeepPi · 80% cache`.

Desired user-visible outcome: the footer reflects the live cache hit rate.

#### Test Execution
> **Feature File:** [DEEP-006](cache-measurement/footer-shows-cache-percent.md)

---

## 9. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `tests/eligibility.test.ts` | `isDeepPiModel` acceptance and rejection | DEEP-001, DEEP-002, DEEP-003, DEEP-004 |
| `tests/deeppi.integration.test.ts` | Activation, footer, warning, and `/deeppi` report | DEEP-001 through DEEP-006 |
| `tests/report.test.ts` | Report rendering | DEEP-005 |

---

## 10. SCENARIO CROSS-REFERENCE INDEX

No feature catalog exists for this extension, so the index below is the authoritative scenario directory.

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| DEEP-001 | Active on deepseek-v4-flash | Eligibility | [DEEP-001](eligibility/active-on-flash.md) |
| DEEP-002 | Active on deepseek-v4-pro | Eligibility | [DEEP-002](eligibility/active-on-pro.md) |
| DEEP-003 | Dormant on a proxy route | Eligibility | [DEEP-003](eligibility/dormant-on-proxy-route.md) |
| DEEP-004 | Warns on an unrecognized DeepSeek id | Eligibility | [DEEP-004](eligibility/warns-on-unrecognized-id.md) |
| DEEP-005 | /deeppi reports the cache hit rate | Cache Measurement | [DEEP-005](cache-measurement/deeppi-reports-hit-rate.md) |
| DEEP-006 | Footer shows the measured cache percent | Cache Measurement | [DEEP-006](cache-measurement/footer-shows-cache-percent.md) |
