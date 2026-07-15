---
title: "Tasks: command topology pilot"
description: "Task breakdown for the four-topology pilot."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/006-command-topology-pilot"
    last_updated_at: "2026-07-15T10:01:39Z"
    last_updated_by: "codex"
    recent_action: "Completed scenario and fixture authoring for the four-topology pilot"
    next_safe_action: "Capture the deferred Claude and GPT pilot legs after operator green-light"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command topology pilot

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. Authoring is complete; live capture and calibration remain open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Author the workflow-router and subaction-router pilot scenarios. Evidence: `DAB-012` and `DAB-013`; parseScenario schema_version 2; 2/2 dedicated fixtures.
- [x] T002 — Author the direct-tool or plugin and monolithic pilot scenarios. Evidence: `DAB-014` and `DAB-015`; parseScenario schema_version 2; 4/4 total contracts parsed.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Capture a pinned Claude baseline for each pilot scenario. Evidence: four baseline results with provenance. DEFERRED — live executor capture pending operator green-light.
- [ ] T004 — Capture one GPT driver run per pilot scenario. Evidence: four GPT driver results with provenance. DEFERRED — live executor capture pending operator green-light.
- [ ] T005 — Reconcile Claude and GPT evidence for calibration. Evidence: evidence sets agree on target and boundary classification. DEFERRED — live executor capture pending operator green-light.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Confirm no retryable environment failure remains unresolved. Evidence: all pilot cells produce quotable results. DEFERRED — live executor capture pending operator green-light.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Four pilot scenarios each produce complete evidence, a pinned Claude baseline and one GPT run per pilot are captured, and calibration reconciles cleanly.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 005-command-behavior-evaluator. Successor: 007-command-scenario-rollout.
<!-- /ANCHOR:cross-refs -->
