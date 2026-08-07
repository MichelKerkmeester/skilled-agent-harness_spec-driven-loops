---
title: "Skill Advisor Package Extraction Phase 003: Advisor Source DB and Tests Migration Recalibration"
description: "Finalized the partially completed advisor source move: rewrote 181 old spec-path references, repaired bridge imports, authored standalone package configs with an env-override DB resolver. Bridge typecheck and strict packet validation both passed."
trigger_phrases:
  - "advisor move recalibration"
  - "advisor bridge import repair"
  - "system skill advisor package extraction 003"
  - "skill advisor db resolver env override"
  - "finalize advisor move spec path rewrite"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/003-advisor-source-db-tests-migration` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The advisor source tree and its spec packet were moved outside git tracking before this phase ran. The physical move was already complete but 181 spec-path references still pointed at the retired `015-skill-advisor-semantic-lane` lineage. Bridge imports in `system-spec-kit/mcp_server/context-server.ts` still resolved advisor handlers from the deleted source location. The advisor DB resolver still defaulted to the old Spec Kit database directory with no env override.

Step A applied a scoped mechanical rewrite across 97 files, canonicalizing all packet metadata to the new `008-skill-advisor/013-skill-advisor-semantic-lane` nesting. The moved `013` packet was added to the `008` parent graph. Step B applied targeted code patches: bridge imports were repointed to `system-skill-advisor/mcp_server`, the DB resolver default was flipped to the standalone package path, `SYSTEM_SKILL_ADVISOR_DB_DIR` was added as an env override. All 16 required TypeScript string literals were rewritten. Package configs (`tsconfig.json`, `vitest.config.ts`, `package.json`) were authored for the standalone package. The old DB stub was confirmed absent so no deletion was performed.

### Added

- `tsconfig.json` for the standalone `system-skill-advisor/mcp_server` package
- `vitest.config.ts` for the standalone `system-skill-advisor/mcp_server` package
- `package.json` for the standalone `system-skill-advisor/mcp_server` package
- `SYSTEM_SKILL_ADVISOR_DB_DIR` environment variable override in the advisor DB resolver
- Moved `013` child entry in `006-skill-advisor/graph-metadata.json` parent graph

### Changed

- `context-server.ts` advisor handler imports repointed from `./skill_advisor/` to `../../system-skill-advisor/mcp_server/`
- Advisor DB resolver default path flipped from `system-spec-kit/mcp_server/database` to `system-skill-advisor/mcp_server/database`
- All 16 required TypeScript string literals in the moved tree rewritten to the new `008/013` lineage (0 kept)
- `system-skill-advisor/mcp_server/README.md` updated from scaffold stub to landed-tree description
- `system-skill-advisor/SKILL.md` and `ARCHITECTURE.md` old packet references updated to new paths
- 181 spec-path replacements across 97 files canonicalizing `015-skill-advisor-semantic-lane` to `008-skill-advisor/013-skill-advisor-semantic-lane`

### Fixed

- Bridge imports in `context-server.ts` that pointed to the deleted old source location now resolve to the landed package
- `graph-metadata.json` and `description.json` for the moved `013` tree now carry canonical packet ids and parent chains
- DB resolver no longer defaults to the old Spec Kit database path

### Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Rename sweep | Pass | Required old-path sweep returned 0 hits for retired `015` lineage |
| Typecheck | Pass | `cd .opencode/skills/system-spec-kit/mcp_server && npm run typecheck` exited 0 |
| Vitest | Recorded | `npx vitest run skill_advisor` filter found no test files after the move. Fail count 0. Child 005 will wire vitest discovery from the new location. |
| Strict validation 003 | Pass | `validate.sh .../003-advisor-source-db-tests-migration --strict` exited 0 |
| Strict validation 009 | Pass | `validate.sh .../009-system-skill-advisor-extraction --strict` exited 0 |
| Strict validation 013 | Pass | `validate.sh .../002-semantic-routing-lane --strict` exited 0 |
| Strict validation 008 | Pass | `validate.sh .../006-skill-advisor --strict` exited 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Advisor handler imports repointed to `system-skill-advisor/mcp_server` |
| `.opencode/skills/system-skill-advisor/mcp_server/tsconfig.json` (NEW) | Standalone package TypeScript config |
| `.opencode/skills/system-skill-advisor/mcp_server/vitest.config.ts` (NEW) | Standalone package Vitest config |
| `.opencode/skills/system-skill-advisor/mcp_server/package.json` (NEW) | Standalone package manifest |
| `.opencode/skills/system-skill-advisor/mcp_server/README.md` | Updated from scaffold stub to landed-tree description |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Old packet path references updated to new `008/013` lineage |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Old packet path references updated to new `008/013` lineage |
| `spec/008-skill-advisor/graph-metadata.json` | Moved `013` child added to children list |

### Follow-Ups

- Standalone launcher and runtime config wiring remain the responsibility of child 004.
- Hook compatibility, plugin bridge, Python shim, doctor:update consumer cutover all remain the responsibility of child 005.
- Package-local typecheck needs a build-boundary decision in a later packet because `rootDir: "."` conflicts with shared Spec Kit imports. The required bridge typecheck passes in the interim.
