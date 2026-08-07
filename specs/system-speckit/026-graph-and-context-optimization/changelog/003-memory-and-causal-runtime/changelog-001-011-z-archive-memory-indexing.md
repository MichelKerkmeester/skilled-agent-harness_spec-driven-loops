---
title: "Continuity Memory Runtime Phase 011: z_archive Memory Indexing Fix"
description: "Removed the redundant z_archive exclusion from EXCLUDED_FOR_MEMORY so the pre-existing ARCHIVE_MULTIPLIERS decay system operates as designed. 2618 z_archive rows now indexed with a 0.1 decay multiplier applied. Four test assertions updated and an Index scope vs scoring decay SSOT section added to the utils README."
trigger_phrases:
  - "z_archive memory indexing"
  - "EXCLUDED_FOR_MEMORY z_archive"
  - "ARCHIVE_MULTIPLIERS decay fix"
  - "index-scope z_archive exclusion"
  - "memory index decay multiplier"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-16

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/011-z-archive-memory-indexing` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

Two subsystems in the spec-kit memory runtime contradicted each other. `lib/utils/index-scope.ts` blocked all `z_archive/` paths from the memory index via `EXCLUDED_FOR_MEMORY`, while `shared/scoring/folder-scoring.ts` defined an `ARCHIVE_MULTIPLIERS` decay multiplier of 0.1 to deprioritize but retain archived content in search rankings. The exclusion override made archived spec content invisible to memory search, even when its decay-adjusted relevance would have placed it ahead of newer noise.

The fix removed `compileSegmentPattern('z_archive')` from `EXCLUDED_FOR_MEMORY`. After a forced reindex, 2618 z_archive rows now appear in `memory_index` with the 0.1 multiplier applied. Four test assertions across two vitest files were updated to reflect the corrected behavior. A new "Index scope vs scoring decay" SSOT section in the utils README documents the binary-exclusion vs multiplicative-decay distinction as a durable rule.

### Added

- "Index scope vs scoring decay" SSOT section in `.opencode/skills/system-spec-kit/mcp_server/lib/utils/README.md` documenting the rule that paths with an `ARCHIVE_MULTIPLIERS` entry stay out of `EXCLUDED_FOR_MEMORY`

### Changed

- `lib/utils/index-scope.ts`: removed `compileSegmentPattern('z_archive')` from `EXCLUDED_FOR_MEMORY` so z_archive paths pass `shouldIndexForMemory()`
- `mcp_server/dist/lib/utils/index-scope.js`: rebuilt compiled artifact after the source edit
- `tests/index-scope.vitest.ts`: updated assertions to expect z_archive paths as indexable
- `tests/full-spec-doc-indexing.vitest.ts`: updated assertions to reflect z_archive inclusion in full-spec indexing
- `.opencode/commands/doctor/assets/doctor_update.yaml`: removed stale FIX-13 comment claiming z_archive is excluded
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`: updated error-recovery message at line 220 that referenced the old exclusion behavior

### Fixed

- `shouldIndexForMemory()` returned false for `z_archive/` paths, making archived spec content invisible to memory search even when decay-adjusted relevance was high. Removing the exclusion entry restores the intended decay-only deprioritization.
- Five docs in `010-memory-indexer-invariants/` contained stale "z_archive is excluded" claims. Post-script comments were added citing commit `b062b12b4` as the design-clarification source without rewriting the original analysis.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/index-scope.vitest.ts tests/full-spec-doc-indexing.vitest.ts` | 159 / 159 pass |
| `SELECT COUNT(*) FROM memory_index WHERE file_path LIKE '%/z_archive/%'` | 2618 rows |
| `getArchiveMultiplier('/specs/foo/z_archive/bar')` | 0.1 (intact) |
| `validate.sh --strict` on packet 113 | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Removed `compileSegmentPattern('z_archive')` from `EXCLUDED_FOR_MEMORY` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/utils/README.md` | Added Index scope vs scoring decay SSOT section |
| `.opencode/skills/system-spec-kit/mcp_server/tests/index-scope.vitest.ts` | Updated 4 assertions for z_archive indexability |
| `.opencode/skills/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts` | Updated assertions to reflect z_archive inclusion |
| `.opencode/commands/doctor/assets/doctor_update.yaml` | Removed stale FIX-13 exclusion comment |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Updated stale error-recovery message referencing old exclusion behavior |

### Follow-Ups

- Promote a code-graph z_archive policy if structural archive queries become valuable. `EXCLUDED_FOR_CODE_GRAPH` still excludes z_archive because code graph has no decay multiplier. This is not a regression but a deferred decision.
- Verify the 12 doc fixes in `010-memory-indexer-invariants/` remain accurate over time as the index-scope design evolves.
