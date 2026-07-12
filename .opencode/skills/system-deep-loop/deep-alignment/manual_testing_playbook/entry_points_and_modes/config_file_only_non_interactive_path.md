---
title: "DAL-003 -- Config-file-only non-interactive path"
description: "Verify the non-interactive scoping path is --lane-config-only (ADR-011), that scoping.cjs refuses to guess lanes without it, and that the interactive path is a conversational question owned by the invoking command."
version: 1.0.0.0
---

# DAL-003 -- Config-file-only non-interactive path

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-003`.

---

## 1. OVERVIEW

This scenario validates the non-interactive scoping path for `DAL-003`. The objective is to verify that the only non-interactive way to supply lanes is `--lane-config <file.json>` (ADR-011), that `scripts/scoping.cjs`'s CLI refuses to guess lanes when the flag is absent, and that the interactive alternative is a conversational question the invoking command asks (via `resolveLanesFromSelections`), not a terminal prompt loop.

### WHY THIS MATTERS

Headless and cron alignment runs need a reproducible, reviewable lane source. Config-file-only makes the lane set a diffable, versionable file; a silent inline-flag fallback or a lane-guessing default would break reproducibility (NFR-R01). The script must fail loudly, not improvise a scope.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify the non-interactive path is config-file-only and that scoping.cjs errors rather than guessing lanes when --lane-config is absent.
- Real user request: Can I run an unattended alignment sweep from a saved lane file, and what happens if I forget to pass it?
- Prompt: `Validate that deep-alignment's non-interactive scoping path is config-file-only and that scoping.cjs errors rather than guessing lanes when --lane-config is absent.`
- Expected execution process: Read `scoping_protocol.md` §6 and `lane_config_schema.md` §1 for the config-file-only lock, then run `scoping.cjs` with no arguments to confirm it exits non-zero with an explicit message, then confirm `resolveLanesFromSelections` is the interactive fallback the command calls.
- Desired user-facing outcome: The user is told to pass `--lane-config <file.json>` for headless runs, that the script fails with a clear message (not a guessed scope) if it is omitted, and that the interactive alternative is the command asking the three-axis question in conversation.
- Expected signals: `scoping.cjs main()` requires `--lane-config` and exits with an input-validation error (exit `3`) and an explicit message pointing at the interactive fallback when the flag is absent; `scoping_protocol.md` §6 and `lane_config_schema.md` §1 lock the config-file-only rule; `resolveLanesFromSelections()` is the interactive path the invoking command calls, not a readline loop.
- Pass/fail posture: PASS if the missing-flag invocation exits non-zero with the documented message and both references lock config-file-only. FAIL if the script guesses a scope, exits 0, or the references disagree.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the documented lock is checked before the runtime behavior.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate that deep-alignment's non-interactive scoping path is config-file-only and that scoping.cjs errors rather than guessing lanes when --lane-config is absent.
### Commands
1. `bash: rg -n 'lane-config|config-file only|ADR-011|interactive question' .opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md .opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md`
2. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs; echo "exit=$?"`
3. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs --help`
4. `bash: rg -n 'resolveLanesFromSelections|--lane-config <file.json> is required' .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs`
### Expected
Running `scoping.cjs` with no arguments prints the "--lane-config <file.json> is required in the non-interactive path" message and exits `3`; `--help` documents `--lane-config <file.json|->`. The references state the non-interactive path is config-file-only and the interactive fallback is the command's own conversational question resolved via `resolveLanesFromSelections`.
### Evidence
Capture the no-argument stderr message + exit code, the `--help` usage, and the two reference passages locking config-file-only.
### Pass/Fail
PASS if the missing-flag invocation exits non-zero with the documented message and both references lock config-file-only. FAIL if the script guesses a scope, exits 0, or the references disagree.
### Failure Triage
If the no-argument run exits 0 or produces lanes, that is a hard FAIL of the fail-loud contract. If the references and the script message disagree on the fallback, privilege `scoping.cjs`'s actual behavior.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `entry-points-and-modes/` | Entry-point category; the scoping CLI is runnable and exercised directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs` | `main()` requires `--lane-config`; `resolveLanesFromSelections()` is the interactive fallback |
| `.opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md` | §6 config-file-only rule; §5 interactive-path-is-conversational |
| `.opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md` | §1 ADR-011 config-file-only lock |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DAL-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `entry-points-and-modes/config-file-only-non-interactive-path.md`
- Build-state note: The invoking `/deep:alignment` command that would ask the interactive three-axis question is phase-009 work; `scoping.cjs`'s config-file path and `resolveLanesFromSelections()` pure function both exist and are exercised here.
