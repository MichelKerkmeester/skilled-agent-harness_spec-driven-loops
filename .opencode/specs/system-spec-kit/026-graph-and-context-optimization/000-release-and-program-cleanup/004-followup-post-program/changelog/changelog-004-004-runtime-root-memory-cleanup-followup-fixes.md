---
title: "054 Runtime Cleanup Followups: Resolver Hardening, Deprecated Purge, FTS/Vec Diagnosis"
description: "Closes out packet 096 with three runtime follow-ons: the advisor workspace-root resolver is hardened against self-perpetuating false sentinels. The indexed-continuity DB is 33% smaller after a deprecated-tier bulk delete. The FTS/vec mismatch complaint is root-caused as orphan-files drift from a prior z_archive reorganization."
trigger_phrases:
  - "054 runtime cleanup followups"
  - "advisor workspace root resolver false sentinel"
  - "deprecated tier bulk delete memory"
  - "fts vec mismatch orphan files diagnosis"
  - "findAdvisorWorkspaceRoot strict sentinel"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-08

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/004-runtime-root-memory-cleanup-followup-fixes` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program`

### Summary

After the packet 096 singular-to-plural path-residue rename, three follow-on issues remained in the runtime. The `findAdvisorWorkspaceRoot` function used a bare `.opencode/skills` sentinel that any caller could accidentally satisfy by writing into a wrong-cwd directory, which caused the resolver to return the wrong workspace root and perpetuate the problem. The `memory_health` console reported 50 mismatched IDs that prior `autoRepair` runs never fixed. The indexed-continuity database carried 2,751 deprecated-tier records, roughly 33% of its total size.

All three were addressed. The resolver sentinel was tightened to the canonical authored file `.opencode/skills/system-spec-kit/SKILL.md`, matching the strict sentinel already used by `schemas/advisor-tool-schemas.ts`. A full investigation traced the `mismatchedIds` array to `integrityReport.orphanedFiles`: memory index rows whose file paths no longer exist on disk, caused by a prior `z_archive/` reorganization rather than a vec-vs-FTS divergence. A mass cleanup of the remaining 564 non-deprecated orphan rows was deferred to a follow-on packet that will extend `verify_integrity` with a `cleanFiles: true` option. The deprecated-tier bulk delete completed in a single transactional call, auto-checkpointed for rollback. Memory count dropped from 6,858 to 4,107.

### Added

- `DEFAULT_SENTINEL` constant in `workspace-root.ts` updated to `.opencode/skills/system-spec-kit/SKILL.md`, matching the strict sentinel already in `schemas/advisor-tool-schemas.ts:29`
- JSDoc on `findAdvisorWorkspaceRoot` explaining why a bare-directory sentinel is self-perpetuating and why the fix anchors on a real authored file
- Pre-state snapshot `scratch/fts-vec-mismatch-ids.txt` capturing 50 mismatched IDs and observation notes before the deprecated purge
- Pre-state stats snapshot `scratch/pre-bulk-delete-stats.json` recording total memory count and tier breakdown
- Root-cause investigation notes in `scratch/fts-vec-diagnosis.md` tracing `mismatchedIds` to orphaned file paths from the `z_archive/` reorganization

### Changed

- Advisor unit test run baseline confirmed: 37 pre-existing failures from packet 096 legacy singular-path fixtures, zero new regressions after the sentinel change
- Post-delete `memory_health.consistency.mismatchedIds` shows 50 new IDs in the sliding window. The deprecated-tier orphan subset (IDs 445-449, 957-960, 970-989) is gone. The remaining 50 visible IDs are non-deprecated orphan rows not yet cleaned.
- `memory_stats.totalMemories` decreased from 6,858 to 4,107 and `totalTriggerPhrases` decreased from 33,058 to 21,267

### Fixed

- `findAdvisorWorkspaceRoot` could return the wrong workspace root when any caller wrote a `.opencode/skills/` directory into a wrong cwd. The new sentinel requires the specific file `.opencode/skills/system-spec-kit/SKILL.md` to exist, which eliminates the accidental match.
- 2,751 deprecated-tier records removed via `memory_bulk_delete({ tier: 'deprecated', confirm: true })` in a single atomic transaction. Auto-checkpoint `pre-bulk-delete-deprecated-2026-05-08T09-12-20` (id=1, 83.9 MB snapshot) confirms rollback path.
- `memory_health` FTS/vec mismatch diagnosis: confirmed as orphaned file rows, not a vector-vs-FTS divergence. Root cause documented with deferral rationale for the systemic cleanup.

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` after `workspace-root.ts` edit | PASS, tsc exited 0 with no output |
| `npm run build` regenerates `dist/.../workspace-root.js` with new sentinel | PASS, grep confirms `DEFAULT_SENTINEL` = `.opencode/skills/system-spec-kit/SKILL.md` |
| Advisor unit test suite (strict-sentinel fix in place) | 37 failures, 252 passes. Same as the 096-plural baseline. Zero new regressions. |
| Revert-and-rerun baseline (constant temporarily reverted to 096 value) | 37 failures, 252 passes. Identical. |
| Post-cleanup `find .opencode -maxdepth 6 -type d -path '*/.opencode/skills'` | PASS, no nested duplicates. Only `.opencode/skills/.advisor-state` remains. |
| Auto-checkpoint exists in `checkpoint_list` | PASS, id=1, name `pre-bulk-delete-deprecated-2026-05-08T09-12-20`, 83,964,851 bytes |
| `memory_stats.tierBreakdown.deprecated` after bulk delete | 0 (was 2,751) |
| `validate.sh --strict` on packet folder | PASS, 0 errors, 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/utils/workspace-root.ts` | Modified | `DEFAULT_SENTINEL` constant changed. JSDoc block added explaining anti-recurrence rationale. |
| `.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/lib/utils/workspace-root.js` | Regenerated | `npm run build` after TS source change. |
| `scratch/fts-vec-mismatch-ids.txt` (NEW) | Created | Pre-state snapshot of 50 mismatched IDs with observation notes. |
| `scratch/pre-bulk-delete-stats.json` (NEW) | Created | Pre-state `memory_stats` totals and tier breakdown for REQ-003. |
| `scratch/fts-vec-diagnosis.md` (NEW) | Created | REQ-002 root-cause investigation. Traces `mismatchedIds` to orphaned file rows from `z_archive/` reorg. |

### Follow-Ups

- Extend `verify_integrity` with a `cleanFiles: true` option to auto-clean the remaining orphaned file rows. An estimated 564 non-deprecated orphan rows remain and continue to surface in the 50-ID sliding window.
- Restart the MCP child process to load the new `dist/` sentinel. Until restarted, the running server has the old bare-sentinel module in memory.
- Run a `VACUUM` on the indexed-continuity database after the auto-checkpoint is no longer needed for rollback. The checkpoint snapshot (84 MB) is inflating the reported database size.
- Update singular-path test fixtures in the advisor test suite to plural paths. The 37 pre-existing failures from packet 096 remain until a dedicated fixture-sweep packet lands.
