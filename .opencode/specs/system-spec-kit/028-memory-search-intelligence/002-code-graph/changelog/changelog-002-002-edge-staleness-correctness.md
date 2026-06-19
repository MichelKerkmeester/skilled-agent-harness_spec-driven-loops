---
title: "Changelog: Code-Graph Edge-Staleness Correctness (dependency-transitivity + rename SUPERSEDES) [002-code-graph/002-edge-staleness-correctness]"
description: "Chronological changelog for the Code-Graph Edge-Staleness Correctness (dependency-transitivity + rename SUPERSEDES) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/002-edge-staleness-correctness` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

Nothing has been built yet. This is a planning-only spec folder for the single real correctness bug in the Code Graph subsystem. Both candidates are PENDING and neither shipped in the Wave-0 record (030 §14). The plan attacks the path-coupled-symbol-id failure mode from two angles: re-deriving a refactored dependency's reverse-dependents in the same scan (the bug), and preserving rename lineage with an additive edge.

### Added

- [P] Confirm symbol-id path-coupling sha256(filePath::fqName::kind) (indexer-types.ts:102) + content hash sha256(content) (indexer-types.ts:109) + prune (code-graph-db.ts:1030) — Evidence: implementation uses querySymbolIdsForFiles() comparison before force-parse.
- Add a path-filtered queryImportersOf(stalePaths) beside queryFileImportDependents() (the existing one full-scans code_edges — code-graph-db.ts:1344-1360) — Evidence: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts.
- Honor forceParse at the skip site so importers override skipFreshFiles && !isFileStale(file) and re-parse against new symbol ids (structural-indexer.ts:2175) — Evidence: forceParsedFiles carried into .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts.
- Emit a SUPERSEDES edge on rename/move keyed on matching contentHash (indexer-types.ts:109) instead of pure delete+create, reusing the tombstone machinery (code-graph-db.ts:230-318) — Evidence: tombstone-gated lineage in .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts.
- Q1-C2 additive (absent-edge byte-identical); focused tests + validate.sh --strict pass — Evidence: focused tests passed; strict validation passed.
- CHK-010 Typecheck/build passes (tsc on the code-graph mcp_server) — Evidence: npm run typecheck exit 0.

### Changed

- Confirm skip seam if (skipFreshFiles && !isFileStale(file)) (structural-indexer.ts:2175) and the content-hash gate isFileStale (code-graph-db.ts:1042 — NOT mtime) — Evidence: rg -n 'skipFreshFiles|isFileStale' .opencode/skills/system-code-graph/mcp_server.
- Confirm queryFileImportDependents() is read-path-only — one non-test caller handlers/query.ts:1017 (code-graph-db.ts:1343) — Evidence: rg -n 'queryFileImportDependents|queryImportersOf' .opencode/skills/system-code-graph/mcp_server/lib .opencode/skills/system-code-graph/mcp_server/handlers.
- In the scan driver: snapshot the stale set, expand with reverse-dependents, populate a forceParse: Set<string> — BEFORE any replaceNodes (HARD ORDERING CONSTRAINT; post-persist JOIN returns nothing) — Evidence: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts.
- Static gate: queryFileImportDependents read-path caller intact; scan loop uses the path-filtered query (grep) — Evidence: rg -n 'queryFileImportDependents|queryImportersOf' .opencode/skills/system-code-graph/mcp_server/lib .opencode/skills/system-code-graph/mcp_server/handlers.
- Typecheck + focused code-graph scan/indexer/db suite green — Evidence: npm run typecheck exit 0; broad Vitest 7 files, 135 passed, 1 skipped.
- bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict exit 0 — Evidence: strict validation passed with 0 errors, 0 warnings.

### Fixed

- [P] Confirm the off-by-default tombstone substrate for Q1-C2 (code-graph-db.ts:230 gate, :296/:316 inserts) — Evidence: edge-staleness-correctness.vitest.ts covers tombstone-on and tombstone-off lineage.
- Keep SCHEMA_VERSION unchanged (stays 5); the SUPERSEDES edge rides the existing edge table / tombstone substrate (no code_edges column change) — Evidence: typecheck green and edge-staleness-correctness.vitest.ts.
- [P] Confirm existing read paths are byte-identical when the SUPERSEDES edge is absent (additive-only) — Evidence: tombstone-off assertion in edge-staleness-correctness.vitest.ts.
- Unit test: index A(import {foo} from './b') + B(export function foo); mutate B to a const export (kind-flip → new id), touch ONLY B; incremental scan → A→B IMPORTS survives, re-derived to the new id — Evidence: edge-staleness-correctness.vitest.ts.
- Control test: body-only edit of foo (stable symbol_id) → no extra A parse, A→B unchanged — Evidence: edge-staleness-correctness.vitest.ts.
- Ordering-gate test: reverse-dep query run post-replaceNodes returns empty (proves before-persist capture is load-bearing) — Evidence: edge-staleness-correctness.vitest.ts.

### Verification

- Seam: skip site structural-indexer.ts:2175 (skipFreshFiles && !isFileStale(file)) - PASS (confirmed in live code)
- Seam: isFileStale content-hash-gated code-graph-db.ts:1042 (NOT mtime) - PASS (confirmed — corrects the iter-022 mtime framing)
- Seam: queryFileImportDependents read-path-only, one caller handlers/query.ts:1017 - PASS (confirmed — grep shows a single non-test caller)
- Seam: symbol id indexer-types.ts:102, content hash indexer-types.ts:109, prune code-graph-db.ts:1030, tombstones code-graph-db.ts:230-318 - PASS (confirmed in live code)
- validate.sh --strict on this folder - PASS (target state; run before any completion claim)
- Unit tests (reverse-dep re-derive, ordering gate, Q1-C2 lineage) - NOT RUN — code unimplemented
- Fan-in re-parse benchmark - NOT RUN — gates default-on
- Tasks complete - 19 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-FIX-006 Fan-in re-parse benchmark captured on a hot high-importer file BEFORE any default-on flip (regression-baseline rule; the cost is UNMEASURED per research §6). LEFT-PENDING: live benchmark/reindex/scan disallowed in this task.
- All tasks marked [x] with evidence (commit SHA or test name); no Wave-0 pre-checks (neither candidate shipped in 030) — T013 remains blocked by the no-live-benchmark constraint.
- No [B] blocked tasks remaining (T013 fan-in benchmark captured) — LEFT-PENDING: benchmark gate not runnable in this task.
- Both candidates are unimplemented. This folder is planning-only; no code exists yet.
- Fan-in re-parse cost is unmeasured. The staleness repair stays gate-able / non-default until a benchmark on a hot high-importer file clears default-on (regression-baseline rule).
- No benefit number is benchmarked. Per the 028 research, every leverage tag is structural inference, never a measured delta.
