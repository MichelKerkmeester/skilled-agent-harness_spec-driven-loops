---
title: "Tasks: Cross-Skill Scorecard & Integration"
description: "Task Format: T### [P?] Description (file path). All pending -- phase blocked on its predecessor."
trigger_phrases:
  - "tasks"
  - "behavior benchmark scorecard"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks/005-scorecard-and-integration"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task list authored; not started"
    next_safe_action: "Blocked on predecessor phase"
    blockers:
      - "Phases 003 and 004 must complete first"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-005-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Cross-Skill Scorecard & Integration

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

- [B] T001 Confirm predecessor gate passed (Phases 003 and 004); verify fixture restore for this phase's targets.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Aggregate all phase 002-004 result JSONs into the cross-skill scorecard (matrix, histograms, ratios, means).
- [ ] T003 Author per-mode confirm/refute verdicts against packet 031's headline findings.
- [ ] T004 Author the ranked remediation backlog with run-ID evidence.
- [ ] T005 [P] Add README/SKILL.md discoverability pointers in all five sub-skills.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify no unmeasured cells (or explicit quarantines); spot-check 10% of scorecard claims against raw result JSONs.
- [ ] T007 Full-packet `validate.sh --strict`; comment-hygiene/alignment-drift sweep on any touched code surfaces.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`, no `[B]` remaining.
- [ ] spec.md success criteria met with evidence.
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
