---
title: "Tasks: Phase 6: delete-skill-directory-and-verify"
description: "Task list for cli-devin deprecation phase 6"
trigger_phrases:
  - "phase 6 tasks"
  - "delete-skill-directory-and-verify tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/142-cli-devin-deprecation/006-delete-skill-directory-and-verify"
    last_updated_at: "2026-06-08T17:38:17.105Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 6 tasks completed"
    next_safe_action: "Operator commits change-set"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: delete-skill-directory-and-verify

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the Context Report §2 cluster + the target files before editing (READ-first, scope-locked)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 .opencode/skills/cli-devin/ deleted (~70 files)
- [x] T003 Global active-surface verification grep (0 dead cli-devin/ paths)
- [x] T004 Touched test suites + CI gate confirmed green
- [x] T005 4-seat adversarial deep review run; confirmed findings fixed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Verify: cli-devin dir absent; grep 0 dead paths; deep-loop-runtime 56 + deep-improvement 23 + advisor 5 tests pass; CI exit 0; deep review 0 P0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Verification passed (see implementation-summary.md)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation**: See `implementation-summary.md`
- **Authoritative edit list**: `../context/context-report.md` §2
<!-- /ANCHOR:cross-refs -->
