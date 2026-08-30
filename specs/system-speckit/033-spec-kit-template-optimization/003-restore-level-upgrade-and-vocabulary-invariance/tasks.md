---
title: "Tasks: Restore the Level-Upgrade Path and Clear the Vocabulary Invariance"
description: "Task breakdown for the upgrade-path restoration and the vocabulary invariance fix."
trigger_phrases:
  - "restore level upgrade"
  - "upgrade-level fragments"
  - "vocabulary invariance"
  - "template addendum derivation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/003-restore-level-upgrade-and-vocabulary-invariance"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Restored the level-upgrade path and cleared the vocabulary invariance"
    next_safe_action: "None; both defects are fixed and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh"
    session_dedup:
      fingerprint: "sha256:ad2615a30db67985ec851fd3239781df6cb125dc83294997a56f536d41fb3385"
      session_id: "2026-08-29-033-003-restore-level-upgrade"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Restore the Level-Upgrade Path and Clear the Vocabulary Invariance

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

- [x] T001 Confirm the addendum directories are absent rather than moved - `templates/` holds only core, addons, packet-types, examples, changelog
- [x] T002 Confirm the gated templates carry the same per-level content - `templates/core/spec.md.tmpl:1` gates every level inline
- [x] T003 [P] Capture the failing upgrade as a negative control - the run reported a missing checklist template and rolled back (`scripts/spec/upgrade-level.sh:46`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Derive each level's addendum by diffing gated renders (`scripts/spec/upgrade-level.sh:46`)
- [x] T005 Filter sections the document already carries so a bump cannot duplicate them (`scripts/spec/upgrade-level.sh:70`)
- [x] T006 Create the closure document when upgrading to Level 2 (`scripts/spec/upgrade-level.sh:722`)
- [x] T007 Separate real identifiers from reserved words in the vocabulary scan (`scripts/tests/workflow-invariance.vitest.ts:108`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the full L1 to L3+ chain and confirm each step exits 0 - L2, L3 and L3+ each exit 0 (`scripts/spec/upgrade-level.sh:96`)
- [x] T009 Scan the upgraded documents for duplicated headings - none in spec, plan or checklist (`scripts/spec/upgrade-level.sh:70`)
- [x] T010 Record the fixes in this packet - `implementation-summary.md` and `acceptance-criteria.md` in this folder
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

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-29
<!-- /ANCHOR:summary -->

---



