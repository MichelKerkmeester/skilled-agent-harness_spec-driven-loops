# Iteration 22: Round I Implementation Sketch — CG-incremental-edge-staleness-repair (NEW gap; repro confirmed)

## Focus
Round I: reproduce + sketch the fix for the NEW gap (G16) — cross-file edge staleness under incremental mtime-skip. Read-only.

## Build sketch (newInfoRatio 0.85) — **NEEDS-BENCHMARK; repro CONFIRMED (narrowed)**
- **REPRO (narrowed):** symbol ids are `sha256(filePath::fqName::kind)` (indexer-types.ts:100), so A→B's `target_id` dangles ONLY when B's depended-on symbol changes {fqName,kind,filePath} — i.e. **rename / kind-flip / move** (the refactor class), NOT plain body edits (stable id → target survives). On refactors the silent-vanish is real: A is mtime/hash-skipped (structural-indexer.ts:2174) → absent from `results` → `finalizeIndexResults` derives cross-file IMPORTS/TESTED_BY only over the parsed batch (:2047,:2014-2041) → B's `replaceNodes` drops the old target node → `pruneDanglingEdges` (code-graph-db.ts:1027) deletes the dangling A→B → vanishes until A is touched.
- **CHANGE (reverse-dep invalidation, preferred):** before the per-file skip loop (scan.ts:597-608), snapshot the stale set, expand with reverse-deps (reuse `queryFileImportDependents` :1340; add a path-filtered `queryImportersOf(stalePaths)` — current query full-scans the edge table), force-include importer files via a `forceParse:Set<string>` that overrides the skip short-circuit (structural-indexer.ts:2174) so A re-parses against B's new ids. **HARD ORDERING CONSTRAINT:** capture reverse-deps BEFORE any `replaceNodes` on B (post-persist the JOIN on `code_nodes target` returns nothing — the edge already dangles). Rejected alternatives: prune-guard (leaves true dangling edges — worse), re-derive-inbound-without-parsing (fragile).
- **TEST:** index A(`import {foo} from './b'`) + B(`export function foo`); mutate B → `export const foo=()=>{}` (kind flip → new symbol_id), touch ONLY B; incremental scan → assert A→B IMPORTS survives (re-derived to the new id). Control: body-only edit of foo → no extra A parse, A→B unchanged.
- **WHAT-BREAKS:** incremental-scan perf (high fan-in file re-parses its whole dependent set; needs the path-filtered dependents query, not the full-table scan); detect_changes consumers (indexed-count > edited-count); the pre-persist ordering is a hard correctness gate.
- **READINESS:** needs-benchmark (correctness fix is ready-to-spec; the fan-in re-parse cost + path-filtered query must be benchmarked on a hot file).

## Next Focus
A genuine NEW correctness gap, fully analyzed: reverse-dep force-parse with a pre-replaceNodes ordering gate; benchmark the fan-in cost. Feeds Round J + the roadmap addendum (new candidate).
