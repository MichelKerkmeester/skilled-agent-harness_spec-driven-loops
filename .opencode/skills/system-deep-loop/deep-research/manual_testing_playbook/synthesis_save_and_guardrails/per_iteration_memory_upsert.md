---
title: "DR-062 -- Per-iteration memory upsert"
description: "Verify that each completed iteration is upserted to memory and refreshed into the next prompt context."
version: 1.14.0.21
---

# DR-062 -- Per-iteration memory upsert

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-062`.

---

## 1. OVERVIEW

This scenario validates per-iteration memory upsert for `DR-062`. The objective is to verify that each completed iteration can be indexed before final synthesis and that the next prompt can use refreshed memory context.

### WHY THIS MATTERS

Long loops can be interrupted. Incremental memory upserts preserve validated iteration evidence even when the final save has not run yet.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that each completed iteration is upserted to memory and refreshed into the next prompt context.
- Real user request: Make sure mid-run findings reach memory before the final synthesis save.
- Prompt: `Validate per-iteration memory upsert ordering and non-fatal memory context refresh behavior.`
- Expected execution process: Inspect auto YAML step ordering, memory-save invocation, context-refresh invocation, non-fatal error policy, and unit tests.
- Desired user-visible outcome: The user is told that completed iteration evidence can be indexed incrementally and memory failures do not kill the loop.
- Expected signals: `step_memory_upsert_iteration` runs before `step_refresh_memory_context`, both run before result evaluation, and MCP errors are advisory.
- Pass/fail posture: PASS if iteration memory save and focused context refresh are ordered before the next prompt and fail non-fatally; FAIL if memory indexing waits only for final synthesis.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate per-iteration memory upsert ordering and non-fatal memory context refresh behavior.
### Commands
1. `bash: rg -n 'step_memory_upsert_iteration|step_refresh_memory_context|memory_save\\(|memory_context\\(|memory_context_prompt_line|non-fatal' .opencode/commands/deep/assets/deep_research_auto.yaml`
2. `bash: sed -n '55,95p' .opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts`
### Expected
The workflow upserts the canonical iteration evidence file, refreshes focused memory context before the next prompt, and treats MCP errors or timeouts as non-fatal advisory conditions.
### Evidence
Capture step order, exact MCP invocations, prompt-line injection, and unit-test assertions for non-fatal behavior.
### Pass/Fail
PASS if iteration evidence is indexed before next prompt construction and failures do not halt the loop; FAIL if the only memory save is end-of-run continuity.
### Failure Triage
Privilege the auto YAML for live ordering and the unit test for required step sequence.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature_catalog/loop_lifecycle/per_iteration_memory_upsert.md` | Matching feature catalog entry |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Iteration memory upsert and focused memory-context refresh steps |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts` | Unit coverage for step ordering, invocation, and advisory errors |

---

## 5. SOURCE METADATA

- Group: SYNTHESIS, SAVE, AND GUARDRAILS
- Playbook ID: DR-062
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `synthesis-save-and-guardrails/per-iteration-memory-upsert.md`
- Feature catalog: `feature_catalog/loop_lifecycle/per_iteration_memory_upsert.md`
