---
title: "Code Graph Phase 011-003: DB Location Relocated to Skill-Local"
description: "Fix #1 for the source-bug and misalignment audit. The code-graph SQLite database was wrongly placed in the workspace-root .opencode/.spec-kit directory. This fix relocated it back to the skill folder at mcp_server/database and confirmed all runtimes share a single instance through the .opencode/skills symlink."
trigger_phrases:
  - "db location skill-local"
  - "code graph database relocation"
  - "spec-kit database path fix"
  - "fix 1 db relocation"
  - "CG-038 reversal"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/003-db-location-skill-local` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit`

### Summary

The code-graph SQLite database, sidecars, lease and readiness marker were being created at `.opencode/.spec-kit/code-graph/database/` in the workspace root. The original rationale (CG-038) claimed this location was needed for cross-runtime sharing, but that claim was wrong: every runtime already symlinks `.opencode/skills` to one physical directory, making skill-local storage equally shared.

Fix #1 reversed the prior consolidation (ADR-002/004/005) by moving the database to `.opencode/skills/system-code-graph/mcp_server/database/`. All source defaults, the launcher script, configuration notes, gitignore rules and nine documentation files were updated to reflect the new path. The old `.opencode/.spec-kit` directory was removed and is no longer recreated. The full test suite passed at 577 tests after the change.

### Added

- None.

### Changed

- `DATABASE_DIR` default in `mcp_server/core/config.ts` now resolves to the skill-local path instead of `.spec-kit`
- `readiness-marker.ts` base directory updated to match the skill-local location
- `.opencode/bin/mk-code-index-launcher.cjs` `dbDir` and migration path reversed so `.spec-kit` is treated as the legacy source and skill-local is the destination
- `.gitignore` updated with ignore rules for skill-local database artifacts
- `opencode.json` `_NOTE_1_DB` annotation updated to the new path
- `references/config/database_path_policy.md` sections 1, 2 and 3 rewritten to document the skill-local rationale and the reversal of ADR-002/004/005
- Eight additional documentation files updated with path string swaps

### Fixed

- Database was placed in workspace-root `.opencode/.spec-kit/code-graph/database/` based on an incorrect cross-runtime-sharing rationale. Skill-local placement corrects this without losing sharing because all runtimes already reach the skill via the symlink.

### Verification

| Check | Result |
|-------|--------|
| `DATABASE_DIR` runtime value | `.../system-code-graph/mcp_server/database` (skill-local confirmed) |
| typecheck | PASS, 0 errors |
| full vitest | 577 passed, 1 skipped, 0 failed |
| `.opencode/.spec-kit` directory | Removed. DB migrated to skill-local before removal. |
| Commit | `69e7bf12` landed on main 2026-05-29 |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/core/config.ts` | `DATABASE_DIR` default changed to skill-local path |
| `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts` | Base directory updated to skill-local |
| `.opencode/bin/mk-code-index-launcher.cjs` | `dbDir` skill-local. Migration reversed so `.spec-kit` is the legacy source. `legacyLeasePaths()` now probes `.spec-kit`. |
| `opencode.json` | `_NOTE_1_DB` annotation updated |
| `.gitignore` | Ignore rules added for skill-local database artifacts |
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Comment updated to reflect new path |
| `.opencode/skills/system-code-graph/references/config/database_path_policy.md` | Sections 1, 2 and 3 rewritten. CG-014/CG-038 rationale replaced. ADR-002/004/005 reversal noted. |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Legacy-path test updated to probe `.spec-kit` as the former location |

### Follow-Ups

- Confirm that skill re-sync tooling treats the skill-local database as gitignored regenerable state and does not overwrite it during skill updates. The `.gitignore` rules and launcher migration-back path handle this today but the behavior should be validated when skill-sync automation is added.
- CG-013 (cwd-divergence) remains deferred. The `readiness-marker.ts` base directory still resolves from `process.cwd()` rather than from the shared canonical resolver in `core/config.ts`. Importing `core/config` at module load broke fs-mock tests in the suite. Resolve this when the fs-mock isolation strategy is updated.
