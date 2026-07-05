---
title: "Tasks: Pilot Behavioral Benchmark -- deep-review"
description: "Task Format: T### [P?] Description (file path). All pending -- phase blocked on 001's exit gate."
trigger_phrases:
  - "tasks"
  - "deep review behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/033-deep-loop-behavior-benchmarks/002-pilot-deep-review"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 8 tasks complete; 24-run pilot scored, scorecard published"
    next_safe_action: "Phase 003: land retro item 7 in the framework, then author RSB/CXB packages"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-002-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Pilot Behavioral Benchmark -- deep-review

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

- [x] T001 Phase-001 exit gate confirmed (SMOKE-001 pass); fixture restore verified -- and twice HARDENED during the pilot (verify-loop, then reset+checkout+clean after staged-file contamination from concurrent sessions defeated checkout+clean).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 RVB package authored by GLM-5.2-max under the orchestrator's contract (index + 8 scenarios + baselines placeholder); all contracts machine-verified (parse, axis coverage E1-E4/C1-C3, 6/8 at C1/C2, FIXTURE token substitution).
- [x] T003 Claude baselines captured across three calibration rounds (r1 exposed 4 harness bugs; calibrated r2 + two 25-min-tier re-runs produced the final 8/8: 6 pass, 1 nuance, 1 long-tail timeout). Recorded in the package `baselines/claude-baseline.md` with provenance + caveats.
- [x] T004 gpt-fast-med leg complete (8/8 scored): 1 pass, 2 partial, 2 stuck_no_progress (silent 8+min stalls), 1 timeout, 1 role-absorption (recorded 'refused' by a classifier-ordering defect -- corrected in scorecard.md section 4), 1 Gate-3 halt.
- [x] T005 gpt-fast-high leg complete (8/8 scored): 5 pass (two perfect 10/10 on the hardest delegation cells), 1 partial, 1 timeout-with-correct-dispatch, 1 Gate-3 halt. Zero stalls, zero absorption.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 scorecard.md published in this folder: 3-leg matrix, histograms, dimension means, latency ratios (host-confound + RVB-001 lower-bound caveats stated), corrected transcript readings, explicit comparison to the prior smoke benchmark. Headline: reasoning effort is the load-bearing variable.
- [x] T007 Calibration retro: six harness amendments landed IN-FLIGHT (flagged-regex markers, watchdog_ms tiers, budget tiers, structured Agent-tool dispatch detection, reset+checkout+clean restore, no-delegation D4 rule) -- runner + framework.md synced, hermetic suite green after each; item 7 (classifier ordering + contract-declared artifacts) logged OPEN for phase 003 to land before authoring.
- [x] T008 `validate.sh --strict` run on this phase at closeout (see implementation-summary.md Verification).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`, no `[B]` remaining.
- [x] 24/24 runs scored + classified (plus 10 additional calibration-round baseline runs); zero fixture-isolation violations across all runs.
- [x] Framework amendments landed in-flight; one residual (classifier ordering) logged OPEN with phase 003 as owner.
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
