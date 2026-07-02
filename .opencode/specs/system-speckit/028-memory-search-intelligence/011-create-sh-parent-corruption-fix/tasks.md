---
title: "Tasks: Phase 11: create-sh-parent-corruption-fix"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "create.sh parent corruption fix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/011-create-sh-parent-corruption-fix"
    last_updated_at: "2026-07-02T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks from plan.md"
    next_safe_action: "Execute T003"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/create.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-011-create-sh-corruption-20260702"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: create-sh-parent-corruption-fix

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

- [ ] T001 Confirm exactly 2 `generate-description` call sites in create.sh (parent, child)
- [ ] T002 Capture pre-repair baseline of `001-speckit-memory/description.json` in both metadata roots
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Guard the parent `description.json` regeneration call behind `APPEND_TO_EXISTING_PARENT != true` (create.sh:1310-1321)
- [ ] T004 Add inline comment documenting the append-mode invariant
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Add regression fixture: append-mode phase creation leaves parent `description.json` byte-identical
- [ ] T006 Run existing create.sh phase-scaffolding fixtures, confirm zero regressions
- [ ] T007 Write read-only dry-run repair classifier reusing isPhaseParent()
- [ ] T008 Run classifier, confirm exactly 1 candidate (001-speckit-memory)
- [ ] T009 Review dry-run diff, apply repair to both metadata roots
- [ ] T010 Re-index repaired packet, confirm correct specFolder/parentChain
- [ ] T011 Update this phase's spec.md Status to Complete and write implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Fresh test/fixture run pasted as evidence, not cited from a prior run
- [ ] Repair diff reviewed and applied to both metadata roots
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../010-generated-metadata-status-integrity/review/review-report.md` (T1-P1-001, T1-P1-002, T1-P1-003)
<!-- /ANCHOR:cross-refs -->
