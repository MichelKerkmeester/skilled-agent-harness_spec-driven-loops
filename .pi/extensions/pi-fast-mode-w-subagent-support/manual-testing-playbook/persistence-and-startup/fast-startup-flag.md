---
title: "FAST-008 -- Fast startup flag"
description: "This scenario validates the startup flag for `FAST-008`. It focuses on confirming that launching with `--fast` starts a target-model session already in Fast Mode."
stage: routing
version: 1.0.0.0
---

# FAST-008 -- Fast startup flag

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FAST-008`.

---

## 1. OVERVIEW

This scenario validates the startup flag for `FAST-008`. It focuses on confirming that launching Pi with `--fast` on a LUNA model starts the session with Fast Mode already enabled and the indicator visible.

### Why This Matters

Operators who always want the priority tier for a model should not have to toggle it every session. The `--fast` flag makes that a one-line launch.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FAST-008` and confirm the expected signals without contradictory evidence.

- Objective: confirm `--fast` enables Fast Mode at session start on a target model.
- Real user request: `Start Pi already in fast mode on Luna.`
- Prompt: `bash: pi --model openai-codex/gpt-5.6-luna --fast`
- Expected execution process: launch with the flag and observe the initial session state without running any command.
- Expected signals: at session start the `fast` indicator is visible and the persisted state reads enabled. The startup path shows the indicator only, not a chat notification, since notifications fire on the `/fast` command.
- Desired user-visible outcome: the session opens already in Fast Mode.
- Pass/fail: PASS if the `fast` indicator is visible at startup on LUNA and the state file reads enabled; FAIL if the indicator is absent or the state is disabled.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: launch already in Fast Mode.
2. Run the launch command with the flag.
3. Observe the initial indicator without typing anything.
4. Confirm the persisted state.
5. Record the indicator visibility and state file content.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAST-008 | Fast startup flag | Verify `--fast` enables at startup on LUNA | `bash: pi --model openai-codex/gpt-5.6-luna --fast` | 1. `bash: pi --model openai-codex/gpt-5.6-luna --fast` -> 2. observe the session without input | Step 1: Pi starts on LUNA; Step 2: the `fast` indicator is visible and no `/fast` command was needed | Indicator screenshot at startup and the state file content | PASS if the indicator is visible at startup and `.pi/pi-fast-mode-w-subagent-support-config.json` reads `enabled: true`; FAIL if the indicator is absent or the state is `false` | 1. Confirm the launch used `--fast`. 2. Confirm the active model is `openai-codex/gpt-5.6-luna`, so the indicator is expected. 3. Read the state file and confirm `enabled` is `true`. |

### Optional Supplemental Checks

Launch the same command against `opencode-go/deepseek-v4-flash --fast` and confirm the state reads enabled but the indicator is hidden, matching the off-target rule.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../src/index.ts` | Session-start flag resolution and indicator update |
| `../../tests/extension.test.ts` | Regression anchor for the `--fast` startup path |

---

## 5. SOURCE METADATA

- Group: Persistence And Startup
- Playbook ID: FAST-008
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `persistence-and-startup/fast-startup-flag.md`
