---
title: "Tasks: Scorer P0 Routing Fixes (F1b)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "F1b tasks scorer routing"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/002-scorer-p0-routing-fixes"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced tasks"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Scorer P0 Routing Fixes (F1b)

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

- [ ] T001 Read ambiguity.ts:44-57, projection.ts:47-55, fusion.ts:265-268/389-404 + failing fixtures
- [ ] T002 Decide mcp-code-mode route-vs-relabel for P0-UNC-002
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add low-information abstention/route rule in ambiguity.ts; wire into fusion
- [ ] T004 [P] Add /speckit:plan command-intent bonus in projection.ts + fusion.ts
- [ ] T005 Add a regression fixture covering the ambiguity rule
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Run skill_advisor_regression.py; P0 ≥ 0.92, no regression
- [ ] T007 tsc --noEmit + scorer vitest; adversarial over-abstention/over-fire checks
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] P0 pass rate ≥ 0.92, no regression
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Root cause**: See `../research/research.md` §3 F1b
<!-- /ANCHOR:cross-refs -->
