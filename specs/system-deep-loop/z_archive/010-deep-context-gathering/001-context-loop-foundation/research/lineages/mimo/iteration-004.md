===FINDINGS START===

## FrontierSeeding (feature/query → initial candidate slices)

**Source:** `code_graph_query({ operation: 'blast_radius' })` + `code_graph_context` + `Grep` pattern search, mirroring `@context` agent's one-shot flow but externalized as iterative frontier.

**Seeding algorithm (3-phase):**

1. **Anchor extraction** — Parse user feature/query for file paths, symbol names, error strings, domain terms. Grep for each; deduplicate into `anchors[]`.

2. **Structural expansion** — For each anchor, call `code_graph_query({ operation: 'blast_radius', subject })` and `code_graph_query({ operation: 'calls_from', subject })` to get 1-hop import/call neighbors. Cap at `maxAnchorFanout=20` edges per anchor to prevent explosion on hot utilities (e.g. `upsertNode`).

3. **Cluster formation** — Group expanded nodes by directory prefix (e.g. `lib/deep-loop/`, `scripts/`, `mcp_server/handlers/`). Each cluster becomes one `SLICE` node in the coverage-graph. Slices are named `ctx:{dir_prefix}:{anchor_hash}` for deterministic IDs.

**Evidence:** `code_graph_context` at `coverage-graph-db.ts:1` returns compact neighborhoods with token-budget control — suitable for seeding without loading full files. `code_graph_query` with `blast_radius` at `coverage-graph-query.ts:261` follows structural edges transitively, matching the "what touches this" requirement.

**Guardrail:** If code-graph is `stale`/`empty` (per `ensureCodeGraphReady` contract in `system-code-graph` SKILL.md §3), fall back to Glob+Grep heuristics (directory walk + `rg` for anchor matches). Never return false-safe empty graph results as authoritative.

## SliceAssignment (disjoint partitioning across lineages)

**Mechanism:** Reuse `expandLineages()` from `executor-config.ts:381` — each lineage gets a label, and `fanout-run.cjs:406` creates `{base}/lineages/{label}/`. The new contract: each lineage receives a **slice manifest** (JSON array of slice IDs) injected into its prompt.

**Disjoint partitioning algorithm:**

```
slices = [...frontier_slices]  // from seeding phase
K = lineages.length
for i in 0..K-1:
  lineage[i].slice_manifest = slices where (slice.index % K == i)
```

Round-robin by index ensures no overlap. Each slice's `SLICE` node in coverage-graph stores `metadata.lineage_label` and `metadata.partition_index` so the merge phase can verify disjointness.

**Why round-robin, not hash:** Slices are created deterministically from directory prefixes; hash-based assignment would require coordinating across lineages. Round-robin is stateless and verifiable.

**Same-kind replica isolation:** Already solved — `SPECKIT_STATE_ENV_BY_KIND` at `fanout-run.cjs:109` isolates lockfiles per-kind. Slice manifests live in lineage-local `{lineageDir}/slice-manifest.json`, not shared state.

## FrontierBookkeeping (coverage-graph nodes/edges for explored vs frontier)

**Schema change required:** `LoopType` at `coverage-graph-db.ts:10` must add `'context'`. This triggers `VALID_KINDS` and `VALID_RELATIONS` expansion.

**Proposed node kinds for `loop_type='context'`:**

| Kind | Meaning | Created by |
|------|---------|------------|
| `SLICE` | A directory/anchor cluster to explore | Seeding phase |
| `FILE` | A file analyzed within a slice | Per-iteration analysis |
| `SYMBOL` | A function/class/interface discovered | Per-iteration analysis |
| `PATTERN` | A reusable utility or convention found | Per-iteration synthesis |
| `DEPENDENCY` | An import/call edge between files | Per-iteration analysis |
| `CONSTRAINT` | A rule/guardrail/limit discovered | Per-iteration analysis |

**Proposed relations for `loop_type='context'`:**

