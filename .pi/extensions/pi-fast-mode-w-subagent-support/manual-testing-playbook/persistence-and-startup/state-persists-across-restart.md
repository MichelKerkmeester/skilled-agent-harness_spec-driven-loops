---
title: "FAST-009 -- State persists across restart"
description: "This scenario validates persistence for `FAST-009`. It focuses on confirming that Fast Mode state survives quitting and relaunching Pi in the same project."
stage: routing
version: 1.0.0.0
---

# FAST-009 -- State persists across restart

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FAST-009`.

---

## 1. OVERVIEW

This scenario validates persistence for `FAST-009`. It focuses on confirming that enabling Fast Mode, quitting Pi, and relaunching on the same target model leaves Fast Mode enabled.

### Why This Matters

Operators expect their last choice to be remembered. If state resets on every launch, the mode feels unreliable and the flag has to be set every time.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FAST-009` and confirm the expected signals without contradictory evidence.

- Objective: confirm Fast Mode state survives a restart.
- Real user request: `I turned fast mode on earlier. It should still be on when I reopen Pi here.`
- Prompt: `/fast on`
- Expected execution process: enable Fast Mode, quit Pi, relaunch on the same target model in the same project, and read the initial state.
- Expected signals: after relaunch the `fast` indicator is visible and the state file reads enabled, with no manual toggle.
- Desired user-visible outcome: the last state is remembered on the next session.
- Pass/fail: PASS if the relaunched session shows the indicator and the state file reads enabled; FAIL if the relaunch starts disabled.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: keep the mode across restarts.
2. Enable Fast Mode on a LUNA session.
3. Quit Pi.
4. Relaunch on the same model and project without the `--fast` flag.
5. Confirm the initial state and record it.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAST-009 | State persists across restart | Verify Fast Mode survives a restart | `/fast on` | 1. `bash: pi --model openai-codex/gpt-5.6-luna` -> 2. `pi> /fast on` -> 3. `key: Ctrl+C` -> 4. `bash: pi --model openai-codex/gpt-5.6-luna` | Step 2: `Fast Mode enabled` and indicator appears; Step 4: on relaunch the indicator is visible with no toggle | The state file content before quit and after relaunch, and the relaunch indicator | PASS if the relaunched session shows the indicator and `.pi/pi-fast-mode-w-subagent-support-config.json` reads `enabled: true`; FAIL if the relaunch starts disabled | 1. Confirm both launches used the same project working directory. 2. Read `.pi/pi-fast-mode-w-subagent-support-config.json` after Step 2 and confirm `enabled: true` was written. 3. Confirm the relaunch did not pass `--fast`, so the enabled state came from persistence. |

### Optional Supplemental Checks

Disable Fast Mode, quit, and relaunch to confirm the disabled state also persists, proving persistence is not one-directional.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../src/config.ts` | Scope selection and atomic state persistence |
| `../../src/index.ts` | Session-start load of persisted state |
| `../../tests/config.test.ts` | Regression anchor for load and save |

---

## 5. SOURCE METADATA

- Group: Persistence And Startup
- Playbook ID: FAST-009
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `persistence-and-startup/state-persists-across-restart.md`
