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
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks/002-pilot-deep-review"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task list authored; not started"
    next_safe_action: "Blocked on phase 001 exit gate"
    blockers:
      - "Phase 001 exit gate"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-002-tasks"
      parent_session_id: null
    completion_pct: 0
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

- [B] T001 Confirm phase-001 exit gate passed; verify review-fixture git-clean restore works.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Author `deep-review/behavior_benchmark/` index + RVB-001..008 per the plan's scenario sketch (verbatim user-style prompts; axis coverage E1-E4/C1-C3; >=4 at C1/C2; delegation + role-absorption probes included).
- [ ] T003 Capture Claude baselines (8 runs); derive per-scenario budgets; record in `baselines/`.
- [ ] T004 Run `gpt-fast-med` (`openai/gpt-5.5-fast --variant medium`) for RVB-001..008; score + classify each run.
- [ ] T005 Run `gpt-fast-high` (`--variant high`) for RVB-001..008; score + classify each run.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Publish the pilot scorecard (bucket histogram, dimension means, per-checkpoint latency ratios per leg); compare explicitly against 031 phase 012's deep-review findings.
- [ ] T007 Calibration retro: amend the framework reference for every scoring ambiguity/budget misfit; land amendments before phase 003 authoring.
- [ ] T008 `validate.sh --strict` on this phase folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`, no `[B]` remaining.
- [ ] 24/24 runs scored + classified; zero isolation violations.
- [ ] Framework amendments landed (REQ-004).
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