| Relation | Weight | Meaning |
|----------|--------|---------|
| `CONTAINS` | 1.0 | SLICE → FILE (file belongs to slice) |
| `REFERENCES` | 1.0 | FILE → SYMBOL (file defines/uses symbol) |
| `CALLS` | 1.2 | SYMBOL → SYMBOL (call edge from code-graph) |
| `IMPORTS` | 1.0 | FILE → FILE (import edge from code-graph) |
| `REUSES` | 1.5 | SYMBOL → PATTERN (found a reusable utility) |
| `CONSTRAINS` | 1.3 | CONSTRAINT → SYMBOL (rule applies to symbol) |
| `EXPLORED` | 1.0 | SLICE → FILE (iteration mark — file was read) |
| `FRONTIER` | 0.5 | SLICE → FILE (file identified but not yet read) |

**Frontier marking:** Each `SLICE` node starts with all its `CONTAINS` edges having `relation='FRONTIER'`. When a lineage reads a file, it upserts an `EXPLORED` edge. The frontier for a slice is: `FRONTIER edges minus EXPLORED edges` (by target FILE id).

**Coverage-graph DB impact:** `coverage-graph-db.ts:153` CHECK constraint on `loop_type` must include `'context'`. `SCHEMA_VERSION` bumps to 3. Migration: `coverage-graph-db.ts:248-263` already handles version < new by dropping and recreating — same pattern.

## GapDetection (how saturation/coverage-complete is determined)

**Three convergence signals for `loop_type='context'` (parallel to research/review):**

| Signal | Formula | Threshold |
|--------|---------|-----------|
| `sliceCoverage` | `slices_with_all_files_explored / total_slices` | ≥ 0.90 |
| `symbolDensity` | `SYMBOL_nodes / FILE_nodes` | ≥ 0.5 (at least half a symbol per file) |
| `reuseDiscoveryRate` | `new_PATTERN_nodes_this_iter / PATTERN_nodes_prev_iter` | ≤ 0.05 (saturation) |

**Gap detection query (extends `findCoverageGaps` at `coverage-graph-query.ts:130`):**

```sql
-- Find SLICE nodes with unexplored FRONTIER edges
SELECT n.id, n.name, COUNT(e.id) as unexplored_count
FROM coverage_nodes n
JOIN coverage_edges e ON e.source_id = n.id
WHERE n.kind = 'SLICE' AND e.relation = 'FRONTIER'
AND NOT EXISTS (
  SELECT 1 FROM coverage_edges e2
  WHERE e2.source_id = n.id AND e2.relation = 'EXPLORED'
    AND e2.target_id = e.target_id
)
GROUP BY n.id
HAVING unexplored_count > 0
```

**NewInfoRatio equivalent:** `contextNewInfoRatio = (new_SYMBOL + new_PATTERN + new_DEPENDENCY) / total_nodes_prev_iter`. Threshold `0.05` (matching research). When both `sliceCoverage ≥ 0.90` AND `contextNewInfoRatio ≤ 0.05`, convergence is `STOP_ALLOWED`.

**Merge strategy (extends `fanout-merge.cjs`):** New `mergeContextRegistries()` function. Deduplicates `SYMBOL` nodes by `(name, filePath)` tuple. Merges `PATTERN` nodes by content-hash similarity. Validates disjointness: any FILE appearing in two lineage manifests triggers an overlap warning (not failure — file can appear in multiple slices; the merge deduplicates findings).

## OpenQuestions

1. **ADR ownership:** `deep-loop-runtime/SKILL.md:210` requires a new ownership ADR for a 3rd consumer. Who writes it — the `deep-context` skill owner or the runtime maintainer?

2. **Granularity tradeoff:** Directory-prefix clustering may produce unbalanced slices (one dir has 3 files, another has 30). Should slicing use LOC-weighted partitioning instead? Risk: LOC requires reading files before assignment, adding a pre-loop pass.

3. **Code-graph readiness gate:** If `code_graph_scan` hasn't run, seeding falls back to Glob+Grep. Should `deep-context` auto-trigger `code_graph_scan` at init, or require the caller to ensure readiness?

4. **SLICE node lifecycle:** Should slices be ephemeral (deleted after merge) or kept for resume? Keeping them enables "re-explore changed slices" on feature iteration; deleting keeps the graph clean.

5. **Fanout config schema:** `fanoutConfigSchema` at `executor-config.ts:323` doesn't currently carry slice manifests. The manifest could live in lineage `metadata` or require a new config field.
===FINDINGS END===
