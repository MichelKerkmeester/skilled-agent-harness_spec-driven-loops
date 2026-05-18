---
title: "Code Graph Phase 001: Code Graph Upgrades"
description: "Five additive upgrade lanes shipped: detector provenance taxonomy, bounded blast-radius correctness, edge evidence enrichment, hot-file advisory breadcrumbs, and a frozen regression floor. All lanes landed with passing typecheck, vitest, and strict packet validation."
trigger_phrases:
  - "phase 001 changelog"
  - "code graph upgrades"
  - "detector provenance"
  - "blast radius fix"
  - "edge evidence enrichment"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-09

> Spec folder: `026-graph-and-context-optimization/005-code-graph/001-code-graph-runtime-upgrades` (Level 3)
> Parent packet: `026-graph-and-context-optimization/005-code-graph`

### Summary

The code-graph index had no way to trace which detector produced each edge. Call-graph queries (`calls_from`, `calls_to`) returned wrong results when symbol names collided across files. Edge metadata was bare. Operators had no breadcrumbs to find files with the most unresolved symbols. The regression test floor was absent.

Five additive upgrade lanes shipped across 5 PRs and 4 commits:

1. **Detector provenance taxonomy.** Every edge stored in the graph now carries a `detector` column (tree-sitter, glob, or heuristics) and an `evidence` column with structured JSON. Queries return the provenance alongside results.
2. **Bounded blast-radius correctness.** The `blast_radius` operation now resolves file paths through the same index rather than relying on a separate file-system walk. This fixed collisions where identically named symbols in different files produced wrong results.
3. **Edge evidence enrichment.** Import edges now record the specific import declaration that created them. Call edges record the caller and callee locations with line numbers.
4. **Hot-file advisory breadcrumbs.** The graph index now tracks `unresolved_symbol_count` per file. Status queries expose the top 10 files with the most unresolved symbols as operator breadcrumbs.
5. **Frozen regression floor.** A 17-test baseline battery locked the existing behavior. No upgrade could change a result without an explicit battery update.

Lanes A and B shipped together. Lane C (hot-file breadcrumbs) shipped next. Lane D (edge evidence enrichment) followed. Lane E (regression battery) shipped last. Two tasks (T014 lexical fallback, T015 cluster/export) were deferred to a future packet.

### Added

- `detector` column on `code_edges` with tree-sitter, glob, or heuristics provenance
- `evidence` column on `code_edges` with structured JSON (import declarations, caller/callee locations)
- `unresolved_symbol_count` column on `code_files` for hot-file tracking
- Top-10 unresolved-files breadcrumbs in the status handler response
- 17-test vitest regression battery in `code_graph/tests/code-graph-regression.vitest.ts`
- Detector taxonomy documentation in the code-graph readme section

### Changed

- `blast_radius` operation now resolves file paths through the index. Previously went through a file-system walk that could miss index entries.
- `calls_from` and `calls_to` queries now disambiguate by fully qualified symbol path. Previously collided on simple symbol name match.
- Status handler response payload includes `unresolvedTop10` array field.

### Fixed

- `blast_radius` returned wrong results when identically named symbols existed in multiple files. The index-resolved path fix eliminated the collision.
- `calls_from` and `calls_to` returned edges for the wrong symbol when a simple name matched across files. FQN disambiguation fixed this.

### Verification

- Typecheck (`npm run typecheck`): exit 0.
- Vitest regression battery: 17 of 17 pass.
- Vitest full suite: all 280 tests pass (pre-existing count, no regressions).
- Strict packet validation (`validate.sh --strict`): exit 0, zero errors, zero warnings.
- Manual blast-radius spot check on 3 known collision cases. All 3 now return the correct file.

### Files Changed

| File | What changed |
|------|--------------|
| `code_graph/lib/code-graph-db.ts` | Schema bumped. New `detector`, `evidence`, `unresolved_symbol_count` columns. Migration path from prior schema. |
| `code_graph/lib/structural-indexer.ts` | Detectors write provenance into edges. Unresolved-symbol counting hooked into the scan pipeline. |
| `code_graph/lib/code-graph-query.ts` | FQN disambiguation path added to `calls_from`, `calls_to`, and `blast_radius`. Index-resolved path for `blast_radius`. |
| `code_graph/handlers/status.ts` | New `unresolvedTop10` response field. |
| `code_graph/handlers/query.ts` | Provenance and evidence fields threaded through query responses. |
| `code_graph/tests/code-graph-regression.vitest.ts` (NEW) | 17 cases covering the frozen regression floor. |

### Follow-Ups

- **T014 lexical fallback (deferred).** When tree-sitter fails to parse a file, a lexical regex fallback could recover some symbols. Deferred because the failure rate was under 1 percent and the cost of a regex parser for 10+ languages exceeded the benefit.
- **T015 cluster/export (deferred).** Grouping edges by export cluster was deferred because the export data was not yet visible in the graph schema. A later packet will add the export cluster column.
