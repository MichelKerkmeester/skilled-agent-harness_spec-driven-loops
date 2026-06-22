---
title: "Tasks: Scoped Backfill Boundary and Exclusion Unification [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "scoped backfill boundary"
  - "backfill spec folder positional"
  - "collection matches writer rules"
  - "authoritative z exclusion helper"
  - "descriptions json z guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/034-scoped-backfill-boundary"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Listed build tasks for boundary, collection, exclusion helper"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-034-scoped-backfill-boundary"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Scoped Backfill Boundary and Exclusion Unification

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

- [ ] T001 Confirm the backfill CLI default path and the positional or `--spec-folder` the scoped boundary will use, with broad mode behind a default-off `--all` (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`)
- [ ] T002 Confirm `canClassifyAsGraphMetadataPath` is the writer rule collection must match and locate the per-folder refresh call to wrap (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`)
- [ ] T003 [P] Inventory the four divergent z_* skip lists and confirm the description scanner is the one whose list omits z_* (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T004 [P] Confirm the by-design z_archive memory inclusion at `index-scope.ts:183-186` and the ARCHIVE_MULTIPLIERS deprioritization to preserve (`.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add the scoped backfill boundary, a required positional target or `--spec-folder` that refreshes one packet, reject unknown args, validate through the supported-root checks, and keep broad mode behind a default-off `--all` (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`)
- [ ] T006 Make collection match the writer rules by skipping candidates whose `graph-metadata.json` path fails `canClassifyAsGraphMetadataPath`, and wrap each refresh so one corrupt folder reports skipped or failed without aborting (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`)
- [ ] T007 Add one authoritative z_* exclusion helper and the separate generatedMetadata policy that preserves the z_archive memory inclusion, behind a default-off flag or a grandfather report mode (`.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts`)
- [ ] T008 Apply the authoritative z_* exclusion helper to the description scanner in place of its local skip list so a z_* prefixed folder never enters the `descriptions.json` cache (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T009 Rebuild the dist so the scoped boundary and the failure isolation ship live (`.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Author the vitest covering the single-packet default run, the unknown-arg and supported-root rejections, the corrupt-folder isolation, and the z_* prefixed folder refused by the scanner (`.opencode/skills/system-spec-kit/scripts/tests/scoped-backfill-boundary.vitest.ts`)
- [ ] T011 Confirm a default run touches no sibling, an `--all` run isolates a corrupt folder, a z_* prefixed folder never enters the cache, and the grandfather report mode reports existing offenders without mass-failing the tree
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
