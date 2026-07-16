---
title: "Code Graph Phase 012/004: Index can no longer be wiped"
description: "Two ways the index could lose all its data are now closed. F-002 zero-node guard rejects scans that produce zero nodes when the prior index had data. F-003 parse-error preservation keeps prior good rows when the parser errors on a single file."
trigger_phrases:
  - "phase 012/004 changelog"
  - "F-002 zero-node guard"
  - "F-003 parse-error preservation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2)
> Parent packet: `027-graph-and-context-optimization/004-code-graph`

### Summary

Live testing in phase 012/001 surfaced two ways the populated index could lose all its data without warning. Both were P0 (must-fix) findings.

**F-002 zero-node wipe.** A scan that returned zero nodes (because of a scope mistake or a parser crash) would overwrite the existing populated index with empty data. A 56,843-node graph could go to zero in one scan with no recovery path.

**F-003 parse-error poisoning.** When the tree-sitter parser errored on a single file (the file had a syntax error or the parser crashed), the per-file diagnostic write would blow away the previously good graph rows for that same file. One bad file could erase every node and edge it had contributed before.

After this phase, F-002 added a zero-node guard at the scan promotion site. If a new scan produces zero nodes but the prior index had nodes, the scan is rejected and the existing graph is preserved. F-003 changed the per-file persistence path so parse errors are recorded as diagnostics without touching the previously good per-file rows.

### Added

- Zero-node guard at the scan promotion site. When `forceZeroNodeReset` is not explicitly true, a scan with zero candidate nodes against a populated index produces `status: blocked, reason: 'zero_node_scan_rejected'` and preserves prior `totalNodes` and `totalEdges`.
- Parse-error preservation. `recordParseDiagnosticsForResults()` records the diagnostic without touching prior good per-file rows.

### Changed

- Scan handler now exits early via the blocked-zero-node branch before promoting the new graph state.
- Console warnings on the blocked path tell the operator how to override (`forceZeroNodeReset: true`) and remind them of the prior node count.

### Fixed

- F-002: A populated 56k-node graph could be wiped in one accidental scan. No more.
- F-003: A single file with a parse error could erase its previously good rows. The diagnostic now lives alongside the prior data, not in place of it.

### Verification

- Vitest cases that simulate zero-node scans against populated indexes all assert the blocked path and verify the prior graph survives.
- Live test against the production database: a default-scope scan after a broader-scope scan reported 137 candidate files, 5 nodes, then was correctly rejected with `scope_change_scan_rejected`. The 55,978-node prior index was preserved.

### Files Changed

| File | What changed |
|------|--------------|
| `code_graph/handlers/scan.ts` | New `zeroNodePromotionBlocked` branch at line 255. Logs a warning at line 339. Returns blocked-status response at line 324. |
| `code_graph/lib/code-graph-db.ts` | Per-file persistence preserves prior rows when the new result is a parse error. |
| `code_graph/lib/structural-indexer.ts` | Threaded the parse-error preservation contract through the indexer pipeline. |

Plus a documentation pass that purged em-dashes from the code-graph README. Commit: `646f28d2b`.

### Follow-Ups

- Phase 012/005 broadened the zero-node guard to a full scope-fingerprint guard, closing the sneakier case where a scope mismatch could shrink an index without producing zero nodes.
- Phase 012/006 wired the blocked-scan metadata into `lastFailedScan` so operators can see why a scan was rejected.
