---
title: "Changelog: DB Location Skill-Local (fix #1) [011-source-bug-and-misalignment-audit/004-db-location-skill-local]"
description: "Chronological changelog for the DB Location Skill-Local (fix #1) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/004-db-location-skill-local` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit`

### Summary

The code-graph database now lives inside its skill at .opencode/skills/system-code-graph/mcp_server/database/, not the workspace-root .opencode/.spec-kit/code-graph/database/. The old directory is removed and no longer recreated. Every runtime reaches the skill-local DB through the .opencode/skills symlink, so it stays a single shared instance.

### Added

- None.

### Changed

- Relocated the code-graph SQLite DB from workspace-root .opencode/.spec-kit/code-graph/database/ to the skill-local .opencode/skills/system-code-graph/mcp_server/database/, reversing ADR-002/004/005.
- Updated core/config.ts and readiness-marker.ts default DB dir and marker base to skill-local.
- Updated mk-code-index-launcher.cjs: dbDir points to skill-local; migration reversed so legacy paths probe .spec-kit; legacyLeasePaths() updated.
- Updated opencode.json, .gitignore, and socket-server.ts with new path notes and ignore rules.
- Rewrote database_path_policy.md sections 1/2/3 and swapped path strings across 9 additional docs.
- Migrated the existing DB to skill-local and removed .opencode/.spec-kit entirely.

### Fixed

- None. This is a relocation packet, not a bug fix.

### Verification

- DATABASE_DIR - .../system-code-graph/mcp_server/database (skill-local)
- typecheck - PASS (0 errors)
- full vitest - 577 passed / 1 skipped / 0 failed
- .opencode/.spec-kit - Removed (DB migrated)
- Tasks complete - 6 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp_server/core/config.ts, lib/readiness-marker.ts` | Modified | Default DB dir + marker base → skill-local |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | dbDir skill-local; migration reversed; legacy-lease probe → .spec-kit |
| `opencode.json, .gitignore, lib/ipc/socket-server.ts` | Modified | Note + ignore rules + comment |
| `references/config/database_path_policy.md + 9 docs` | Modified | Policy §1/§2/§3 rewrite (CG-014/CG-038) + path swaps |
| `mcp_server/tests/launcher-lease.vitest.ts` | Modified | Legacy-path test → .spec-kit |

### Follow-Ups

- A live DB inside the committed/symlinked skill folder must be treated as gitignored regenerable state; skill re-sync must not overwrite it. .gitignore and launcher migration-back handle this.
- readiness-marker still resolves its base dir from process.cwd() (matches config when CWD == workspace root); sharing the canonical resolver from core/config is deferred due to fs-mock test breakage at module load.
