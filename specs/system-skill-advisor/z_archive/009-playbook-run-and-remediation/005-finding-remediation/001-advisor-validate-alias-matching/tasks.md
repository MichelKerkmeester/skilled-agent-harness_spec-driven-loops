---
title: "Tasks: advisor_validate Alias-Aware Gold Matching (F1a)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "F1a tasks alias matching"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/005-finding-remediation/001-advisor-validate-alias-matching"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-remediation"
    recent_action: "Implemented and verified"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: advisor_validate Alias-Aware Gold Matching (F1a)

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Read advisor-validate.ts match sites (~266-275, ~361-371) and aliases.ts export shape
- [x] T002 Confirm/add a `canonicalizeSkillId()` helper backed by aliases.ts groups
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Canonicalize both sides at the aggregate gold-match site (advisor-validate.ts)
- [x] T004 Canonicalize both sides at the per-skill gold-match site (advisor-validate.ts)
- [x] T005 Guarantee additive semantics (only widen matches; idempotent)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Re-run advisor_validate; confirm full-corpus ~74% / holdout ~65%
- [x] T007 Run skill_advisor_regression.py; confirm no new regressions
- [x] T008 tsc --noEmit + advisor-recommend/validate vitest; reconcile NC-003 documented baseline
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed (metric lift, no regression)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Root cause**: See `../research/research.md` §3 F1a
<!-- /ANCHOR:cross-refs -->
