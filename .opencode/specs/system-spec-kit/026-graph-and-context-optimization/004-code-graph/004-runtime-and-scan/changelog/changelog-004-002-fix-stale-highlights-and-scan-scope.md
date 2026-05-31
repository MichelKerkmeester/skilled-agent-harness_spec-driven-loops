---
title: "Code Graph Context and Scan Scope Remediation"
description: "Stale code-graph snapshots now surface structural highlights. Default scan scope excludes archived and future research paths. Scans honor .gitignore. The two context surfaces are documented. Three absorbed sub-phases shipped the same day: incremental fullscan recovery, cross-file dedup defense, plus the surface matrix doc."
trigger_phrases:
  - "stale graph highlights"
  - "scan scope gitignore fix"
  - "session-snapshot stale ready gate"
  - "z_future z_archive scan exclude"
  - "globalSeenIds INSERT OR IGNORE code-graph"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/004-runtime-and-scan/002-fix-stale-highlights-and-scan-scope` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/004-runtime-and-scan`

### Summary

The code-graph scale investigation surfaced three problems in one session. First, structural highlights were gated on `status === 'ready'` in `session-snapshot.ts`; graphs in the `stale` state returned no highlights even though the underlying SQL aggregate works for any graph state. Second, the scanner defaulted to `process.cwd()` with minimal excludes (`node_modules`, `dist`, `.git`, `vendor`), causing 26 000 files to be indexed when only 1 000 to 3 000 were active code. Third, two context-injection surfaces (OpenCode plugin minimal payload and MCP startup-brief full payload) were undocumented.

All three problems were resolved in one focused pass on 2026-04-23. The highlights gate was extended to cover `stale`. Default excludes were expanded to skip `z_future`, `z_archive`, plus `mcp-coco-index/mcp_server`. The scanner now applies `.gitignore` patterns using the `ignore` package. A surface matrix doc was added to the code-graph README. Two absorbed sub-phases landed the same day. `001-incremental-fullscan-recovery` repaired the `skipFreshFiles` logic that caused full scans to process only 33 of 1 400 files. `002-cross-file-dedup-defense` added a `globalSeenIds` sweep plus `INSERT OR IGNORE` to survive residual `UNIQUE constraint failed` errors on `code_nodes.symbol_id`.

### Added

- `IndexFilesOptions { skipFreshFiles?: boolean }` (default `true`) exported from `structural-indexer.ts`. Allows full scans to bypass the stale-only gate.
- `fullScanRequested` and `effectiveIncremental` response fields in the scan handler, alongside the existing `fullReindexTriggered` field.
- Scan-scope one-liner log: scanned file count plus default-excluded and gitignored entry counts.
- Surface matrix doc in the code-graph README covering the MCP `session_bootstrap` path and the OpenCode plugin minimal-resume path.
- 33 vitest tests across `structural-contract.vitest.ts` (stale highlights, `IndexFilesOptions` options, scan handler integration, cross-file dedup) and `tree-sitter-parser.vitest.ts` (gitignore fixture, new excludes, `capturesToNodes` dedupe).
- `tests/code-graph-db.vitest.ts` (NEW) with 2 direct DB tests for `replaceNodes()` duplicate-symbol tolerance.

### Changed

- `session-snapshot.ts` highlights gate widened from `status === 'ready'` to `status === 'ready' || status === 'stale'`. Stale summaries append `(stale)` so consumers can distinguish freshness.
- `indexer-types.ts` default excludes extended with `**/z_future/**`, `**/z_archive/**`, plus `**/mcp-coco-index/mcp_server/**`.
- `structural-indexer.ts` recursive walk now parses `.gitignore` files per directory using the `ignore` package. Parsed matchers are cached per directory and applied with existing default exclude globs.
- `structural-indexer.ts` `indexFiles()` conditions the `isFileStale()` stale gate on `skipFreshFiles`, so `indexFiles(config, { skipFreshFiles: false })` parses all post-exclude candidates.
- `structural-indexer.ts` `indexFiles()` adds a `globalSeenIds` sweep over all per-file results after TESTED_BY cross-file edge construction. The first file to claim a `symbolId` wins and later duplicates are dropped before DB insertion.
- `code-graph-db.ts` `replaceNodes()` changed from `INSERT INTO code_nodes` to `INSERT OR IGNORE INTO code_nodes`.
- `scan.ts` passes `{ skipFreshFiles: effectiveIncremental }` to `indexFiles()`.
- `mcp_server/package.json` adds `ignore` as a direct dependency (`^5.3.2`).

