---
title: "Tasks: A7 EARS Patterns, Constraint Tier, and REQ_COVERAGE Gate [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "ears requirements tasks"
  - "constraint tier tasks"
  - "req coverage tasks"
  - "ac coverage clone tasks"
  - "ears linter tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/007-ears-constraints-req-coverage"
    last_updated_at: "2026-07-04T17:12:00.863Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mirrored benchmark and test into tasks"
    next_safe_action: "Build the REQ_COVERAGE clone"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: A7 EARS Patterns, Constraint Tier, and REQ_COVERAGE Gate

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

- [ ] T001 Read check-ac-coverage.sh to lock the clone contract (.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh) [REQ-001]
- [ ] T002 Read the AC_COVERAGE registry entry and the run_check dispatch path (.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json) [REQ-003]
- [ ] T003 [P] Decide the REQ-to-task linkage shape, a tasks-table column or an inline REQ-NNN marker (.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/007-ears-constraints-req-coverage/spec.md) [REQ-006]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Clone check-ac-coverage.sh into check-req-coverage.sh and retarget from checklist AC rows to tasks REQ linkage (.opencode/skills/system-spec-kit/scripts/rules/check-req-coverage.sh) [REQ-001]
- [ ] T005 Register REQ_COVERAGE in the registry with severity info and the SPECKIT_REQ_COVERAGE flag triad (.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json) [REQ-003]
- [ ] T006 Add EARS patterns and the always / ask-first / never constraint tier to the spec template REQUIREMENTS anchor (.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl) [REQ-004]
- [ ] T007 Add a REQ-reference marker to the tasks template so a task row can name its REQ (.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl) [REQ-006]
- [ ] T008 Create check-ears-lint.sh as an advisory linter for non-EARS non-constraint rows (.opencode/skills/system-spec-kit/scripts/rules/check-ears-lint.sh) [REQ-005]
- [ ] T009 Register EARS_LINT behind SPECKIT_EARS_LINT as a second authored_template advisory rule (.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json) [REQ-005]
- [ ] T010 Keep both new rules default-off and warn so an unset run is a verified no-op (.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json) [REQ-002]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run validate.sh strict with SPECKIT_REQ_COVERAGE=true on a spec with an unlinked REQ and confirm the warn line (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) [REQ-001]
- [ ] T012 Run validate.sh strict flag-unset on a 005 sibling and confirm the same exit code as before (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) [REQ-002]
- [ ] T013 Confirm an existing Level 2 spec still validates clean after the template edits (.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl) [REQ-004]
- [ ] T014 Author the planted fixtures, one unlinked-REQ spec and one fully-linked spec, for the catch-rate benchmark (.opencode/skills/system-spec-kit/scripts/tests/fixtures/req-coverage-unlinked) [REQ-001]
- [ ] T015 Write check-req-coverage.test.sh asserting catch-rate 1.0, zero false positives, the no-op message and the floor clamp (.opencode/skills/system-spec-kit/scripts/tests/check-req-coverage.test.sh) [REQ-001]
- [ ] T016 Write check-ears-lint.test.sh asserting one advisory on a free-form row and zero on an all-EARS fixture (.opencode/skills/system-spec-kit/scripts/tests/check-ears-lint.test.sh) [REQ-005]
- [ ] T017 Assert the flags-off byte-identical run on a 005 sibling that proves both default off, via check-req-coverage.test.sh (REQ_COVERAGE and EARS_LINT are validate.sh rules in validator-registry.json next to AC_COVERAGE, so they do not register in flag-ceiling.vitest.ts) (.opencode/skills/system-spec-kit/scripts/tests/check-req-coverage.test.sh) [REQ-002]
- [ ] T018 Measure the first-run real-defect floor on the live 005 corpus and confirm at least one real unlinked REQ surfaces (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) [REQ-001]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
