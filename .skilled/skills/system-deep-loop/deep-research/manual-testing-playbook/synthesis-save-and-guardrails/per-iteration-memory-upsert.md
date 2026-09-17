---
title: "DR-062 -- Per-iteration lineage context refresh"
description: "Verify that each completed iteration is persisted lineage-locally and refreshed into the next prompt context."
version: 1.14.0.22
---

# DR-062 -- Per-iteration lineage context refresh

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-062`.

---

## 1. OVERVIEW

This scenario validates the per-iteration lineage context refresh for `DR-062`. The objective is to verify that each completed iteration is durable in the lineage directory before final synthesis and that the next prompt is built from the state the reducer just rewrote.

### WHY THIS MATTERS

Long loops can be interrupted. Because iteration evidence lands in the lineage directory as it is produced, an interrupted run keeps everything it validated, with nothing waiting on an external index.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that each completed iteration is persisted lineage-locally and refreshed into the next prompt context.
- Real user request: Make sure mid-run findings survive an interrupted loop and reach the next prompt.
- Prompt: `Validate lineage context refresh ordering and non-fatal state-read behavior.`
- Expected execution process: Inspect auto YAML step ordering, the state files the refresh reads, the non-fatal error policy, and unit tests.
- Desired user-visible outcome: The user is told that completed iteration evidence is durable as it is produced and that a state-read failure does not kill the loop.
- Expected signals: `step_reduce_state` and `step_graph_upsert` run before `step_refresh_lineage_context`, which runs before result evaluation, and state-read failures are advisory.
- Pass/fail posture: PASS if the refresh reads reducer-owned lineage state and fails non-fatally; FAIL if the next prompt depends on any index, daemon or network call.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate lineage context refresh ordering and non-fatal state-read behavior.
### Commands
1. `bash: rg -n 'step_reduce_state|step_graph_upsert|step_refresh_lineage_context|lineage_context_prompt_line|non-fatal' .opencode/commands/deep/assets/deep-research-auto.yaml`
2. `bash: sed -n '55,95p' .opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts`
### Expected
The workflow refreshes the context line from the reducer-owned dashboard, registry and strategy files before the next prompt, and treats a missing or unreadable state file as a non-fatal advisory condition.
### Evidence
Capture step order, the state files read, prompt-line injection, and unit-test assertions for non-fatal behavior.
### Pass/Fail
PASS if the refresh is ordered before next prompt construction and failures do not halt the loop; FAIL if it reaches outside the lineage directory.
### Failure Triage
Privilege the auto YAML for live ordering and the unit test for required step sequence.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature-catalog/loop-lifecycle/per-iteration-memory-upsert.md` | Matching feature catalog entry |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Lineage context refresh step and the prompt line it feeds |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts` | Unit coverage for step ordering, state reads, and advisory errors |

---

## 5. SOURCE METADATA

- Group: SYNTHESIS, SAVE, AND GUARDRAILS
- Playbook ID: DR-062
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `synthesis-save-and-guardrails/per-iteration-memory-upsert.md`
- Feature catalog: `feature-catalog/loop-lifecycle/per-iteration-memory-upsert.md`
