---
title: "Implementation Plan: bounded command matrix"
description: "Plan and current state for the bounded matrix machinery with operator-gated live capture."
status: in-progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/008-bounded-command-matrix"
    last_updated_at: "2026-07-15T11:58:18Z"
    last_updated_by: "codex"
    recent_action: "Built bounded scheduler, 52-cell manifest, and hermetic reconciliation gate"
    next_safe_action: "Run operator-approved live driver cells, then contested reruns"
    blockers:
      - "Live capture requires operator green-light"
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: bounded command matrix

<!-- ANCHOR:summary -->
## 1. SUMMARY

The bounded 52-cell matrix and thin scheduler are implemented. Current reconciliation uses 48 operator-gated driver skips and four alignment-gap leaf skips; live capture and evidence-driven contested reruns remain open.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The matrix manifest accounts for every required cell as result or predeclared skip.
- Contested cells use the three-sample rerun.
- Fixture hashes match before every cell.
- The hermetic suite exercises result, skip, mismatch, and three-sample paths without a live executor.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

A thin scheduler verifies the scenario contract and the runner-compatible per-file fixture hash map before it records a skip or invokes the behavior runner. Runnable cells restore their fixture, call the frozen runner, and reconcile its declared result pointer. Drivers are the Claude baseline plus one high-effort and one fast GPT leg. Four representative alignment leaf profiles are sentinels on DAB-012 and remain explicit skips because alignment fan-out is absent. The scheduler does not import runner internals.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Fan-out wiring
Verified the wiring gap at `fanout-run.cjs:339`: only `research` and `review` are active fan-out loop types. Live alignment leaf fan-out is outside this deferred-live phase.

### Phase 2: Matrix machinery
Implemented the 52-cell manifest, scheduler, fixture guards, retry handling, result reconciliation, and hermetic test.

### Phase 3: Live matrix execution
After operator approval, flip the driver cells to result pointers, run them serially, enable alignment leaf cells only after fan-out is wired and tested, and rerun only contested cells with three samples.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The phase-owned `node --test` suite proves exact production enumeration, all-skip exit 0, an end-to-end hermetic result through `BEHAVIOR_BENCH_SPAWN_JSON`, fixture mismatch blocking, and the three-sample path. The production G008 command separately reconciles all 52 deferred cells with exit 0.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The scenario suite, the behavior runner, and the fan-out runtime.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The scheduler, manifest, and test are additive, so rollback is removing those three files and reverting this phase's documentation. No fan-out runtime, scenario, runner, framework, or baseline was changed.
<!-- /ANCHOR:rollback -->
