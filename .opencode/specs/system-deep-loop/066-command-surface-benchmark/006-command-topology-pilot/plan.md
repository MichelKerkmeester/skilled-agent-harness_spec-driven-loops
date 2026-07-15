---
title: "Implementation Plan: command topology pilot"
description: "Plan for four topology pilot scenarios and dual-driver calibration."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/006-command-topology-pilot"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the pilot child that calibrates the evaluator across topologies"
    next_safe_action: "Author one pilot scenario per topology and capture a Claude baseline"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: command topology pilot

<!-- ANCHOR:summary -->
## 1. SUMMARY

Author one pilot scenario per topology and calibrate the schema v2 evaluator with a Claude baseline plus one GPT driver before the full rollout.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Four pilot scenarios each produce transcript, schema v2 result, target evidence, post-state, and provenance.
- A pinned Claude baseline exists per pilot.
- No retryable environment failure remains unresolved.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Each pilot scenario pins command path and topology, entry surface, fixture and allowed changed paths, expected and forbidden targets, named postcondition probes, presentation markers with source hash, and a baseline budget row. The runner executes each scenario per driver and stores results in the executing spec phase.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scenario authoring
Author four pilot scenarios, one per topology, on framework schema v2.

### Phase 2: Dual-driver capture
Capture a pinned Claude baseline and one GPT driver run per pilot and reconcile the evidence.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run each pilot scenario under Claude and one GPT driver and confirm every scenario yields a complete evidence set with resolved environment status.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The schema v2 evaluator, the behavior runner, and the frozen census and topology taxonomy.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Pilot scenarios and results are additive files, so rollback is removing them. The evaluator and framework are unaffected.
<!-- /ANCHOR:rollback -->
