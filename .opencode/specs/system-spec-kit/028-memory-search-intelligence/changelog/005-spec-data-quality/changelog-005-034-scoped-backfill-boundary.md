---
title: "Changelog: Scoped Backfill Boundary [005-spec-data-quality/034-scoped-backfill-boundary]"
description: "Chronological changelog for the scoped backfill boundary phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/034-scoped-backfill-boundary` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Shipped an explicit scoped backfill boundary so the CLI refreshes one packet by default and gates the repo-wide walk behind `--all`. Made collection match the writer rules and isolate per-folder failures so one corrupt folder reports rather than aborts the run. Introduced one authoritative `isExcludedFromGeneratedMetadata` helper and routed the description scanner through it so a `z_*` folder never enters the `descriptions.json` cache. The `z_*` scanner exclusion ships default-ON with a `SPECKIT_GENERATED_METADATA_Z_EXCLUSION=false` opt-out. Vitest green at 11 cases and the existing backfill test still passes.

### Added

- `planBackfill` in `backfill-graph-metadata.ts`, accepting a positional target or `--spec-folder` that refreshes one packet only, rejecting unknown args and a missing target with a non-zero exit and a contract error, validating the resolved folder through `resolveSpecFolderIdentity`, and keeping broad mode behind an explicit `--all` flag.
- `EXCLUDED_FOR_GENERATED_METADATA` and `isExcludedFromGeneratedMetadata` in `index-scope.ts`, one authoritative `z_*` exclusion helper distinct from the memory policy.
- `scripts/tests/scoped-backfill-boundary.vitest.ts` with 11 cases proving the boundary, the failure isolation, and the `z_*` helper applied to the scanner.

### Changed

- `runBackfill` matches the writer rules and isolates per-folder failures, checking each candidate's `graph-metadata.json` path against `canClassifyAsGraphMetadataPath`, recording a writer-rejected candidate in `skipped`, and wrapping each refresh in try/catch so one corrupt folder is recorded in `failed` while the run continues over every healthy folder.
- `folder-discovery.ts` routes the description scanner's `shouldSkipDirectoryName` through the shared `z_*` helper in place of its local omission, behind the default-ON opt-out flag, so a `z_*` prefixed folder never enters the global `descriptions.json` cache. The helper stays distinct from `EXCLUDED_FOR_MEMORY` so the by-design z_archive memory inclusion is untouched.
- `api/index.ts` exports `canClassifyAsGraphMetadataPath`, `resolveSpecFolderIdentity`, `SpecFolderIdentityError`, and `isExcludedFromGeneratedMetadata` so the scoped boundary reuses the writer rule and the supported-root check without importing `mcp_server/lib` directly.
- Both `mcp_server` and `scripts` dist rebuilt with `npm run build` so the scoped boundary and failure isolation ship live.

### Fixed

- The structural z_future crash class is closed by isolating per-folder failures so one corrupt folder no longer aborts the whole backfill run.

### Verification

- A default run with one folder refreshes only that packet and touches no sibling - PASS, vitest asserts the sibling has no graph-metadata.json.
- A missing target without `--all`, an unknown arg, and an outside-root target are rejected before any write - PASS, vitest.
- `--all` keeps the broad walk and cannot combine with a target - PASS, vitest.
- An `--all` run with one corrupt folder isolates the failure and refreshes every healthy folder - PASS, vitest.
- A `z_*` folder never enters the `descriptions.json` cache and the opt-out restores prior behavior - PASS, vitest, while `shouldIndexForMemory(z_archive)` stays true.
- The existing graph-metadata-backfill test still passes - PASS, 2 passed, 1 pre-existing skip.
- Scripts typecheck clean - PASS, `npm run typecheck` exit 0.

### Files Changed

- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`: added `planBackfill` and the writer-rule skip plus per-folder failure isolation in `runBackfill`.
- `.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js`: rebuilt the dist so the scoped boundary ships live.
- `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts`: added the authoritative `z_*` exclusion helper distinct from the memory policy.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`: routed the description scanner through the shared helper behind a default-on opt-out.
- `.opencode/skills/system-spec-kit/mcp_server/api/index.ts`: exported the writer rule, the resolver, and the exclusion helper.
- `.opencode/skills/system-spec-kit/scripts/tests/scoped-backfill-boundary.vitest.ts`: boundary, failure isolation, and scanner exclusion coverage.

### Follow-Ups

- `SPECKIT_GENERATED_METADATA_Z_EXCLUSION` ships default-ON by construction as an opt-out, since trimming `z_*` from the descriptions cache cannot mass-fail the tree.
- Graduating the broad migration of legacy prefixed-path and prose-status offenders is owned by the validator and status-enum phases, not this one.
