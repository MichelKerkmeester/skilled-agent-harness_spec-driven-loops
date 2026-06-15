---
title: "009 deep-loop-runtime convergence yaml fire"
description: "Verify deep-loop command YAML contains live convergence calls before stop voting."
trigger_phrases:
  - "009"
  - "deep loop graph convergence yaml fire"
  - "system-code-graph manual testing"
importance_tier: "normal"
---
# 009 deep-loop-runtime convergence yaml fire

## 1. OVERVIEW

Verify deep-loop command YAML contains live convergence calls before stop voting.

---

## 2. SCENARIO CONTRACT

- Objective: Verify deep-loop command YAML contains live convergence calls before stop voting.
- Real user request: `Review the deep-research and deep-review auto YAML to confirm graph convergence is called before stop voting.`
- Operator prompt: `Inspect the deep-research and deep-review auto YAML convergence paths. Show that graph convergence runs before stop voting, then return PASS/FAIL with file anchors and evidence excerpts.`
- Expected execution process: Read the specified deep-research and deep-review YAML line ranges, then optionally run a minimal deep-loop fixture and capture a graph convergence JSONL event.
- Expected signals: YAML calls `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "<research|review>" --session-id "<session-id>"` before inline stop logic and appends a graph convergence event.
- Desired user-visible outcome: A concise verdict explaining whether deep-loop stop voting is guarded by live graph convergence checks.
- Pass/fail: PASS if both YAML paths call graph convergence before stop logic and event evidence is present when run. FAIL if the call is missing, occurs after stop voting or no convergence event can be observed in the fixture.

---

## 3. TEST EXECUTION

### Commands

1. Read `.opencode/commands/deep/assets/deep_research_auto.yaml:456-467`.
2. Read `.opencode/commands/deep/assets/deep_review_auto.yaml:483-502`.
3. Optionally run a minimal deep-loop fixture and capture graph_convergence JSONL event.

### Expected Output / Verification

YAML calls `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "<research|review>" --session-id "<session-id>"` before inline stop logic and appends a graph convergence event.

### Cleanup

None.

### Variant Scenarios

Check confirm-mode YAML paths for parity.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 009
- Canonical root source: `manual_testing_playbook.md`
