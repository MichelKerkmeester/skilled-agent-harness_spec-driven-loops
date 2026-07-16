---
title: "Tasks: New-Feature Research and Build"
description: "Task list for the TRACK B new-feature arc: research, eval-v2 build, three feature builds default-off, the prod-mode benchmark, the fresh-Opus hold and the documentation reconciliation."
trigger_phrases:
  - "028 new feature build tasks"
  - "028 track b tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/023-new-feature-research-build"
    last_updated_at: "2026-07-04T17:51:04.915Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created the new-feature build tasks"
    next_safe_action: "Run strict validation on the 028 root"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-20-tasks-028-023-new-feature-research-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: New-Feature Research and Build

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

- [x] T001 Read the deleted-10 teachings and derive the four candidate features for the research input.
- [x] T002 Confirm eval-v2 is built with its three non-self-recall classes, the completeRecall@K metric at K of 3, 5 and 8 and the dual-mode eval-vs-prod fidelity path.
- [x] T003 Confirm the three feature builds are committed default-off: deterministic-multihop, lane-champion-backfill and true-citation-emitter.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add 008 to the parent `graph-metadata.json` children_ids and the `spec.md` phase documentation map.
- [x] T005 [P] Add the three built-but-held flags to `feature-flags.md` with a one-line reason and next step each, and note eval-v2 as kept infrastructure.
- [x] T006 [P] Create the TRACK B leaf changelog `changelog-001-023-new-feature-research-build.md` with the research-to-eval-v2-to-build-to-benchmark-to-hold arc.
- [x] T007 Add the TRACK B milestone row to `changelog-001-root.md` and reflect the new leaf in the changelog `README.md` memory-track count and narrative.
- [x] T008 Add the TRACK B research-and-build arc to `timeline.md` as a new section after Section G, with the eval-saturation headline and the truncation finding.
- [x] T009 Record the append-not-displace truncation finding prominently in this phase's spec and implementation-summary.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirm every disposition traces to a prod-mode number or a structural fact, never an eval-mode number that eval-saturation inflates.
- [x] T011 Run an HVR scan across the reconciled surfaces for em-dashes, prose semicolons and Oxford commas.
- [x] T012 Run `validate.sh --strict` for the 028 root and this child.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] eval-v2 is recorded as kept infrastructure and each held feature traces to its prod-mode number.
- [x] Strict validation exits 0 for the 028 root and this child.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
- **Feature flags**: See `../feature-flags.md`
- **TRACK B changelog**: See `../changelog/001-speckit-memory/changelog-001-023-new-feature-research-build.md`
<!-- /ANCHOR:cross-refs -->
