---
title: "Implementation Plan: bounded command matrix"
description: "Plan for the bounded model matrix and leaf sentinels with explicit skips."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/008-bounded-command-matrix"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the matrix child measuring executor variance across scenarios"
    next_safe_action: "Build or verify alignment fan-out wiring before running matrix cells"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: bounded command matrix

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run a bounded matrix of two GPT drivers over the scenario suite plus leaf sentinels with explicit skips and contested reruns, building or verifying fan-out wiring first.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The matrix manifest accounts for every required cell as result or predeclared skip.
- Contested cells use the three-sample rerun.
- Fixture hashes match before every cell.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

A thin scheduler invokes the behavior runner once per manifest cell, restores fixtures between cells, and records explicit skips. Drivers are the Claude baseline plus one high-effort and one fast GPT model; leaf sentinels cover a few workflow scenarios. The scheduler owns no scoring and defers cli-opencode alignment leaves.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Fan-out wiring
Build or verify the alignment fan-out wiring needed to run matrix cells, since it is not shipped today.

### Phase 2: Matrix execution
Run the drivers and leaf sentinels across the suite with explicit skips and contested reruns.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Confirm the manifest accounts for every cell as result or predeclared skip, contested cells use the three-sample rerun, and fixture hashes match before every cell.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The scenario suite, the behavior runner, and the fan-out runtime.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Matrix results and the scheduler are additive, so rollback is removing them; any fan-out wiring is gated behind a flag until verified. Scenarios and baselines are unaffected.
<!-- /ANCHOR:rollback -->
