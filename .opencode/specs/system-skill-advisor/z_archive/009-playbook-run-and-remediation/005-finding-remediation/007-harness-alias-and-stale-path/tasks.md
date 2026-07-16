---
title: "Tasks: Regression-Harness Alias-Awareness & Stale Test Path"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "harness alias tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/005-finding-remediation/007-harness-alias-and-stale-path"
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

- [x] T001 Found alias groups incomplete (added sk-deep-* + deep-agent-improvement group)
- [x] T002 Located gold-compare sites in both harnesses + the lane-weight-sweep anchor
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Alias-aware gold compare in skill_advisor_regression.py (skill_matches_alias)
- [x] T004 [P] Alias-aware gold compare in advisor-validate.ts (skillInAliasSet)
- [x] T005 Re-anchored lane-weight-sweep.vitest.ts on package.json + sweep-report redirect (gitignored)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Python deep-* rows pass; both scorers P0 12/12 (TS PHRASE-002/005 abstain — non-alias, out of scope)
- [x] T007 `npm test` 66/66 files pass; Python unit suite unaffected
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Alias rows pass (Python 7/7, TS 5/7); full TS suite green; P0 12/12 both scorers
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source phase**: ../002-scorer-p0-routing-fixes (where these P1s surfaced)
<!-- /ANCHOR:cross-refs -->
