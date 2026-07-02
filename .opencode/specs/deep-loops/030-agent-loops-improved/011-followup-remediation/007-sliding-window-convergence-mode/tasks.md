---
title: "Tasks: Sliding-Window Convergence Mode"
description: "Task ledger for implementing ADR-001's opt-in sliding-window convergence mode."
trigger_phrases:
  - "sliding window convergence mode"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode"
    last_updated_at: "2026-07-01T21:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored task ledger"
    next_safe_action: "Begin Phase 1 setup reads"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Sliding-Window Convergence Mode

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

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

- [ ] T001 Read ADR-001 (`009-research-backlog-remediation/009-convergence-design-and-hardening/decision-record.md`) in full.
- [ ] T002 Read `convergence.cjs`'s `main()`/`computeCompositeScore` and `coverage-graph-signals.ts`'s `computeGraphNoveltyDelta`/`latestPriorSnapshot`.
- [ ] T003 Read existing `coverage-graph-signals.vitest.ts` fixture conventions.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the windowed novelty-delta function in `coverage-graph-signals.ts`.
- [ ] T005 Add `convergenceMode`/`slidingWindowSize` param handling and validation in `convergence.cjs`.
- [ ] T006 Thread mode selection through `main()`/`computeCompositeScore` without touching the `default`/`off` code paths.
- [ ] T007 Record full-history and windowed `newInfoRatio` in telemetry output.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add the new denominator-drag fixture (late novelty suppressed by the full-history denominator, visible under the windowed calc).
- [ ] T009 Add `slidingWindowSize` validation tests (0, negative, non-integer -> clear error).
- [ ] T010 Run the full `deep-loop-runtime` vitest suite; confirm 0 new failures.
- [ ] T011 Author implementation-summary.md and mark spec.md/plan.md Complete.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Manual verification passed (`validate.sh --strict` exits 0).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
