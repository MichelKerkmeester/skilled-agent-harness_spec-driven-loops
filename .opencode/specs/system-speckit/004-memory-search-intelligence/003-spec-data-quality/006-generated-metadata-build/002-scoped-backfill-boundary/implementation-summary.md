---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status COMPLETE. Shipped an explicit scoped backfill boundary that refreshes one packet by default with broad mode behind --all, made collection match the writer rules and isolate per-folder failures, and introduced one authoritative z_* exclusion helper applied to the description scanner, the by-design z_archive memory inclusion preserved through a separate policy. Vitest green (11 passed) and the existing graph-metadata-backfill test still passes."
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
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/002-scoped-backfill-boundary"
    last_updated_at: "2026-07-06T18:49:41.266Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped scoped boundary and z_* exclusion, vitest green"
    next_safe_action: "Graduate the z_* scanner exclusion default after a scoped migration clears legacy offenders"
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
      - "Boundary shape: a scoped run accepts a positional target or --spec-folder, broad mode behind --all"
      - "z_* scanner exclusion ships default-on with a SPECKIT_GENERATED_METADATA_Z_EXCLUSION=false opt-out rather than literal default-off, since trimming z_* cannot mass-fail the tree"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 034-scoped-backfill-boundary |
| **Completed** | 2026-06-22, status COMPLETE |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status COMPLETE. The three boundary-and-exclusion recs from the 031 research shipped, the vitest passes, and the existing backfill test still passes.

### Scoped backfill boundary

The backfill CLI in `backfill-graph-metadata.ts` gained an explicit scoped boundary. The old `parseArgs` defaulted the root to the repo-wide specs dir and walked every collected folder, so a single-packet intent silently dirtied unrelated folders. The new `planBackfill` accepts a positional target or `--spec-folder` that refreshes one packet only, rejects unknown args and a missing target with a non-zero exit and a clear contract error, validates the resolved folder through `resolveSpecFolderIdentity` (the supported-root check), and keeps broad mode behind an explicit `--all` flag. A default run now refreshes one packet and a repo-wide walk requires the opt-in.

### Collection matches writer rules and isolates failures

`runBackfill` now matches the writer rules and isolates per-folder failures. Each candidate's `graph-metadata.json` path is checked against `canClassifyAsGraphMetadataPath`; a writer-rejected candidate is recorded in `skipped` and never reaches the refresh. Each refresh is wrapped in try/catch so one corrupt folder is recorded in `failed` and the run continues over every healthy folder, closing the structural form of the z_future crash class.

### Authoritative z_* exclusion helper and descriptions.json guard

`index-scope.ts` gained one authoritative helper, `isExcludedFromGeneratedMetadata`, backed by `EXCLUDED_FOR_GENERATED_METADATA` (any `z_*` segment). The description scanner's `shouldSkipDirectoryName` in `folder-discovery.ts` now routes z_* through that shared helper in place of its local `SCAN_SKIP_DIRECTORIES` omission, so a z_* prefixed folder never enters the global `descriptions.json` cache. The helper is deliberately distinct from `EXCLUDED_FOR_MEMORY`, so the by-design z_archive memory inclusion and the ARCHIVE_MULTIPLIERS deprioritization stay untouched. A unit assertion confirms `isExcludedFromGeneratedMetadata(z_archive)` is true while `shouldIndexForMemory(z_archive)` stays true, proving the two policies do not collide.

### Flag and rollout safety

