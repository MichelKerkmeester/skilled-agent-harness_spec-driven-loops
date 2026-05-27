---
title: "Tasks: Regression-Harness Alias-Awareness & Stale Test Path"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "harness alias tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/007-harness-alias-and-stale-path"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p0-remediation"
    recent_action: "Specced tasks"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Regression-Harness Alias-Awareness & Stale Test Path

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

- [ ] T001 Confirm `aliases.ts` groups cover sk-deep-research/review/agent-improvement
- [ ] T002 Locate gold-compare sites in both harnesses + the lane-weight-sweep anchor
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Alias-aware gold compare in skill_advisor_regression.py
- [ ] T004 [P] Alias-aware gold compare in advisor-validate.ts harness paths
- [ ] T005 Re-anchor lane-weight-sweep.vitest.ts workspace root on a stable marker
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 deep-* alias P1 rows pass in both harnesses; P0 stays 12/12
- [ ] T007 `npm test` zero failed suites; Python unit suite green
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Alias P1 rows pass; full suites green; no P0 regression
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source phase**: ../002-scorer-p0-routing-fixes (where these P1s surfaced)
<!-- /ANCHOR:cross-refs -->
