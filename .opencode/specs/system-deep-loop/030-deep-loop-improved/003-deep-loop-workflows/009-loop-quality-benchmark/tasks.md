---
title: "Tasks: Loop-Quality Benchmark from Score-Delta"
description: "Completed task ledger for score-delta benchmark output and promotion gate enforcement."
trigger_phrases:
  - "loop quality benchmark score delta"
  - "outcomeScoreDelta benchmark"
  - "fixtureDeltas helped hurt"
  - "improvement over baseline gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/003-deep-loop-workflows/009-loop-quality-benchmark"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/commands/deep/assets/deep_model-benchmark_auto.yaml"
      - ".opencode/agents/skill-benchmark.md"
      - ".opencode/agents/model-benchmark.md"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Loop-Quality Benchmark from Score-Delta

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Read the completed spec and capture benchmark delta fields (`spec.md`).
- [x] T002 Identify benchmark runner, reducer, promotion gate, workflow, and agent surfaces.
- [x] T003 [P] Confirm runtime convergence delta work is out of scope (`spec.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Emit `outcomeScoreDelta` per benchmark run (`run-benchmark.cjs`).
- [x] T005 Emit `fixtureDeltas[]` with helped, hurt, and delta fields (`run-benchmark.cjs`).
- [x] T006 Summarize helped and hurt fixture counts (`shared/reduce-state.cjs`).
- [x] T007 Block promotion when `outcomeScoreDelta < 0` (`promote-candidate.cjs`).
- [x] T008 Block hurt fixtures unless explicitly overridden (`promote-candidate.cjs`).
- [x] T009 Update benchmark workflow and agent docs with score-delta fields.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify a negative outcome delta rejects promotion.
- [x] T011 Verify hurt fixtures reject promotion without override.
- [x] T012 Verify benchmark report displays helped and hurt totals.
- [x] T013 Update plan and task docs to reflect the completed benchmark work (`plan.md`, `tasks.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the completed specification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
