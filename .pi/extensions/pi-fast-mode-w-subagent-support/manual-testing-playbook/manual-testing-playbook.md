---
title: "pi-fast-mode-w-subagent-support: Manual Testing Playbook"
description: "Operator-facing manual validation package for the pi-fast-mode-w-subagent-support Pi extension, covering priority-tier activation on the GPT-5.6 SOL, TERRA, and LUNA models, toggle notifications, startup and persistence, and the subagent handoff."
version: 1.0.0.0
---

# pi-fast-mode-w-subagent-support: Manual Testing Playbook

This document is the operator directory and review surface for manually validating the `pi-fast-mode-w-subagent-support` Pi extension. It explains how to run each scenario against a live Pi session, what to observe, how to capture evidence, and how to grade the result. Per-feature files carry the exact prompt, command sequence, expected signals, and pass/fail rule for one scenario each.

The extension injects the OpenAI `service_tier: "priority"` hint into requests when Fast Mode is on and the active model is a configured target. The GPT-5.6 SOL, TERRA, and LUNA variants (provider `openai-codex`) are configured targets, so they are the focus of the activation scenarios.

---

Canonical package artifacts:
- `manual-testing-playbook.md`
- `model-activation/`
- `toggle-and-notification/`
- `persistence-and-startup/`
- `subagent-handoff/`

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete once its `PASS`, `FAIL`, or `SKIP` outcome and reason are recorded with the captured evidence. This extension ships outside a spec-kit skill tree, so record outcomes in the operator's own run notes or evidence folder rather than a `benchmark/reports/` renderer.

---

## 1. OVERVIEW

This playbook defines ten deterministic scenarios across four categories that validate the operator-visible behavior of Fast Mode. Each feature keeps a stable ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-08-17): activation is verified on all three GPT-5.6 variants named by the operator (SOL, TERRA, LUNA) plus an off-target model, then toggle notifications, startup and persistence, and the subagent handoff. Fast Mode payload injection at the request layer is covered by the extension's automated `tests/payload-status.test.ts`; this package validates the operator-visible signals (chat notification and the `fast` status indicator).

### Realistic Test Model

1. A realistic user request frames what the operator wants Fast Mode to do.
2. The operator launches or steers a live Pi session and runs the exact command sequence.
3. The operator captures the chat notification, the status indicator, and the session state.
4. The scenario passes only when the observed signals match the desired user-visible outcome without contradiction.

### What Each Feature File Explains

- The realistic user request that frames the test.
- The exact prompt and command sequence to run in Pi.
- The expected notification, status indicator, and session state.
- The desired user-visible outcome.
- The implementation and automated-test anchors that justify the scenario.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is a project where the extension is loaded (`.pi/settings.json` lists `extensions/pi-fast-mode-w-subagent-support` in `packages`).
2. Pi is installed and runs in interactive TUI mode.
3. The `openai-codex` provider is authenticated so the SOL, TERRA, and LUNA models are selectable.
4. Fast Mode state starts from a known value. Run `/fast off` once before a scenario when the starting state matters.
5. No scenario in this package is destructive. None edit code, delete files, or mutate provider account settings.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact command sequence run.
- The active model at the time of the test.
- The chat notification text and its level.
- Whether the right-aligned `fast` status indicator was visible.
- The persisted state file content when persistence is under test (`.pi/pi-fast-mode-w-subagent-support-config.json`).
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

For each executed scenario, check:

