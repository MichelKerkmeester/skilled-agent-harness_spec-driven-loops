---
title: "DR-020 -- Quality Guard — Source Diversity"
description: "Verify that convergence STOP is blocked when an answered question cites <2 independent sources."
---

# DR-020 -- Quality Guard — Source Diversity

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-020`.

---

## 1. OVERVIEW

This scenario validates the source diversity quality guard for `DR-020`. The objective is to verify that convergence STOP is blocked when an answered question cites fewer than two independent sources.

### WHY THIS MATTERS

A convergence decision based on thinly sourced answers creates a false sense of completeness. The source diversity guard ensures that no question is considered answered unless at least two independent sources support it, preventing shallow research from being accepted as done.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that convergence STOP is blocked when an answered question cites <2 independent sources.
- Real user request: How does the loop prevent shallow answers that rely on a single source?
- Prompt: `Validate source-diversity guards override STOP when answered questions lack independent sources.`
- Expected execution process: Inspect the Quality Guard Protocol in the convergence reference first, then the YAML algorithm guard check, then the loop protocol Step 2c, then the state format guard_violation event schema.
- Desired user-visible outcome: The user gets an accurate explanation of how single-source answers are caught and why the loop continues past them.
- Expected signals: guard_violation event logged with guard="source_diversity", STOP decision overridden to CONTINUE, violated question targeted in next iteration focus.
- Pass/fail posture: PASS if the source_diversity guard rule (>= 2 independent sources), its violation logging, and its STOP-override behavior are consistent across convergence.md, loop_protocol.md, auto.yaml, and state_format.md; FAIL if any of those elements drift or contradict.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate source-diversity guards override STOP when answered questions lack independent sources.
### Commands
1. `bash: sed -n '104,139p' .opencode/skills/deep-research/references/convergence/convergence.md`
2. `bash: rg -n 'source_diversity\|guard_violation\|collectSources' .opencode/skills/deep-research/references/convergence/convergence.md`
3. `bash: sed -n '97,107p' .opencode/skills/deep-research/references/protocol/loop_protocol.md`
4. `bash: rg -n 'guard_violation\|source_diversity' .opencode/skills/deep-research/references/state/state_format.md`
5. `bash: sed -n '236,243p' .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`
### Expected
guard_violation event logged with guard="source_diversity", STOP decision overridden to CONTINUE, violated question targeted in next iteration focus.
### Evidence
Capture the guard rule table row for Source Diversity, the pseudocode branch for len(sources) < 2, the YAML override logic, and the state_format event schema example.
### Pass/Fail
PASS if the source_diversity guard rule (>= 2 independent sources), its violation logging, and its STOP-override behavior are consistent across convergence.md, loop_protocol.md, auto.yaml, and state_format.md; FAIL if any of those elements drift or contradict.
### Failure Triage
Privilege convergence.md §2.4 for the canonical guard definition; use loop_protocol.md Step 2c and auto.yaml step_check_convergence as secondary confirmation of the override flow.
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
| `.opencode/skills/deep-research/references/convergence/convergence.md` | Canonical quality guard definitions; use §2.4 Quality Guard Protocol |
| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Loop orchestration; use Step 2c: Quality Guard Check |
| `.opencode/skills/deep-research/references/state/state_format.md` | JSONL event schema; use guard_violation event definition and sourceStrength field |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` guard override logic |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/020-quality-guard-source-diversity.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/deep-research/` as of 2026-03-19.
