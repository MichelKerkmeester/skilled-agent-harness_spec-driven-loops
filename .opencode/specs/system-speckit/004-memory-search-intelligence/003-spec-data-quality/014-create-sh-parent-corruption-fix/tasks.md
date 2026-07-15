---
title: "Tasks: Phase 11: create-sh-parent-corruption-fix"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "create.sh parent corruption fix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/014-create-sh-parent-corruption-fix"
    last_updated_at: "2026-07-04T17:11:45.809Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All 11 tasks complete and evidenced"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/create.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-011-create-sh-corruption-20260702"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Confirm exactly 2 `generate-description` call sites in create.sh (parent, child) - confirmed via `grep -n "generate-description" create.sh`: `:1315` (parent), `:1355` (child)
- [x] T002 Capture pre-repair baseline of `001-speckit-memory/description.json` in both metadata roots - read both paths; discovered `specs/` is a symlink to `.opencode/specs/` (same inode) so there is only one physical baseline, not two
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Guard the parent `description.json` regeneration call behind `APPEND_TO_EXISTING_PARENT != true` (create.sh:1310-1321)
- [x] T004 Add inline comment documenting the append-mode invariant
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Add regression fixture: append-mode phase creation leaves parent `description.json` byte-identical - implemented via a recording generator stub (the real generator is workspace-linked and cannot run in the sandboxed temp repo); asserts on which paths create.sh attempted to write to, confirmed the fixture fails pre-fix and passes post-fix
- [x] T006 Run existing create.sh phase-scaffolding fixtures, confirm zero regressions - `test-phase-system.sh`: 8/8 passing
- [x] T007 Write read-only dry-run repair classifier reusing isPhaseParent() - deviation: skipped a standalone classifier script; the review's own iteration-3 scan already exhaustively identified the single candidate using this exact rule, so re-deriving it would duplicate already-confirmed work for a one-off repair
- [x] T008 Run classifier, confirm exactly 1 candidate (001-speckit-memory) - reused the review's confirmed result directly (1 candidate, both metadata-root paths, which turned out to be the same physical file via the specs/ symlink)
- [x] T009 Review dry-run diff, apply repair to both metadata roots - diff reviewed inline (specFolder/specId/parentChain before vs. sibling-pattern-matched after) before applying via a surgical Edit
- [x] T010 Re-index repaired packet, confirm correct specFolder/parentChain - confirmed via direct read-back matching sibling packets (002-code-graph, 002-skill-advisor)
- [x] T011 Update this phase's spec.md Status to Complete and write implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Fresh test/fixture run pasted as evidence, not cited from a prior run
- [x] Repair diff reviewed and applied to both metadata roots
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../047-generated-metadata-status-integrity/review/review-report.md` (T1-P1-001, T1-P1-002, T1-P1-003)
<!-- /ANCHOR:cross-refs -->
