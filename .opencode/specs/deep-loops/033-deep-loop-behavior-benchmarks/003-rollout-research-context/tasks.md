---
title: "Tasks: Rollout Behavioral Benchmarks -- deep-research + deep-context"
description: "Task Format: T### [P?] Description (file path). All pending -- phase blocked on its predecessor."
trigger_phrases:
  - "tasks"
  - "research context behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks/003-rollout-research-context"
    last_updated_at: "2026-07-02T19:55:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 7 tasks complete; 42 runs scored, scorecard published"
    next_safe_action: "Phase 004: ai-council + improvement benchmarks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-003-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Rollout Behavioral Benchmarks -- deep-research + deep-context

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

- [x] T001 Predecessor gate confirmed; fixture restore verified — and HARDENED during the phase to `rm -rf` run-output dirs after a concurrent session committed a `context/` packet into `fx-001` that `git clean` could not remove.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] `deep-research/behavior_benchmark/` authored (RSB-001..008); all contracts machine-verified. Full-run cells repointed to `fx-002-research-target` after INIT fail-closed on `fx-001`'s anchor-less spec.
- [x] T003 [P] `deep-context/behavior_benchmark/` authored (CXB-001..006); all contracts machine-verified.
- [x] T004 Claude baselines captured (14 runs; 9 round-1 cells rate-limited → `env_error` bucket + quarantine → clean re-run). Recorded in both packages with provenance + caveats.
- [x] T005 `gpt-fast-med` + `gpt-fast-high` legs complete (28 runs) scored + classified; med D5 back-filled post-hoc; contaminated + false-`env_error` high cells re-run clean.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `scorecard.md` published: 3-leg matrix, histograms, dimension means, latency ratios, eight transcript-corrected readings, calibration log, phase-005 backlog. Headline: effort raises the floor; the load-bearing difference is delegation integrity.
- [x] T007 `validate.sh --strict` run on this phase folder (see implementation-summary.md Verification).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`, no `[B]` remaining.
- [x] spec.md success criteria met with evidence (42/42 runs scored; zero fixture-isolation violations after the contamination purge).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Framework**: `../001-framework-and-harness/`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
