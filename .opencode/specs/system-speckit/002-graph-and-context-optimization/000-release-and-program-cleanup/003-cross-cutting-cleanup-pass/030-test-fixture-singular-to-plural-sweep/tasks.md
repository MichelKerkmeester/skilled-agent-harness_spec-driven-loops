---
title: "Tasks: 056 Test Fixture Singular→Plural Sweep"
description: "Mechanical task list for the singular→plural sweep across 7 advisor test files."
trigger_phrases:
  - "030-test-fixture-singular-to-plural-sweep tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/030-test-fixture-singular-to-plural-sweep"
    last_updated_at: "2026-05-08T10:55:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author task list"
    next_safe_action: "Finish documentation; validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-030-test-fixture-singular-to-plural-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 056 Test Fixture Singular→Plural Sweep

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Spec authored — `spec.md`
- [x] T002 Plan authored — `plan.md`
- [x] T003 Tasks authored — `tasks.md` (this file)
- [x] T004 Pre-change baseline: 37 advisor failures across 10 files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Apply single-line sed: `'.opencode', 'skill'` → `'.opencode', 'skills'` and `'.opencode/skill/` → `'.opencode/skills/`
- [x] T006 Apply multi-line perl (slurp mode) for split-line forms
- [x] T007 Verify zero singular `.opencode/skill` references remain in affected tests
- [x] T008 `npm run build` exits 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Re-run `npx vitest run skill_advisor/tests/`; failure count = 4 (down from 37)
- [x] T010 Confirm residual 4 failures are NOT path-related (parity / alias-canonicalization / Python-compat)
- [ ] T011 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0
- [ ] T012 Fill `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All path occurrences replaced
- [x] Build green
- [x] Failure count drops 33
- [ ] Validate strict
- [ ] impl-summary filled
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../004-runtime-root-memory-cleanup-followup-fixes/handover.md` (item #4 in §3.2)
<!-- /ANCHOR:cross-refs -->

---
