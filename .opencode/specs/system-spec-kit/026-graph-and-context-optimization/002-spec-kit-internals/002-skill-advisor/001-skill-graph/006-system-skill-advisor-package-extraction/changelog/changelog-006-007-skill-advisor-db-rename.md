---
title: "Changelog: Skill graph DB rename"
description: "Renamed the spec-kit skill metadata index from skill-graph.sqlite to graph-metadata-index.sqlite so the advisor scorer DB is the only skill-graph.sqlite in the repo after package extraction."
trigger_phrases:
  - "skill graph db rename"
  - "graph-metadata-index sqlite"
  - "spec-kit skill-graph sqlite collision"
  - "skill advisor db disambiguation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/007-skill-advisor-db-rename` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

After the system-skill-advisor package extraction, two unrelated databases shared the filename `skill-graph.sqlite`. The spec-kit `skill_graph_*` metadata indexer wrote to `system-spec-kit/mcp_server/database/skill-graph.sqlite` while the advisor scorer projection DB used the same name under `system-skill-advisor/mcp_server/database/`. The collision caused operator confusion and produced stale old-path files on every `spec_kit_memory` startup.

The spec-kit skill metadata index was renamed to `graph-metadata-index.sqlite`. The new name precisely describes what the DB indexes: every `graph-metadata.json` across the skills tree. The advisor `skill-graph.sqlite` is now the sole file with that name in the repo. The `skill_graph_*` MCP tools remain registered under `spec_kit_memory` with no topology change.

### Added

- `DB_FILENAME` constant exported from `skill-graph-db.ts` so downstream consumers avoid re-hardcoding the filename.
- Updated `skill_graph_scan` description text in `tool-schemas.ts` to document the new filename.
- Updated local skill-graph DB documentation in the skill-graph `README.md`.

### Changed

- `DB_FILENAME` in `lib/skill-graph/skill-graph-db.ts` renamed from `skill-graph.sqlite` to `graph-metadata-index.sqlite`.
- `SKILL_GRAPH_DATABASE_PATH` in `context-server.ts` now uses the exported `DB_FILENAME` constant.
- Checkpoint migration scripts (`create-checkpoint.ts`, `restore-checkpoint.ts`) now use the shared `DATABASE_DIR` rather than hardcoded old-path construction.
- Five stale test fixtures migrated away from the old spec-kit path to advisor-owned or temp-local paths.

### Fixed

- Stale old-path `skill-graph.sqlite` trio (`-shm` and `-wal` included) removed from the spec-kit database directory after live handle release via `SIGTERM` plus `lsof` verification.
- Advisor-side fixture DB paths corrected in four test files so tests no longer reference the old spec-kit path.
- Stress fixture in `mcp-diagnostics-stress.vitest.ts` pointed at the canonical advisor DB path.

### Verification

| Check | Result |
|-------|--------|
| Spec-kit build (`npm run build --workspace=@spec-kit/mcp-server`) | PASS |
| Memory MCP smoke start | PASS. `graph-metadata-index.sqlite` created at spec-kit path. |
| Advisor launcher smoke start | PASS. Canonical advisor DB path preserved. |
| Targeted spec-kit skill-advisor stress Vitest | PASS. 3 of 3 tests. |
| Old spec-kit DB cleanup | PASS. Old `skill-graph.sqlite*` files removed. |
| Advisor package Vitest overall | FAIL. 164 of 224 passing. Up 11 from 006 baseline of 153 of 224. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | Renamed DB filename constant to `graph-metadata-index.sqlite` and exported it. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Uses exported `DB_FILENAME` constant for `SKILL_GRAPH_DATABASE_PATH`. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts` | Modified | Uses shared `DATABASE_DIR` constant. Removes stale hardcoded path. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts` | Modified | Uses shared `DATABASE_DIR` constant. Removes stale hardcoded path. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | Updated `skill_graph_scan` description to document `graph-metadata-index.sqlite`. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/projection-fallback-049-005.vitest.ts` | Modified | Replaced old spec-kit fixture DB path with advisor-owned path. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-freshness.vitest.ts` | Modified | Moved legacy freshness fixture paths to the advisor package tree. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-status.vitest.ts` | Modified | Replaced old spec-kit fixture DB path with advisor-owned path. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Modified | Replaced extra stale old-path fixture discovered by repo search. |

### Follow-Ups

- The broader advisor package suite still fails at 164 of 224 passing tests. The remaining failures are outside the scope of this DB rename and require a separate remediation packet.
- Memory MCP startup still logs a pre-existing `skill_id` versus folder-name mismatch warning for `system-skill-advisor/graph-metadata.json`. That warning is unrelated to DB filename paths and does not block startup.
- Moving `skill_graph_*` MCP tools from `spec_kit_memory` to `system_skill_advisor` (Option A) was intentionally deferred. A future topology consolidation packet can evaluate that change independently.
