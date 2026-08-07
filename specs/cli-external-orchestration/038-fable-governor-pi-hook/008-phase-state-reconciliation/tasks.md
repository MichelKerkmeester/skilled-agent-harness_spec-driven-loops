---
title: "Tasks: Phase State and Metadata Reconciliation"
description: "Ordered tasks to inventory phase status, repair the parent map and handoffs, reconcile summaries and evidence, and refresh generated metadata."
trigger_phrases:
  - "phase state reconciliation tasks"
  - "metadata refresh tasks"
  - "parent map repair tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/008-phase-state-reconciliation"
    last_updated_at: "2026-08-05T00:23:03Z"
    last_updated_by: "pi-phase-state-reconciliation"
    recent_action: "Completed state reconciliation tasks with final command-backed receipts"
    next_safe_action: "Review freshness caveat"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "../spec.md"
      - "../graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:a79b60e7959d007398cb93e3c022d55c8a92d2914c16efdfa0417e06d600428c"
      session_id: "2026-08-04-cli-038-008-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The parent map has nine unique rows and the generated metadata covers every child."
      - "The package-root corpus remains an explicit exit-1 deferral, not a green result."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase State and Metadata Reconciliation

<!-- SPECKIT_LEVEL: 2 -->

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

Every task names its evidence command or artifact. A status change is evidence-supported only when a checklist row or Phase 007 command output backs it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Build the packet-wide status inventory for phases 001-009: spec metadata table, implementation-summary frontmatter and body, checklist/task state, and graph-derived status per phase. Evidence: the normalized status table in `implementation-summary.md` records one row for each child and distinguishes complete, in-progress, and planning-only state.
- [x] T002 [P1] Capture the pre-change metadata baseline: copies of parent and child `graph-metadata.json` and `description.json`, plus the packet `git diff --stat`. Evidence: baseline strict validation exited 2 with the recorded integrity/freshness findings; the pre-change packet status and diff inventory are recorded in `implementation-summary.md`.
- [x] T003 [P1] Confirm Phase 007's evidence inventory and corpus deferral are available, or record them as an open dependency with an owner. Evidence: Phase 007's `evidence/full-corpus-baseline.md` records 18 failed files, 27 failed tests, and exit 1; focused Pi/shared/Node commands observed 32/32, 351/351, and 7/7.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Repair the parent phase map and handoff table (`../spec.md`): exactly one row per phase 001-009, historical scopes/statuses preserved, remediation phases 006-009 described accurately, duplicate and placeholder rows removed, every adjacent handoff pair given a criterion and verification command. Evidence: the map scan reported `MAP_ROWS=9` and `PARENT_PLACEHOLDERS=0`; the handoff table contains eight adjacent rows plus the terminal row, and phases 008/009 are now Complete with their receipts preserved.
- [x] T005 [P1] Reconcile implementation summaries 001-005: normalize status, completion, verification, and next-action fields with Phase 007 evidence; preserve historical prose where supported. Evidence: summaries 001-005 now expose Complete/100% state, retain historical receipts, and distinguish Phase 007's registered/focused evidence boundary.
- [x] T006 [P1] Keep incomplete work non-complete and align checklist/task evidence rows to the artifact that owns each check. [EVIDENCE: Phase 006-009 ownership and receipts are recorded in their owning docs; `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ../009-injection-contract-directive-sync --strict` reports 0 structural errors, and no full-corpus result is marked green.]
- [x] T007 [P0] Regenerate `description.json` and `graph-metadata.json` for the parent and every child; confirm `children_ids`, status, source docs, fingerprints, and the resume pointer. Evidence: the repository generators exit 0 for all ten folders; final JSON reads show nine child IDs, Complete child rollup, and the parent pointer targeting Phase 009.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P1] Run the claim and map scans across the packet: duplicates, placeholders, stale counts, unsupported completion language, and evidence rows in the wrong artifact. Evidence: map/placeholder scans are clean; the corpus scan retains the explicit `FAIL, exit 1` wording and no green whole-corpus claim.
- [x] T009 [P0] Run recursive strict validation for the whole packet and fix every structural error. [EVIDENCE: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .. --strict` exits 2 with parent `Errors: 0, Warnings: 0, RESULT: PASSED`; all nine children have `Errors: 0`, and only nine `CONTINUITY_FRESHNESS` warnings remain. ]
- [x] T010 [P1] Diff review and rollback record: confirm only spec artifacts and generated metadata changed, no historical phase record was deleted, and the resume pointer identifies the most recently reconciled child. Evidence: final scoped status/diff checks show packet-only documentation/metadata edits, all nine phase folders remain, and the parent pointer targets Phase 009.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every phase has one normalized, evidence-supported status; the nonzero package-root corpus is not green.
  - [evidence: final status table, Phase 007 corpus artifact, and Phase 009 contract receipts.]
- [x] The parent map and handoff table list phases 001-009 exactly once with no placeholder rows.
  - [evidence: `MAP_ROWS=9` and `PARENT_PLACEHOLDERS=0`.]
- [x] Generated metadata for parent and every child is regenerated with fresh source fingerprints.
  - [evidence: description and graph generator commands exit 0 for all ten folders; final JSON reads are recorded in the implementation summary.]
- [x] `last_active_child_id` points to the most recently reconciled child; the parent rollup is Complete.
  - [evidence: parent graph read points to `009-injection-contract-directive-sync`, all nine child statuses are Complete, and parent spec.md is Complete.]
- [x] Recursive strict validation completes all structural checks; any dirty-worktree freshness warning is reported separately.
  - [evidence: final validator output records zero structural/integrity errors; the exact CONTINUITY_FRESHNESS warning list and exit code are recorded in the implementation summary.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](spec.md).
- **Plan**: See [plan.md](plan.md).
- **Checklist**: See [checklist.md](checklist.md).
- **Parent packet**: See [../spec.md](../spec.md).
- **Evidence predecessor**: See [../007-dispatch-validation-evidence/tasks.md](../007-dispatch-validation-evidence/tasks.md).
- **Contract successor**: See [../009-injection-contract-directive-sync/tasks.md](../009-injection-contract-directive-sync/tasks.md).
<!-- /ANCHOR:cross-refs -->
