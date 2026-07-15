---
title: "Tasks: Backfill description.json and graph-metadata.json for the nine z_archive root directories across .opencode/specs so each archive becomes a discoverable, cold-tier container node in the memory graph [template:level_2/tasks.md]"
description: "Ten tasks across Setup, Implementation and Verification: confirm container-folder support, resolve parent_id per root, generate and tag all nine root pairs, then verify shape and recall impact."
trigger_phrases:
  - "z_archive container backfill tasks"
  - "archive root graph node tasks"
  - "parent_id resolution tasks"
  - "cold tier tagging tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/018-z-archive-metadata-backfill"
    last_updated_at: "2026-07-06T12:51:23.429Z"
    last_updated_by: "michel-kerkmeester"
    recent_action: "Authored Level 2 tasks for the nine z_archive root container backfill"
    next_safe_action: "Author checklist.md and implementation-summary.md for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts"
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/052-z-archive-metadata-backfill"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Backfill description.json and graph-metadata.json for the nine z_archive root directories across .opencode/specs so each archive becomes a discoverable, cold-tier container node in the memory graph

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reconfirmed the nine roots and direct-child counts: 2, 0, 116, 28, 1, 0, 4, 25, 92
- [x] T002 Determined the generators REJECT a folder without `spec.md` ("missing spec.md"); the precedent roots (`system-speckit` etc.) carry hand/scan-authored metadata, so this phase hand-authors lean container nodes mirroring that schema
- [x] T003 [P] Resolved `parent_id`: registered enclosing node for seven, enclosing archived folder for the two nested roots, explicit `null` (noted) for the `system-skill-advisor` root
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Hand-authored `description.json` for all nine roots (level `archive`, honest per-root synopsis)
- [x] T005 Hand-authored `graph-metadata.json` for all nine roots with `children_ids` one level deep and the resolved `parent_id`
- [x] T006 Tagged every node `importance_tier: "archived"` (+ `status: archived`), the cold-tier signal excluded from default recall by `active-row-predicate.ts:85` / `hybrid-search.ts:211`
- [x] T007 Resolved the `external/z_archive` edge case: `children_ids` = its two vendored directories, description states it holds external reference material. FLAG: the whole `external/` tree is gitignored, so this one node is on-disk-only unless a `.gitignore` negation is added (out of scope)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 All 18 files parse as valid JSON; all 9 `graph-metadata.json` pass GRAPH_METADATA_SHAPE and all 9 `description.json` pass DESCRIPTION_SHAPE (0 FAILs)
- [x] T009 Confirmed no existing archived spec folder's metadata changed; the `descriptions.json` diff is a concurrent 1-line edit with zero `z_archive` references. 16 of 18 files are committable; the 2 under `external/z_archive` are gitignored (on-disk only)
- [x] T010 Confirmed default recall is unaffected (archived tier is hard-excluded unless `includeArchived`); `implementation-summary.md` updated with the root-by-root outcome
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
