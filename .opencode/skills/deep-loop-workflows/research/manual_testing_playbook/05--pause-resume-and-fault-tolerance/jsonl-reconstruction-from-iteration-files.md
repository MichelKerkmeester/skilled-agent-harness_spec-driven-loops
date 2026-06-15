---
title: "DR-018 -- JSONL reconstruction from iteration files"
description: "Verify that missing or unusable JSONL can be reconstructed from `iteration-NNN.md` files."
---

# DR-018 -- JSONL reconstruction from iteration files

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-018`.

---

## 1. OVERVIEW

This scenario validates jsonl reconstruction from iteration files for `DR-018`. The objective is to verify that missing or unusable JSONL can be reconstructed from `iteration-NNN.md` files.

### WHY THIS MATTERS

Reconstruction is the deeper recovery path that keeps a session salvageable after the structured log is lost.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that missing or unusable JSONL can be reconstructed from `iteration-NNN.md` files.
- Real user request: If the JSONL is unusable but the iteration files still exist, tell me whether the workflow can rebuild state.
- Prompt: `Validate JSONL state can be reconstructed from iteration-NNN.md files and logged.`
- Expected execution process: Inspect the state-format reconstruction section first, then the event schema, then the command troubleshooting and error-handling language.
- Desired user-visible outcome: The user is told that iteration files can be used to rebuild enough state to continue or synthesize.
- Expected signals: The reconstruction algorithm scans iteration files, extracts assessment data, writes reconstructed records, and logs a `state_reconstructed` event.
- Pass/fail posture: PASS if iteration-file reconstruction is explicitly documented and evented; FAIL if recovery is implied but not specified well enough to execute.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate JSONL state can be reconstructed from iteration-NNN.md files and logged.
### Commands
1. `bash: rg -n 'State Recovery from Iteration Files|state_reconstructed|iterationsRecovered' .opencode/skills/deep-loop-workflows/research/references/state/state_format.md`
2. `bash: rg -n 'State file missing|Reconstruct from iteration files' .opencode/commands/speckit/deep-research.md .opencode/skills/deep-loop-workflows/research/README.md`
3. `bash: rg -n 'iteration-{NNN}|reconstructed' .opencode/skills/deep-loop-workflows/research/references/state/state_format.md .opencode/skills/deep-loop-workflows/research/references/convergence/convergence.md`
### Expected
The reconstruction algorithm scans iteration files, extracts assessment data, writes reconstructed records, and logs a `state_reconstructed` event.
### Evidence
Capture the reconstruction steps, the emitted event, and the command or README references to recovery from iteration files.
### Pass/Fail
PASS if iteration-file reconstruction is explicitly documented and evented; FAIL if recovery is implied but not specified well enough to execute.
### Failure Triage
Use the detailed state-format reconstruction algorithm as primary truth and treat command/README references as supporting evidence only.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `deep-research`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/research/references/state/state_format.md` | Reconstruction algorithm and event schema; use `ANCHOR:state-log` |
| `.opencode/commands/speckit/deep-research.md` | Error handling summary; use `## 10. ERROR HANDLING` |
| `.opencode/skills/deep-loop-workflows/research/README.md` | Troubleshooting and FAQ recovery language; use `ANCHOR:troubleshooting` and `ANCHOR:faq` |
| `.opencode/skills/deep-loop-workflows/research/references/convergence/convergence.md` | Valid-entry behavior during convergence; use `ANCHOR:signal-definitions` |

---

## 5. SOURCE METADATA

- Group: PAUSE, RESUME, AND FAULT TOLERANCE
- Playbook ID: DR-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--pause-resume-and-fault-tolerance/jsonl-reconstruction-from-iteration-files.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/deep-loop-workflows/research/` as of 2026-03-19.
