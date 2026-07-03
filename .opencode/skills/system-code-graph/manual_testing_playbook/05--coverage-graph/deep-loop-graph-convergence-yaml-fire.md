---
title: "009 deep-loop-runtime convergence yaml fire"
description: "Verify deep-loop command YAML contains live convergence calls before stop voting."
trigger_phrases:
  - "009"
  - "deep loop graph convergence yaml fire"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.8
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

---

## 6. EVIDENCE

Command 1: Read `.opencode/commands/deep/assets/deep_research_auto.yaml:456-467`.

```text
456:           if (appended) {
457:             try {
458:               appendObservabilityEvent(observabilityPath, row, {
459:                 producer: 'deep-research-auto',
460:                 stream: 'single-loop-telemetry',
461:                 subject: { label: row.label, sessionId, generation },
462:                 event: row.event,
463:                 status: 'running',
464:               });
465:             } catch {}
466:           }
467:           EOF
```

Command 2: Read `.opencode/commands/deep/assets/deep_review_auto.yaml:483-502`.

```text
483: 
484:       step_read_state:
485:         action: "Read current state from JSONL, strategy, and config"
486:         read:
487:           - "{state_paths.state_log}"
488:           - "{state_paths.findings_registry}"
489:           - "{state_paths.strategy}"
490:           - "{state_paths.config}"
491:         extract:
492:           - iteration_count: "Count lines where type === 'iteration'"
493:           - current_iteration: "iteration_count + 1"
494:           - last_newFindingsRatio: "Extract newFindingsRatio from last iteration record"
495:           - last_focus: "Extract focus/dimension from latest iteration record, else 'none yet'"
496:           - ratio_prev: "Extract newFindingsRatio from second-latest iteration record, else 'N/A'"
497:           - ratio_latest: "Extract newFindingsRatio from latest iteration record, else 'N/A'"
498:           - next_dimension: "Next uncovered dimension from dimension_queue in strategy.md"
499:           - dimensions_covered: "List of dimensions already reviewed"
500:           - dimensions_remaining: "List of dimensions not yet reviewed"
501:           - dimension_coverage: "covered / total dimensions"
502:           - coverage_age: "Iterations since dimension coverage last changed; require >= 1 before STOP"
```

Command 3: Optionally run a minimal deep-loop fixture and capture graph_convergence JSONL event.

```text
Not run. The fixture step is optional in this scenario, and the session write constraint allows modifying only .opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/deep-loop-graph-convergence-yaml-fire.md.
```

---

## 7. PASS/FAIL

FAIL

The specified YAML ranges did not show `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "<research|review>" --session-id "<session-id>"` before inline stop logic, so the Expected Output / Verification condition was not met.
