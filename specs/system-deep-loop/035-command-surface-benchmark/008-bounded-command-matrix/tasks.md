---
title: "Tasks: bounded command matrix"
description: "Task breakdown for the bounded model matrix."
status: in-progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/008-bounded-command-matrix"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: bounded command matrix

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. The machinery is implemented; live capture remains open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Verify the alignment fan-out wiring required for matrix cells. Evidence: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:339` reads exactly `const ACTIVE_FANOUT_LOOP_TYPES = new Set(['research', 'review']);`; alignment is absent, so the four leaf sentinels are predeclared skips.
- [x] T002 — Author the matrix manifest with required cells and predeclared skips. Evidence: `command_benchmark_matrix.json` enumerates all 16 DAB-012..027 scenarios as 48 driver cells plus four alignment leaf sentinels, 52 required cells total.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Run the two GPT drivers across the scenario suite. **DEFERRED — live capture pending operator green-light.**
- [ ] T004 — Run the leaf sentinels over the workflow scenarios. **DEFERRED — live capture pending operator green-light; alignment fan-out must be wired and tested first.**
- [ ] T005 — Rerun contested cells with the three-sample policy. **DEFERRED — live capture pending operator green-light; contested cells are identified from T003/T004 results.**
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Prove the reconciliation machinery accounts for every required cell as a result or predeclared skip. Evidence: `node --test .../command-behavior-matrix.test.cjs` exits 0 with 6/6 subtests, and G008 exits 0 with `required=52 results=0 skips=52 retryable=0 failures=0`. The full live-result form remains dependent on T003, T004, and T005.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Fan-out wiring is built or verified, the manifest accounts for every cell, contested cells are resampled, and fixture hashes match before every cell.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/035-command-surface-benchmark`. Predecessor: 007-command-scenario-rollout. Successor: 009-command-benchmark-command.
<!-- /ANCHOR:cross-refs -->
