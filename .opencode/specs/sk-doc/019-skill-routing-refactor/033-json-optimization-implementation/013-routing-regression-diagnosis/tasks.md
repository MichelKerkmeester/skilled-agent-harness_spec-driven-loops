---
title: "Task Breakdown: Routing Regression Diagnosis and Disposition"
description: "Tasks for routing regression diagnosis and disposition."
trigger_phrases:
  - "regression diagnosis task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/013-routing-regression-diagnosis"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored Level 3 phase spec"
    next_safe_action: "Begin execution per plan.md once upstream dependencies clear"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/013-routing-regression-diagnosis"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Task Breakdown: Routing Regression Diagnosis and Disposition

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Reproduce the full metric set at HEAD and record it with the corpus file hashes alongside
- [ ] T-02 Confirm the corpus hashes match the pinned values, voiding the comparison if they do not
- [ ] T-03 Enumerate every prompt whose prediction differs from the baseline, with expected, baseline and current values
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-04 Bisect each changed prompt across the skill-root metadata surface and the advisor scorer surface separately
- [ ] T-05 Check out and measure the baseline sha to establish whether holdout top-1 was already 51/72 before the program
- [ ] T-06 Record the disposition — fix scorer, fix metadata, or accept with rationale — against what the bisect attributed
- [ ] T-07 If the disposition is fix, land it as one revertible commit behind the corpus gate
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-08 Re-measure the full metric set and compare against both the pin and the pre-fix state
- [ ] T-09 Confirm no baseline artifact was modified during the phase
- [ ] T-10 State any remaining shortfall numerically rather than describing it qualitatively
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The full metric set is captured with corpus hashes before any change; every changed prompt is enumerated individually; attribution names a commit or states UNKNOWN; the baseline sha is measured directly to settle caused-versus-inherited; and every file under the baseline directory is byte-identical at close.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
