---
title: "Tasks: Deep-Loop Gauge Flood-Test and Dedup Scale-Test"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep loop gauge flood test tasks"
  - "fanout dedup scale test tasks"
  - "progress heartbeat cadence tasks"
  - "near dup dedup false collapse tasks"
  - "gauge default decision tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/009-deep-loop-gauges-dedup-scale"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran both harnesses green and authored the verdict docs"
    next_safe_action: "Validate the phase strict"
    blockers: []
    key_files:
      - "scripts/gauge-flood-test.mjs"
      - "scripts/dedup-scale-test.mjs"
      - "results/gauge-flood-metrics.json"
      - "results/dedup-scale-metrics.json"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep-Loop Gauge Flood-Test and Dedup Scale-Test

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the 009 research sections 3.5 and 3.6 and confirm the production gauge, pool, merge code paths and config field shapes (`scripts/gauge-flood-test.mjs`, `scripts/dedup-scale-test.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Write the concurrent-pool flood matrix over the spawned `fanout-run.cjs` reproducing the 009 0.05s flood and sweeping seconds-scale candidate cadences (`scripts/gauge-flood-test.mjs`)
- [x] T003 Add the observed-cadence confirmation run at the recommended cadence with a 2.5x window (`scripts/gauge-flood-test.mjs`)
- [x] T004 FIX P1-7: redefine the lag metric in `fanout-pool.cjs` from time-since-pool-start to time-since-last-completion (a true stall signal, reset in each settlement's `.finally()`), byte-identical when the gauge is off (`.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`)
- [x] T005 Migrate the committed pool test to stall semantics and add silent-on-backpressure and silent-when-off cases; update the flood-test to prove old-false-positive-now-silent, silent-on-healthy, fires-on-stall (`.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts`, `scripts/gauge-flood-test.mjs`)
- [x] T006 Write the 50-plus-finding six-worker labeled set across identical, varied, distinct, near-miss, and title-distinct wording modes and the off-versus-on scoring incl. the title-only false-collapse rate and review severity check (`scripts/dedup-scale-test.mjs`)
- [x] T007 FIX P2-15: add the title-overlap gate to the near-dup match and bucketing in `fanout-merge.cjs` (Jaccard threshold 0.15) so disjoint-title same-body findings stay distinct, byte-identical when the dedup flag is off (`.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs`)
- [x] T008 Run both harnesses and write the metric rollups (`results/gauge-flood-metrics.json`, `results/dedup-scale-metrics.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Confirm both harnesses exit 0 and the numbers reproduce; the title-only false-collapse rate is 0 and the lag old-false-positive is now silent (`scripts/dedup-scale-test.mjs`, `scripts/gauge-flood-test.mjs`)
- [x] T010 Confirm the full deep-loop regression suite is green with both fixes (49 files, 428 tests) and each fix is byte-identical off (`.opencode/skills/deep-loop-runtime/tests`)
- [x] T011 Author the results tables, the metric-redefinition and title-fix narrative, the recommended gauge values, and the enable-by-default decision (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
