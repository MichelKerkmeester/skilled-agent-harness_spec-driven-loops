---
title: "Tasks: Multi-file boundary dividers for create-diff"
description: "Implementation and verification tasks for semantic file-start and file-end report bands."
trigger_phrases:
  - "multi file boundary tasks"
  - "create diff divider tasks"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-create-diff-mode/015-multi-file-boundary-dividers"
    last_updated_at: "2026-07-20T12:17:52Z"
    last_updated_by: "opencode"
    recent_action: "Removed and tested whitespace side dividers"
    next_safe_action: "No phase-local work remains"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-diff-multi-file-boundaries"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Multi-file boundary dividers for create-diff

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the defect in the generated multi-file report and locate all renderer consumers (`create_diff.py`) - evidence: starts were collapsed and ends were ordinary context rows.
- [x] T002 Scaffold and author the Level 2 phase contract (`015-multi-file-boundary-dividers/`) - evidence: spec, plan, tasks, and checklist use canonical templates and anchors.
- [x] T003 Freeze the exact balanced-envelope invariant and the no-command-file scope (`spec.md`, `plan.md`) - evidence: REQ-002 and affected-surfaces table.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add exact delimiter parsing and all-or-nothing envelope validation (`scripts/create_diff.py`) - evidence: `_aggregate_file_sequence` and `_matching_aggregate_files` pass valid/invalid matrix tests.
- [x] T005 Add boundary metadata, collapse preservation, and section reset (`scripts/create_diff.py`) - evidence: collapse and cross-file heading tests pass.
- [x] T006 Add accessible full-width bands and token-based styles for both views (`scripts/create_diff.py`) - evidence: both rendered reports expose four start and four end bands and pass validation.
- [x] T007 Add valid, invalid, hostile-path, collapse, identical, pair-mismatch, and section-reset regressions (`scripts/test_create_diff.py`) - evidence: 59 tests pass.
- [x] T008 [P] Update skill contract, README, workflow, accessibility, catalog, and changelog to `1.1.1.0` (`create-diff/`) - evidence: changed docs carry the aggregate-pair contract and versioned changelog.
- [x] T009 [P] Update the parent phase map and generated child metadata (`../spec.md`, phase metadata) - evidence: phase 015 is in the parent table and scoped graph backfill completed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the complete create-diff test suite and record counts (`scripts/test_create_diff.py`) - evidence: 59 tests pass in 1.327s.
- [x] T011 Generate representative unified and side-by-side aggregate reports and run `validate_report.py` - evidence: both reports pass with 4 start and 4 end bands.
- [x] T012 Run package, document, alignment, and `git diff --check` gates - evidence: all pass; package reports two existing fixture-frontmatter advisories.
- [x] T013 Run strict validation on phase 015; run parent-recursive validation only if unrelated deleted child state does not invalidate the result - evidence: `validate.sh 015-multi-file-boundary-dividers --strict` exits 0; parent `--strict --recursive` exits 2 on historical sibling phase-link/integrity failures.
- [x] T014 Reconcile checklist, implementation summary, task status, metadata, and parent phase status - evidence: P0 13/13 and P1 14/14, Complete status synchronized, metadata regenerated.
- [x] T015 Add a 32px accessibility-inert spacer before each file after the first (`scripts/create_diff.py`) - evidence: `_render_file_gap` is shared by both views and uses `--sp-8` canvas whitespace.
- [x] T016 Verify one gap per later file and no leading gap (`scripts/test_create_diff.py`) - evidence: both report views pass ordered gap assertions in the 59-test suite.
- [x] T017 Remove side dividers from inter-file whitespace (`scripts/create_diff.py`) - evidence: the gap masks both outer frame edges with canvas-colored pseudo-elements, and both report views assert the mask contract.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every P0 and P1 requirement has inline evidence in `checklist.md`.
- [x] No command file is modified.
- [x] Generated reports pass the safety validator and source fixtures remain unchanged.
- [x] All intended files are listed in the final scoped diff and unrelated work remains untouched.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
