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
    last_updated_at: "2026-07-02T15:45:24Z"
    last_updated_by: "gpt-5.5"
    recent_action: "All tasks complete; orchestrator verification recorded"
    next_safe_action: "None for this child"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Sliding-Window Convergence Mode

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Read ADR-001 (`009-research-backlog-remediation/009-convergence-design-and-hardening/decision-record.md`) in full.
  - Evidence: Read parent decision-record.md ADR-001 lines 39-150 before implementation.
- [x] T002 Read `convergence.cjs`'s `main()`/`computeCompositeScore` and `coverage-graph-signals.ts`'s `computeGraphNoveltyDelta`/`latestPriorSnapshot`.
  - Evidence: Read full `convergence.cjs` and `coverage-graph-signals.ts`; implementation anchored on `main()`, `buildNoveltyCorroboration`, `computeCompositeScore`, `latestPriorSnapshot`, and `computeGraphNoveltyDelta`.
- [x] T003 Read existing `coverage-graph-signals.vitest.ts` fixture conventions.
  - Evidence: Read full `coverage-graph-signals.vitest.ts` and added plain-object node/snapshot fixtures with `toBeCloseTo` assertions matching existing style.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the windowed novelty-delta function in `coverage-graph-signals.ts`.
  - Evidence: Added `computeWindowedGraphNoveltyDelta`, with denominator limited to eligible rows after the N-back snapshot and early clamp to the full-history function.
- [x] T005 Add `convergenceMode`/`slidingWindowSize` param handling and validation in `convergence.cjs`.
  - Evidence: Added `readConvergenceModeConfig`; `sliding-window` defaults to size 5 and rejects 0, negative, and non-integer sizes with `slidingWindowSize must be a positive integer`.
- [x] T006 Thread mode selection through `main()`/`computeCompositeScore` without touching the `default`/`off` code paths.
  - Evidence: `main()` selects the windowed graph novelty telemetry only when `mode === "sliding-window"`; default/off telemetry remains unchanged in tests.
- [x] T007 Record full-history and windowed `newInfoRatio` in telemetry output.
  - Evidence: Sliding-window convergence output includes `fullHistoryNewInfoRatio` and `windowedNewInfoRatio`; default/off output assertions confirm both fields are absent.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add the new denominator-drag fixture (late novelty suppressed by the full-history denominator, visible under the windowed calc).
  - Evidence: `coverage-graph-signals.vitest.ts` asserts full-history `1/44 < 0.05` and windowed `1/4 > 0.20`.
- [x] T009 Add `slidingWindowSize` validation tests (0, negative, non-integer -> clear error).
  - Evidence: `readConvergenceModeConfig` tests cover 0, -1, 1.5, unknown mode, default size 5, and nested config size 7.
- [x] T010 Run the full `deep-loop-runtime` vitest suite; confirm 0 new failures.
  - Evidence: Baseline `npm test`: 58/60 files passed, 574/576 tests passed, 2 failed. Final restored `npm test`: 58/60 files passed, 578/580 tests passed, 2 failed. Failing test names unchanged.
- [x] T011 Author implementation-summary.md and mark spec.md/plan.md Complete.
  - Evidence: implementation-summary.md authored by the implementer; Complete recorded by the orchestrator after independent verification proved the 2 remaining suite failures pre-exist this change (stash re-run) and the delta is 0 new failures.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed (`validate.sh --strict` exits 0).
  - Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode --strict` passed with 0 errors and 0 warnings.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
