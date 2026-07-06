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
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/052-z-archive-metadata-backfill"
    last_updated_at: "2026-07-06T06:03:39Z"
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

- [ ] T001 Reconfirm the nine z_archive root paths and their direct-child counts (0 to 116) as a starting snapshot
- [ ] T002 Determine whether `generate-description.js` / `backfill-graph-metadata.js` already accept a folder with no `spec.md`, using `system-speckit`, `sk-design`, `skilled-agent-orchestration` and `system-deep-loop` as precedent (`.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts`, `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`)
- [ ] T003 [P] Resolve `parent_id` for each of the nine roots: the registered enclosing node for seven, the enclosing archived folder for the two nested roots, and an explicit `null` (with a note) for the `system-skill-advisor`-enclosed root
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Generate `description.json` for each of the nine roots
- [ ] T005 Generate `graph-metadata.json` for each of the nine roots with `children_ids` one level deep and the resolved `parent_id`
- [ ] T006 Tag each of the nine roots' generated metadata with the archived/cold-tier signal already shipped in `016/002`
- [ ] T007 Resolve the `sk-design/008-sk-design-parent/external/z_archive` edge case: represent its non-spec external reference files and vendored directories honestly, not as fabricated spec-folder entries
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Validate all nine new `description.json`/`graph-metadata.json` pairs parse as valid JSON and pass `check-graph-metadata-shape.sh`
- [ ] T009 Confirm no existing archived spec folder's metadata changed and `.opencode/specs/descriptions.json` was not touched (`git diff` scoped to exactly 18 new files)
- [ ] T010 Confirm default recall is unaffected by the nine new container nodes, then update `implementation-summary.md` with the final root-by-root outcome
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
