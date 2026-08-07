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
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/002-scoped-backfill-boundary"
    last_updated_at: "2026-07-04T17:11:58.400Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped scoped boundary, writer-rule collection, z_* exclusion helper, vitest green"
    next_safe_action: "None, phase complete; graduate the flag default after a scoped migration"
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
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Boundary shape resolved: scoped run accepts a positional target or --spec-folder, broad mode behind --all"
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

- [x] T001 Confirm the backfill CLI default path and the positional or `--spec-folder` the scoped boundary will use, with broad mode behind a default-off `--all` (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`) — confirmed the old `parseArgs` defaulted root to the repo-wide specs dir and walked it
- [x] T002 Confirm `canClassifyAsGraphMetadataPath` is the writer rule collection must match and locate the per-folder refresh call to wrap (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`) — classifier lives in `spec-doc-paths.ts`, the refresh call is `refreshGraphMetadataForSpecFolder`
- [x] T003 [P] Inventory the four divergent z_* skip lists and confirm the description scanner is the one whose list omits z_* (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`) — `SCAN_SKIP_DIRECTORIES` carried no z_* entry while backfill, memory, and code-graph each excluded z_future separately
- [x] T004 [P] Confirm the by-design z_archive memory inclusion at `index-scope.ts:183-186` and the ARCHIVE_MULTIPLIERS deprioritization to preserve (`.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts`) — `EXCLUDED_FOR_MEMORY` keeps z_archive in, left untouched
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the scoped backfill boundary, a required positional target or `--spec-folder` that refreshes one packet, reject unknown args, validate through the supported-root checks, and keep broad mode behind a default-off `--all` (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`) — `planBackfill` rejects unknown args and a missing target, `resolveScopedTarget` validates through `resolveSpecFolderIdentity`
- [x] T006 Make collection match the writer rules by skipping candidates whose `graph-metadata.json` path fails `canClassifyAsGraphMetadataPath`, and wrap each refresh so one corrupt folder reports skipped or failed without aborting (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`) — `runBackfill` skips writer-rejected candidates and try/catch records `skipped`/`failed` per folder
- [x] T007 Add one authoritative z_* exclusion helper and the separate generatedMetadata policy that preserves the z_archive memory inclusion (`.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts`) — `EXCLUDED_FOR_GENERATED_METADATA` plus `isExcludedFromGeneratedMetadata`, distinct from `EXCLUDED_FOR_MEMORY`
- [x] T008 Apply the authoritative z_* exclusion helper to the description scanner in place of its local skip list so a z_* prefixed folder never enters the `descriptions.json` cache, default-on with `SPECKIT_GENERATED_METADATA_Z_EXCLUSION=false` opt-out (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`) — `shouldSkipDirectoryName` routes z_* through the shared helper
- [x] T009 Rebuild the dist so the scoped boundary and the failure isolation ship live (`.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js`) — `npm run build` in both mcp_server and scripts; dist carries `planBackfill` and the `scoped` summary scope
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Author the vitest covering the single-packet default run, the unknown-arg and supported-root rejections, the corrupt-folder isolation, and the z_* prefixed folder refused by the scanner (`.opencode/skills/system-spec-kit/scripts/tests/scoped-backfill-boundary.vitest.ts`) — 11 cases authored
- [x] T011 Confirm a default run touches no sibling, an `--all` run isolates a corrupt folder, a z_* prefixed folder never enters the cache, and the opt-out restores prior behavior — vitest run green: 11 passed; existing `graph-metadata-backfill` test still passes (2 passed, 1 pre-skipped)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