1. Preconditions were satisfied.
2. The prompt and command sequence were run as written.
3. The expected signals are present.
4. Evidence is complete and readable.
5. The outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks are true.
- `FAIL`: an expected signal is missing or contradicted.
- `SKIP`: a specific sandbox or runtime blocker prevents execution, such as a provider that is not authenticated.

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`.
- `FAIL`: any mapped scenario is `FAIL`.
- `SKIP`: every mapped scenario is blocked by a named blocker.

Hard rule: any activation scenario `FAIL` (FAST-001 through FAST-004) forces the extension verdict to `FAIL`, because activation is the core behavior.

### Release Readiness Rule

The extension is releasable only when no feature verdict is `FAIL`, every activation scenario is `PASS`, all ten scenarios are covered, and no unresolved blocking triage item remains.

### Root-vs-Feature Rule

Global verdict logic lives here. Scenario-specific caveats live in the matching per-feature file.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This package is small enough for one operator to run in sequence. The guidance below applies only if the scenarios are split across multiple operators.

### Operational Rules

1. Run the four activation scenarios first, since they gate the release.
2. Give each model variant its own session to avoid mid-session state carryover confusing the result.
3. Reset Fast Mode to off between scenarios when the starting state matters.
4. Record the notification text verbatim, since the wording distinguishes active from off-target.
5. Keep the subagent-handoff scenario last, because it launches a second process.

### What Belongs In Per-Feature Files

- The realistic user request.
- The exact prompt and command sequence.
- The expected notification, indicator, and state.
- Scenario-specific triage and caveats.

---

## 7. MODEL ACTIVATION (`FAST-001..FAST-004`)

### FAST-001 | LUNA priority-tier activation

#### Description
Verify that turning Fast Mode on while the LUNA model is active reports enabled and shows the indicator.

#### Scenario Contract
Prompt: `/fast on`

Launch Pi on `openai-codex/gpt-5.6-luna`, turn Fast Mode on, and confirm the notification reads `Fast Mode enabled` with the `fast` indicator visible.

Desired user-visible outcome: the operator sees a clear confirmation that Fast Mode is active for LUNA.

#### Test Execution
> **Feature File:** [FAST-001](model-activation/luna-priority-tier.md)

### FAST-002 | TERRA priority-tier activation

#### Description
Verify that turning Fast Mode on while the TERRA model is active reports enabled and shows the indicator.

#### Scenario Contract
Prompt: `/fast on`

Launch Pi on `openai-codex/gpt-5.6-terra`, turn Fast Mode on, and confirm the notification reads `Fast Mode enabled` with the `fast` indicator visible.

Desired user-visible outcome: the operator sees a clear confirmation that Fast Mode is active for TERRA.

#### Test Execution
> **Feature File:** [FAST-002](model-activation/terra-priority-tier.md)

### FAST-003 | SOL priority-tier activation

#### Description
Verify that turning Fast Mode on while the SOL model is active reports enabled and shows the indicator.

#### Scenario Contract
Prompt: `/fast on`

Launch Pi on `openai-codex/gpt-5.6-sol`, turn Fast Mode on, and confirm the notification reads `Fast Mode enabled` with the `fast` indicator visible.

Desired user-visible outcome: the operator sees a clear confirmation that Fast Mode is active for SOL.

#### Test Execution
> **Feature File:** [FAST-003](model-activation/sol-priority-tier.md)

### FAST-004 | Off-target model stays inactive

#### Description
Verify that turning Fast Mode on while a non-target model is active shows a warning that it has no effect and hides the indicator.

#### Scenario Contract
Prompt: `/fast on`

Launch Pi on `opencode-go/deepseek-v4-flash`, turn Fast Mode on, and confirm the warning notification reads `Fast Mode has no effect on the current model. It applies only to the configured OpenAI GPT models.` with no `fast` indicator.

Desired user-visible outcome: the operator is warned that Fast Mode will not apply to the current model, so nothing feels silently broken.

#### Test Execution
> **Feature File:** [FAST-004](model-activation/off-target-model-inactive.md)

---

## 8. TOGGLE AND NOTIFICATION (`FAST-005..FAST-007`)

### FAST-005 | Toggle cycles state

#### Description
Verify that bare `/fast` flips Fast Mode between on and off with matching notifications each time.

#### Scenario Contract
Prompt: `/fast`

On a LUNA session, run `/fast` twice and confirm the state and notification alternate between enabled and disabled.

Desired user-visible outcome: each toggle gives an unambiguous confirmation of the new state.

#### Test Execution
> **Feature File:** [FAST-005](toggle-and-notification/toggle-cycles-state.md)

### FAST-006 | Explicit on then off

#### Description
Verify that `/fast on` then `/fast off` report enabled then disabled.

#### Scenario Contract
Prompt: `/fast on` then `/fast off`

Run the explicit forms in sequence and confirm each notification and the hidden indicator after off.

Desired user-visible outcome: explicit commands produce explicit, correct confirmations.

#### Test Execution
> **Feature File:** [FAST-006](toggle-and-notification/explicit-on-off.md)

### FAST-007 | Invalid argument shows usage

#### Description
Verify that an unrecognized argument reports the usage string and does not change state.

#### Scenario Contract
Prompt: `/fast status`

Run an invalid argument and confirm the `Usage: /fast [on|off|toggle]` error notification with unchanged state.

Desired user-visible outcome: a typo is caught with a helpful message and no surprise state change.

#### Test Execution
> **Feature File:** [FAST-007](toggle-and-notification/invalid-argument-usage.md)

---

## 9. PERSISTENCE AND STARTUP (`FAST-008..FAST-009`)

### FAST-008 | Fast startup flag

#### Description
Verify that launching Pi with `--fast` starts a target-model session with Fast Mode already on.

#### Scenario Contract
Prompt: `bash: pi --model openai-codex/gpt-5.6-luna --fast`

Launch with the flag and confirm Fast Mode is enabled at session start on LUNA.

Desired user-visible outcome: the operator can start a session already in Fast Mode without a manual toggle.

#### Test Execution
> **Feature File:** [FAST-008](persistence-and-startup/fast-startup-flag.md)

### FAST-009 | State persists across restart

#### Description
Verify that Fast Mode state survives quitting and relaunching Pi in the same project.

#### Scenario Contract
Prompt: `/fast on`

Enable Fast Mode, quit Pi, relaunch on the same target model, and confirm it is still enabled.

Desired user-visible outcome: the operator's last choice is remembered on the next session.

#### Test Execution
> **Feature File:** [FAST-009](persistence-and-startup/state-persists-across-restart.md)

---

## 10. SUBAGENT HANDOFF (`FAST-010`)

### FAST-010 | Child inherits the preference

#### Description
Verify that a child Pi process launched with the handoff environment variable set starts with Fast Mode matching the parent.

#### Scenario Contract
Prompt: `bash: PI_FAST_MODE_W_SUBAGENT_SUPPORT=1 pi --model openai-codex/gpt-5.6-luna`

Launch a child process with the handoff variable set to `1` and confirm the child session starts with Fast Mode enabled.

Desired user-visible outcome: a parent that has Fast Mode on hands the same preference to the subagents it spawns.

#### Test Execution
> **Feature File:** [FAST-010](subagent-handoff/child-inherits-preference.md)

---

## 11. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `tests/payload-status.test.ts` | Model matching and `service_tier` payload mutation | FAST-001, FAST-002, FAST-003, FAST-004 |
| `tests/extension.test.ts` | Command handler notifications, indicator, startup flag | FAST-001 through FAST-008 |
| `tests/config.test.ts` | Scope selection and persisted state | FAST-009 |
| `tests/propagation.test.ts` | Handoff propagation to child processes | FAST-010 |

---

## 12. SCENARIO CROSS-REFERENCE INDEX

No feature catalog exists for this extension, so the index below is the authoritative scenario directory.

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| FAST-001 | LUNA priority-tier activation | Model Activation | [FAST-001](model-activation/luna-priority-tier.md) |
| FAST-002 | TERRA priority-tier activation | Model Activation | [FAST-002](model-activation/terra-priority-tier.md) |
| FAST-003 | SOL priority-tier activation | Model Activation | [FAST-003](model-activation/sol-priority-tier.md) |
| FAST-004 | Off-target model stays inactive | Model Activation | [FAST-004](model-activation/off-target-model-inactive.md) |
| FAST-005 | Toggle cycles state | Toggle And Notification | [FAST-005](toggle-and-notification/toggle-cycles-state.md) |
| FAST-006 | Explicit on then off | Toggle And Notification | [FAST-006](toggle-and-notification/explicit-on-off.md) |
| FAST-007 | Invalid argument shows usage | Toggle And Notification | [FAST-007](toggle-and-notification/invalid-argument-usage.md) |
| FAST-008 | Fast startup flag | Persistence And Startup | [FAST-008](persistence-and-startup/fast-startup-flag.md) |
| FAST-009 | State persists across restart | Persistence And Startup | [FAST-009](persistence-and-startup/state-persists-across-restart.md) |
| FAST-010 | Child inherits the preference | Subagent Handoff | [FAST-010](subagent-handoff/child-inherits-preference.md) |