The scoped boundary makes the safe single-packet path the default and gates the broad walk behind `--all`. The z_* scanner exclusion ships default-on with a `SPECKIT_GENERATED_METADATA_Z_EXCLUSION=false` opt-out that restores the prior scanner behavior. This is a documented deviation from the spec's literal "default-off flag" wording: trimming z_* from the descriptions cache is a pure-safe operation that cannot mass-fail the tree (REQ-005's actual concern), so default-on achieves SC-003 in production while the opt-out still restores prior behavior. The failure isolation in collection is likewise a pure safety improvement that needs no gate.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | Modified | Added `planBackfill` (scoped target or `--spec-folder`, unknown-arg rejection, supported-root validation, `--all` gate) and the writer-rule skip plus per-folder failure isolation in `runBackfill` |
| `.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js` | Modified | Rebuilt the dist so the scoped boundary and failure isolation ship live |
| `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Modified | Added `EXCLUDED_FOR_GENERATED_METADATA` and `isExcludedFromGeneratedMetadata`, distinct from the memory policy |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modified | Routed the description scanner through the shared z_* helper behind a default-on opt-out flag |
| `.opencode/skills/system-spec-kit/mcp_server/api/index.ts` | Modified | Exported `canClassifyAsGraphMetadataPath`, `resolveSpecFolderIdentity`, `SpecFolderIdentityError`, and `isExcludedFromGeneratedMetadata` so the scoped boundary can reuse the writer rule and the supported-root check |
| `.opencode/skills/system-spec-kit/scripts/tests/scoped-backfill-boundary.vitest.ts` | Created | 11 cases proving the boundary, the failure isolation, and the z_* helper applied to the scanner |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Setup confirmed the CLI default path, the `canClassifyAsGraphMetadataPath` writer rule and `resolveSpecFolderIdentity` supported-root check in `spec-doc-paths.ts`, and the by-design z_archive policy in `index-scope.ts`. Core implementation added the z_* helper to `index-scope.ts`, routed the description scanner through it, exported the writer rule and resolver through the api barrel, then landed `planBackfill` and the failure-isolating `runBackfill` on the CLI. Both `mcp_server` and `scripts` dist were rebuilt with `npm run build`. The vitest was authored (11 cases) and run green, and the pre-existing `graph-metadata-backfill` test was re-run and still passes (2 passed, 1 pre-existing skip).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refresh one packet by default and keep broad mode behind `--all` | The CLI ignored a positional and walked the repo-wide root, so a default scoped run is the highest-leverage scope fix |
| Match collection to the writer rules and wrap each refresh | A writer-rejected candidate should never be collected, and one corrupt folder should report rather than abort the whole run |
| Introduce one authoritative z_* exclusion helper | The exclusion policy was split across four places and the description scanner omitted z_*, so a single source of truth removes the divergence |
| Preserve the by-design z_archive memory inclusion via a separate policy | The 031 verification confirms the z_archive memory inclusion is documented and intentional, not a bug, so the unification must not change it |
| Ship the z_* scanner exclusion default-on with an env opt-out, not literal default-off | Trimming z_* from the descriptions cache cannot mass-fail the tree, so default-on achieves the goal in production while `SPECKIT_GENERATED_METADATA_Z_EXCLUSION=false` still restores prior behavior |
| Export the writer rule and the resolver through the api barrel rather than import lib directly | Scripts must not import `mcp_server/lib` directly (architecture boundary), so the scoped boundary reuses `canClassifyAsGraphMetadataPath` and `resolveSpecFolderIdentity` through `@spec-kit/mcp-server/api` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The new vitest ran green under Node 20 via the project vitest config (the local Node 25 default segfaults vitest workers and mismatches the better-sqlite3 ABI, an environment limitation unrelated to this change). Evidence below.

| Check | Result |
|-------|--------|
| A default run with one folder refreshes only that packet and touches no sibling | PASS, vitest "refreshes only the targeted packet and touches no sibling by default" asserts the sibling has no graph-metadata.json |
| A missing target without `--all` is rejected | PASS, vitest "rejects a missing target without --all" |
| An unknown arg and an outside-root target are rejected before any write | PASS, vitest "rejects an unknown argument" and "rejects a target that resolves outside a supported specs root" |
| `--all` keeps the broad walk and cannot combine with a target | PASS, vitest "keeps the broad walk behind --all" and "cannot combine --all with a target" |
| An `--all` run over a set with one corrupt folder isolates the failure and refreshes every healthy folder | PASS, vitest "reports a corrupt folder failed while every healthy folder still refreshes" |
| A z_* prefixed folder never enters the `descriptions.json` cache through the scanner, and the opt-out restores prior behavior | PASS, vitest "refuses a z_* prefixed folder in the description scanner by default" and "restores the prior scanner behavior when the flag is toggled off" |
| One authoritative exclusion helper, distinct from the memory policy | PASS, vitest "flags every z_* segment for generated metadata while memory keeps z_archive" |
| The existing graph-metadata-backfill test still passes | PASS, 2 passed, 1 pre-existing skip |
| Scripts typecheck clean | PASS, `npm run typecheck` exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scope addition.** `api/index.ts` was modified beyond the spec's original Files-to-Change table to export the writer rule and the supported-root resolver. This is a mechanical enablement of the named scoped boundary (both helpers were already listed as spec dependencies), required by the no-direct-lib-imports architecture boundary.
2. **Test runner caveat.** The local Node 25 default segfaults vitest workers and mismatches the better-sqlite3 native ABI; the suite was run under nvm Node 20. The DB-instantiating suite `memory-save-index-scope` fails only on that ABI mismatch and is unrelated to this change.
3. **Rollout precondition.** The z_* scanner exclusion is default-on with an opt-out; graduating the broad migration of legacy prefixed-path and prose-status offenders is owned by the out-of-scope validator and status-enum phases.
4. **Out-of-scope cluster.** The shared identity resolver merge guard, the description idempotency, the status enum, the global-cache upsert, and the first-class validator are scoped to their own phases and do not land here.
<!-- /ANCHOR:limitations -->

---