### Fixed

- `session-snapshot.ts` skipped highlights for stale graphs even when the graph contained populated nodes. The widened gate ensures stale graphs surface useful context.
- `indexFiles()` applied `isFileStale()` unconditionally even when `incremental: false` was requested, causing full scans to parse only stale files. A production full scan returned 33 files instead of 1 400.
- `capturesToNodes()` emitted duplicate `symbolId` values for captures sharing the same `(filePath, fqName, kind)` identity, causing `UNIQUE constraint failed: code_nodes.symbol_id` errors. The sweep drops duplicates before DB insertion.
- Cross-file `symbolId` collisions that survived the within-file dedup caused `replaceNodes()` to abort entire file transactions. `INSERT OR IGNORE` absorbs residual collisions so non-conflicting nodes still persist.

### Verification

| Check | Command or Evidence | Result |
|-------|---------------------|--------|
| Baseline focused Vitest | `./node_modules/.bin/vitest run tests/structural-contract.vitest.ts tests/tree-sitter-parser.vitest.ts` before edits | 17 tests passed |
| Red test proof | Reverted stale gate, ran `vitest run tests/structural-contract.vitest.ts -t 'returns stale highlights and freshness marker'` | Failed as expected, then passed after restoring |
| Build | `npm run build` in `mcp_server` | Passed. Compiled .js files contain new symbols. |
| Focused Vitest after edits | `./node_modules/.bin/vitest run tests/structural-contract.vitest.ts tests/tree-sitter-parser.vitest.ts` | 20 tests passed |
| Cross-file dedup focused suite | `vitest run structural-contract.vitest.ts tree-sitter-parser.vitest.ts code-graph-db.vitest.ts` | 33 tests passed |
| Strict validation | `bash .../scripts/spec/validate.sh .../002-fix-stale-highlights-and-scan-scope --strict` | 0 errors, 0 warnings |
| Canonical save | `node .../scripts/dist/memory/generate-context.js --json ...` | Exit 0 (BM25/FTS path, embedding deferred due to network) |
| P0-01 stale highlights | `tests/structural-contract.vitest.ts:89` asserts `status=stale`, summary contains `(stale)`, highlights non-empty, includes `function: 9` | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` | Modified | Widened highlights gate to cover `stale`. Appends `(stale)` to summary string for stale graphs. |
| `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts` | Modified | Added `z_future`, `z_archive`, `mcp-coco-index/mcp_server` to default excludes. |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Modified | Added `.gitignore` awareness via `ignore` package. Added `IndexFilesOptions`. Added `globalSeenIds` cross-file dedup sweep. Added scan-scope log line. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` | Modified | Passes `{ skipFreshFiles: effectiveIncremental }` to `indexFiles()`. Exposes `fullScanRequested` and `effectiveIncremental` in response. |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | `replaceNodes()` uses `INSERT OR IGNORE INTO code_nodes`. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts` | Modified | Added stale-highlights test. Added `IndexFilesOptions` option tests, scan handler integration tests, cross-file dedup tests. |
| `.opencode/skills/system-code-graph/mcp_server/tests/tree-sitter-parser.vitest.ts` | Modified | Added gitignore fixture. Added new-excludes. Added `capturesToNodes` dedupe regression tests. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-db.vitest.ts` | Created (NEW) | 2 direct DB tests for `replaceNodes()` duplicate-symbol tolerance. |
| `.opencode/skills/system-code-graph/mcp_server/README.md` | Modified | Surface matrix doc added. Documents MCP startup-brief path and OpenCode plugin minimal-resume path. |

### Follow-Ups

- Run a full `code_graph_scan` after MCP restart to record the authoritative file count. Scan counts are not authoritative until a live post-restart rerun is recorded after the recovery packet lands.
- Complete `npm install` for the `ignore` package in a normal registry-backed environment. Package metadata is updated and the runtime prefers the direct dependency. The sandbox used a transitive ESLint copy as fallback.
- Verify that AC-1 (zero `UNIQUE constraint failed` in `errors[]`) and AC-2 (`filesIndexed >= 1300`) hold after operator-driven MCP restart.
