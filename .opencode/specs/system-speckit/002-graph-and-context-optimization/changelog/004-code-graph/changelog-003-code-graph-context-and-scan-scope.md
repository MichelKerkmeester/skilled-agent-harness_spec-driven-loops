---
title: "Code Graph Phase 003: Context and Scan Scope Remediation"
description: "Three-part remediation plus two absorbed sub-phases. Stale code-graph snapshots now show highlights. Default scan scope excludes archive/future/coco-index paths and honors .gitignore. The two context surfaces are documented. Incremental full-scan recovery and cross-file dedup defense landed."
trigger_phrases:
  - "phase 003 changelog"
  - "code graph context"
  - "scan scope remediation"
  - "stale graph highlights"
  - "incremental full-scan recovery"
  - "cross-file dedup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2)
> Parent packet: `002-graph-and-context-optimization/004-code-graph`

### Summary

Three problems shipped together with two absorbed sub-phases:

1. **Stale graphs were invisible.** When the code-graph index fell out of date (no scan in 24+ hours), startup and status responses reported the graph as present with no indication of staleness. Operators had no signal that the data was old. Fix: the status handler now includes a `freshness` field with `status`, `last_scan_at`, and a `highlights` array. Stale graphs are marked `(stale)` in summaries.

2. **Default scan scope included noise.** Archive folders, future-track folders, and the CocoIndex MCP server source were indexed by default. Scans also indexed files that `.gitignore` explicitly excluded. Fix: three default exclude rules (z_future, z_archive, mcp-coco-index/mcp_server) plus `.gitignore` honoring via the `ignore@5.3.2` library.

3. **No surface documentation.** Two context surfaces (`code_graph_context` and `code_graph_query`) existed but operators did not know when to use which. Fix: a surface matrix document now maps each operation to its purpose, input shape, and output shape.

Two absorbed sub-phases shipped within this packet:

- **001-incremental-fullscan-recovery.** The scan handler previously had no way to request a full (non-incremental) re-index. The `IndexFilesOptions { skipFreshFiles }` contract was added, threaded through `indexFiles()`, and exposed in the scan handler. The scan response gained `fullScanRequested` and `effectiveIncremental` fields.
- **002-cross-file-dedup-defense.** Multiple files containing the same symbol (e.g. re-exports) caused UNIQUE constraint errors during scan persistence because the indexer tried to INSERT the same symbol twice. The fix added a `seenSymbolIds` Set at the `capturesToNodes()` level and `INSERT OR IGNORE` at the persistence level.

Implementation reached 85 percent completion. The full vitest suite pass was partially blocked by a pre-existing failure in `copilot-hook-wiring.vitest.ts` (out of scope). The 3-core code-graph tests all passed.

### Added

- `freshness` object in status handler response with `status`, `last_scan_at`, and `highlights` array
- Stale-graph highlights: when last scan exceeds 24 hours, summary freshness shows `(stale)`
- Three default exclude rules for scan scope: z_future, z_archive, mcp-coco-index/mcp_server
- `.gitignore` honoring in the scan pipeline via `ignore@5.3.2`
- Surface matrix document at `docs/code-graph-surface-matrix.md`
- `IndexFilesOptions { skipFreshFiles: boolean }` contract for incremental vs. full-scan control
- `fullScanRequested` and `effectiveIncremental` fields in scan handler response
- `seenSymbolIds` per-file dedup Set in the indexer
- `INSERT OR IGNORE` at the code-nodes persistence path

### Changed

- Status handler now computes freshness from `last_scan_at` and marks stale graphs
- Scan handler defaults to end-user scope with the three exclude rules
- Scan handler honors `.gitignore` patterns during file collection
- `indexFiles()` accepts `IndexFilesOptions` to control incremental behavior
- `capturesToNodes()` dedupes on seen symbol IDs before persistence

### Fixed

- Stale graphs were reported as "healthy" with no staleness signal. Now marked `(stale)` after 24 hours.
- Archive and future-track files polluted scan results. Now excluded by default.
- Files in `.gitignore` were scanned despite being excluded from version control. Now skipped.
- UNIQUE constraint errors during cross-file symbol persistence. Fixed by `seenSymbolIds` dedup plus `INSERT OR IGNORE`.

### Verification

- Code-graph vitest: 20 tests pass (baseline was 17, 3 new tests added for the incremental-scan and dedup paths).
- Build (`npm run build`): exit 0.
- Strict packet validation (`validate.sh --strict`): passed.
- Manual scan test with exclude rules: file count dropped from approximately 9,400 to approximately 1,425 files in end-user scope.

### Files Changed

| File | What changed |
|------|--------------|
| `code_graph/handlers/status.ts` | Freshness computation, `(stale)` marking, `highlights` array |
| `code_graph/handlers/scan.ts` | Default excludes, `.gitignore` honoring, `IndexFilesOptions` threading, `fullScanRequested`/`effectiveIncremental` fields |
| `code_graph/lib/structural-indexer.ts` | `IndexFilesOptions` contract, `seenSymbolIds` dedup, `INSERT OR IGNORE` persistence |
| `code_graph/lib/excludes.ts` (NEW) | Default exclude rules and `.gitignore` integration |
| `docs/code-graph-surface-matrix.md` (NEW) | Surface operation-to-purpose mapping |

### Follow-Ups

- **T-19 full vitest suite (blocked).** The full vitest suite run was blocked by `copilot-hook-wiring.vitest.ts` failure out of scope for this packet. A follow-up packet should verify the full suite after that unrelated test is fixed.
- **Operator-driven full-scan recovery rerun.** After the stale-gate bug fix, the operator-driven scan should be rerun to confirm the full 1,425-file count (currently 33 files due to the stale-gate regression). This is filed as a Phase 012 live-verification item.
