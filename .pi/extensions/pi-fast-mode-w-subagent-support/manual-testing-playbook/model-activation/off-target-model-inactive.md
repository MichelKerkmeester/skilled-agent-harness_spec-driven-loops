---
title: "FAST-004 -- Off-target model stays inactive"
description: "This scenario validates the off-target warning for `FAST-004`. It focuses on confirming that enabling Fast Mode on a non-target model shows a warning that it has no effect and shows no indicator."
stage: routing
version: 1.0.1.0
---

# FAST-004 -- Off-target model stays inactive

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FAST-004`.

---

## 1. OVERVIEW

This scenario validates the off-target warning for `FAST-004`. It focuses on confirming that enabling Fast Mode while a non-target model is active shows a warning notification, `Fast Mode has no effect on the current model. It applies only to the configured OpenAI GPT models.`, and shows no `fast` indicator.

### Why This Matters

Fast Mode only affects configured OpenAI and OpenAI-Codex targets. Without the warning, an operator on a model like DeepSeek Flash would see a plain confirmation and wrongly assume the priority tier applies. The warning-level message makes the no-op visible instead of silent.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FAST-004` and confirm the expected signals without contradictory evidence.

- Objective: confirm Fast Mode shows a warning on a non-target model and shows no indicator.
- Real user request: `I'm on the DeepSeek Flash model. Turn fast mode on.`
- Prompt: `/fast on`
- Expected execution process: launch Pi on a non-target model, enable Fast Mode, and read the notification.
- Expected signals: a warning-level chat notification reading `Fast Mode has no effect on the current model. It applies only to the configured OpenAI GPT models.` and no `fast` indicator.
- Desired user-visible outcome: the operator is warned that Fast Mode will not apply to the current model.
- Pass/fail: PASS if the notification is exactly `Fast Mode has no effect on the current model. It applies only to the configured OpenAI GPT models.` at warning level and no indicator appears; FAIL if it reads plain `Fast Mode enabled`, the level is `info`, the indicator appears, or no notification is shown.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: enable Fast Mode on a non-target model.
2. Keep the scenario local to one live Pi session.
3. Run the deterministic steps exactly as written.
4. Confirm the warning names the no-op and no indicator appears.
5. Record the notification text and level.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAST-004 | Off-target model stays inactive | Verify the off-target warning on a non-target model | `/fast on` | 1. `bash: pi --model opencode-go/deepseek-v4-flash` -> 2. `pi> /fast on` | Step 1: Pi starts on `opencode-go/deepseek-v4-flash`; Step 2: warning notification `Fast Mode has no effect on the current model. It applies only to the configured OpenAI GPT models.` and no `fast` indicator | Notification text, notification level, and the active model label | PASS if the notification is exactly `Fast Mode has no effect on the current model. It applies only to the configured OpenAI GPT models.` at warning level and no indicator appears; FAIL if it reads plain `Fast Mode enabled`, is `info` level, the indicator appears, or no notification is shown | 1. Confirm the active model is `opencode-go/deepseek-v4-flash` and is not in the configured targets. 2. Confirm the same command on a LUNA session instead reads plain `Fast Mode enabled` at info level (FAST-001). 3. Read `.pi/pi-fast-mode-w-subagent-support-config.json`: `enabled` is `true` even though the model is off-target. |

### Optional Supplemental Checks

Switch to a LUNA model in the same session with Ctrl+P and run `/fast` again to confirm the plain `Fast Mode enabled` message and the indicator then appear, proving the difference is model-driven.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../src/index.ts` | Command handler that chooses the active, disabled, or off-target warning message |
| `../../src/status.ts` | Indicator visibility rule based on target match |
| `../../tests/extension.test.ts` | Regression anchor for the off-target warning |

---

## 5. SOURCE METADATA

- Group: Model Activation
- Playbook ID: FAST-004
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `model-activation/off-target-model-inactive.md`
