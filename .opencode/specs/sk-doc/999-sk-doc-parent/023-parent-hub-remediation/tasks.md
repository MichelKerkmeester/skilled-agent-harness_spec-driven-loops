---
title: "Tasks: Parent-hub remediation program"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "parent hub remediation tasks"
  - "999 sk-doc phase 023 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/023-parent-hub-remediation"
    last_updated_at: "2026-07-07T15:55:58.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-023 tasks (WU roadmap)"
    next_safe_action: "Resolve D1-D6; execute WU1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Tasks: Parent-hub remediation program

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

- [x] T001 Map all 18 findings (PS-01..PS-18) to nine work units
- [x] T002 Surface the six decision forks with recommended defaults
- [ ] T003 [B] Operator resolves D1-D6 (blocks the P0/P1 units)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 WU1 [P0] Canonize the transport axis; resolve feature_catalog; restore 4/4 canon-clean (PS-01)
- [ ] T005 WU2 surfaceBundle → conditional + base-outcome check (PS-02)
- [ ] T006 [P] WU3 One-identity ingestion guard + node_modules skip (PS-03)
- [ ] T007 [P] WU4 sk-code tool contracts: mutation decision + drop Task + 2 checker rules (PS-04, PS-05)
- [ ] T008 WU5 Command-bridge lane under contract + drift guard; refresh dead ids (PS-06, PS-07)
- [ ] T009 WU6 sk-design one-file truth pass (PS-08, PS-09, PS-10, PS-17-case)
- [ ] T010 [P] WU7 Doctrine refresh sweep (PS-11, PS-12, PS-13, PS-17, PS-18)
- [ ] T011 [P] WU8 Checker hardening batch (PS-14)
- [ ] T012 [P] WU9 Metadata dialect convergence (PS-15, PS-16)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 parent-skill-check.cjs 0/0 on all four hubs; ingestion guard proven with a fixture
- [ ] T014 Advisor drift-guard + parity vitests green; every bridge id resolves to a live command
- [ ] T015 validate.sh --strict on each touched spec folder; done-bar met
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 18 findings mapped to work units; 6 forks surfaced
- [ ] D1-D6 resolved
- [ ] WU1-WU9 executed + gated
- [ ] 4/4 canon-clean; advisor guarded; validate --strict clean
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source review**: See `../022-parent-skill-logic-review/review-report.md`
<!-- /ANCHOR:cross-refs -->
