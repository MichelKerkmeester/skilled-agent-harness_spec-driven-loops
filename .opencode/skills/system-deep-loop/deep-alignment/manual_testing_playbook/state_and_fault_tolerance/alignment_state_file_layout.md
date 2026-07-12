---
title: "DAL-029 -- alignment/ state-file layout and file protection"
description: "Verify the alignment/ state-file layout and the config-template fileProtection contract: config immutable, corpus auto-generated, state JSONL append-only, registry + report reducer-owned, lock operator-controlled — and that a separate corpus file exists because lanes are per-run."
version: 1.0.0.0
---

# DAL-029 -- alignment/ state-file layout and file protection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-029`.

---

## 1. OVERVIEW

This scenario validates the `alignment/` state-file layout for `DAL-029`. The objective is to verify that `state_machine_wiring.md` §3 documents the full `alignment/` layout (config, corpus, state.jsonl, findings-registry, report, lock, plus `iterations/`, `deltas/`, `prompts/`, `dispatch-receipts/`) and that the config-template `fileProtection` block marks each canonical file with its protection class — config `immutable`, corpus `auto-generated`, state.jsonl `append-only`, registry/report `auto-generated`, lock `operator-controlled` — and that a separate `deep-alignment-corpus.json` exists precisely because lanes are resolved per-run (unlike deep-review's fixed dimensions), keeping the frozen config's "immutable" protection honest.

### WHY THIS MATTERS

The file-protection contract is what keeps the state model coherent: the config must not be mutated after SCOPE freezes it, the state log must only be appended to, and the reducer-owned outputs must not be hand-edited. The separate corpus file is the design choice that lets the config stay frozen while per-run discovery results are persisted elsewhere.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify the alignment/ layout and the fileProtection contract, including why a separate corpus file exists.
- Real user request: What files does a run create, and which ones are safe to hand-edit?
- Prompt: `Validate the deep-alignment alignment/ state-file layout and fileProtection contract from state_machine_wiring.md and the config template.`
- Expected execution process: Read `state_machine_wiring.md` §3's layout tree, then the config template's `fileProtection` block, then §3's note on why the corpus file has no deep-review analog; cross-check the file names the reducer and convergence scripts actually read/write.
- Desired user-facing outcome: The user is told the exact `alignment/` files a run produces, which are frozen/append-only/auto-generated, and that the corpus file exists because lanes are per-run.
- Expected signals: `state_machine_wiring.md` §3 documents the `alignment/` layout (config, corpus, state.jsonl, findings-registry, report, lock, iterations/, deltas/, prompts/, dispatch-receipts/); the config template's `fileProtection` block marks config `immutable`, corpus `auto-generated`, state.jsonl `append-only`, registry/report `auto-generated`, lock `operator-controlled`; `deep-alignment-corpus.json` has no deep-review analog because lanes are resolved per-run.
- Pass/fail posture: PASS if the documented layout and the config-template fileProtection block agree on the canonical files and their protection classes. FAIL if a canonical file is undocumented or its protection class is inconsistent between the two sources.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the documented layout is checked before the config-template protection block.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-alignment alignment/ state-file layout and fileProtection contract from state_machine_wiring.md and the config template.
### Commands
1. `bash: sed -n '39,62p' .opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md`
2. `bash: rg -n 'fileProtection|immutable|auto-generated|append-only|operator-controlled' .opencode/skills/system-deep-loop/deep-alignment/assets/deep_alignment_config_template.json`
3. `bash: rg -n 'deep-alignment-corpus.json has no literal analog|resolved per-run|keeps.*immutable.*honest' .opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md`
4. `bash: rg -n 'deep-alignment-config.json|deep-alignment-corpus.json|deep-alignment-state.jsonl|deep-alignment-findings-registry.json|alignment-report.md' .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs`
### Expected
§3's layout tree lists all canonical files and subdirectories; the config template's `fileProtection` block marks config `immutable`, corpus `auto-generated`, state.jsonl `append-only`, registry/report `auto-generated`, lock `operator-controlled`; §3 explains the corpus file exists because lanes are per-run (no deep-review analog); the reducer and convergence scripts reference the same canonical filenames.
### Evidence
Capture the §3 layout tree, the config-template fileProtection block, the per-run-corpus rationale, and the matching filenames in the scripts.
### Pass/Fail
PASS if the documented layout and the config-template fileProtection block agree on the canonical files and their protection classes. FAIL if a canonical file is undocumented or its protection class is inconsistent between the two sources.
### Failure Triage
If a filename in `fileProtection` does not appear in §3's layout (or vice versa), that inconsistency is the finding. If the scripts read/write a canonical file not covered by `fileProtection`, flag the gap.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `state-and-fault-tolerance/` | State category; the documented layout and config-template protection block are cross-checked here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md` | §3 `alignment/` layout; per-run-corpus rationale |
| `.opencode/skills/system-deep-loop/deep-alignment/assets/deep_alignment_config_template.json` | `fileProtection` protection classes |
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` | Reads/writes the canonical file names |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs` | Reads the canonical state-log/corpus names |

---

## 5. SOURCE METADATA

- Group: STATE AND FAULT TOLERANCE
- Playbook ID: DAL-029
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `state-and-fault-tolerance/alignment-state-file-layout.md`
- Note: `prompts/` and `dispatch-receipts/` are documented as phase-009-populated (the command layer); their absence in a script-only fixture is expected, not a defect.
