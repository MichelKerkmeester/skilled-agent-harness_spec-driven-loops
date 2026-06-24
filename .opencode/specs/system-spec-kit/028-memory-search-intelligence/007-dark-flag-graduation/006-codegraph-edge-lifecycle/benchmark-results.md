---
title: "Benchmark Results: Code-Graph Edge Lifecycle Dark Flags"
description: "Three code-graph edge-lifecycle dark flags benchmarked and verdicted. The edge-staleness repair behind SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE passes the fan-in rebind benchmark it was gated on, rebind-correct on 3 of 3 cases with the flag on and discriminating on the importer-unchanged kind-flip case, verdict REFINE pending a degree-capped fan-in cost ceiling. SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS has no read consumer and default writes still replace edges so invalid_at is never set, verdict REFINE with the smallest consumer named as a close-and-insert reindex writer feeding an as-of edge reader. SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB has only its migration as a consumer and the live data is already vocab-compliant so no current producer can violate the CHECK, verdict CUT-or-REFINE with the smallest consumer named as an ingest validator that rejects an out-of-vocab edge_type at write time."
trigger_phrases:
  - "code graph edge lifecycle verdict"
  - "edge staleness rebind benchmark result"
  - "code graph bitemporal consumer verdict"
  - "code graph governance vocab verdict"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Code-Graph Edge Lifecycle Dark Flags

## Question
Three code-graph edge-lifecycle capabilities ship dark behind default-off flags with no measured verdict. Does force-reparsing importers correctly rebind cross-file edges after a rename or move, the gate the staleness work was explicitly held on? And for the two schema flags that await a consumer, what is the smallest consumer that would prove each worthwhile?

## Method
- **Safety:** the fan-in benchmark is read-only by construction. It imports the shipped compiled scan handler (`dist/handlers/scan.js`) and the code-graph DB lib (`dist/lib/code-graph-db.js`), builds a fresh throwaway workspace and SQLite database per case under the OS temp directory, and deletes the temp tree after each case. The live `code-graph.sqlite` (2648 files, 119317 nodes, 70427 edges, schema version 8) is never opened by the benchmark. The two schema-flag analyses read the live schema through a separate read-only SQLite open and issue no write.
- **Staleness flag:** `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` (default-off). When on, an incremental scan captures the importers of a changed dependency via `queryImportersOf` before node replacement and force-parses them, so the cross-file resolver rebinds the import edge to the dependency new symbol id. The symbol id is `sha256(filePath::fqName::kind).slice(0,16)`, so a rename, a kind change or a move all shift it.
- **Fixture:** three labeled cases. A pure rename where the importer re-points its import, a kind-flip where the imported symbol changes kind and the importer stays byte-identical, and a move where the symbol relocates to a new file and the importer re-points. Each case runs the repair with the flag ON and then OFF, and the harness scores whether the cross-file edge rebinds to the new symbol id.
- **Discrimination rule:** the kind-flip case keeps the importer byte-identical, so only the dependency symbol identity shifts. That is the case the gate hinges on, because a rename or move that also edits the importer makes the importer independently stale by its own content hash, so the ordinary incremental scan rebinds it with or without the flag. The kind-flip isolates the force-parse path.

## Results: the fan-in rebind benchmark passes

| Case | Importer unchanged | Flag ON rebound | Flag OFF rebound | Discriminates | Files indexed ON / OFF |
|------|--------------------|-----------------|------------------|---------------|------------------------|
| rename-function | no | yes | yes | no (control) | 2 / 2 |
| kind-flip | **yes** | **yes** | **no** | **yes** | **2 / 1** |
| move-file | no | yes | yes | no (control) | 3 / 3 |

Aggregate: rebind-correct on **3 of 3** cases with the flag on (rate 1.00), **1 of 1** importer-unchanged case discriminates, deterministic across three repeated runs with zero run-to-run variance.

### The discriminating case, read from the metrics
The kind-flip case imports `foo` as a function, then `foo` becomes a `const` while `app.ts` stays byte-identical:
- **Flag ON:** `filesIndexed=2`, the importer is force-parsed, and the `IMPORTS` edge rebinds from the old function symbol to the new variable symbol. The target name stays `foo`, the kind crosses from `function` to `variable`, and the symbol id changes (for example `af6dc64f30d3df18` to `8f0f98fa21282935` in the recorded run). **Rebound correct.**
- **Flag OFF:** `filesIndexed=1`, `filesSkipped=1`, the importer is skipped as fresh and the old target node is gone, so the cross-file join yields no live edge. The result edge is `null`. **Stale, not rebound.**

The move case confirms the rebind crosses files: the `IMPORTS` edge target file moves from `dep.ts` to `relocated.ts` under the flag. The rename and move cases rebind under both flag states because the importer re-points its own import text, which makes the importer independently stale, so they are recorded as controls that confirm the ordinary incremental scan still works.

## Verdict 1, edge-staleness repair: REFINE

The repair does exactly what the changelog claimed, force-reparsing importers rebinds cross-file edges to the new symbol ids after a rename, kind-flip or move, and the importer-unchanged kind-flip case proves the repair is the thing that makes the rebind happen rather than the ordinary incremental scan. Correctness is established at 3 of 3.

It is REFINE not GRADUATE because the changelog gated the default-on decision on a fan-in COST benchmark, not only a correctness one, and the cost half is still unmeasured. The force-parse path pulls every importer of a changed dependency back into the parse batch unconditionally, so a hot high-importer file (a shared types module or a barrel index) re-parses its entire fan-in on every symbol-identity change. The live graph has files in the thousands and `IMPORTS` is the second-largest cross-file edge class, so the worst-case fan-in is large. The named refinement is a degree-capped force-parse: read the importer fan-in degree (the lib already exposes `queryFileDegrees`), and either cap the forced set or fall back to a lazy rebind on next query above a degree ceiling, so a rename of a high-fan-in dependency does not trigger a whole-graph re-parse. The smallest proving consumer here is the existing incremental scan path itself, which already calls the repair, so the refinement needs no new consumer, only the cost ceiling and a re-benchmark of the fan-in re-parse time on a hot file before the flip.

## Verdict 2, SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS: REFINE

The schema half shipped and is sound. The live `code_edges` carries the nullable `valid_at` and `invalid_at` columns (confirmed read-only: 70427 edges, 69585 with `valid_at` set, 0 with `invalid_at` set), and the read flag reader `codeGraphEdgeBitemporalReadsEnabled` exists. But the flag has NO read consumer, `rg` finds the reader defined and called by nothing outside its own definition, and default writes still REPLACE edges rather than closing them, which is why `invalid_at` is NULL on every one of the 70427 edges. So today the columns record an open `valid_at` and never a close, and no query reads them. There is no measured value because there is nothing to measure, the as-of timeline read does not exist.

It is REFINE not CUT because the schema is a genuine foundation and the cost of holding it is one nullable column pair, byte-identical when the read flag is off. The smallest proving consumer is a two-part pair that must ship together: a close-and-insert reindex writer that sets `invalid_at` on the superseded edge instead of deleting it when a symbol identity changes (the staleness repair already detects exactly this moment, so it is the natural write site), feeding an as-of edge reader that filters `valid_at <= asOf AND (invalid_at IS NULL OR invalid_at > asOf)` behind the read flag. The proving query is a single change-impact question asked as-of a past generation, does the graph still answer correctly about an edge that has since been rebound. Until that pair exists the flag has nothing to graduate, so REFINE with the consumer named, not a speculative build in this pass.

## Verdict 3, SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB: CUT-or-REFINE

The closed-vocab CHECK migration shipped and is correct, the `EDGE_TYPES` runtime vocabulary is the single source for the TypeScript union and the SQLite CHECK, and the rebuild is all-or-nothing with a pre-rebuild DISTINCT scan. But two facts measured against the live graph undercut the value. First, the live `code_edges` has NO CHECK constraint (confirmed read-only from the table DDL), so the migration is genuinely dark in production. Second, every `edge_type` value in the live graph is already inside the closed vocabulary (the out-of-vocab DISTINCT scan returns empty across all 70427 edges), and the only writers are the indexer edge-builders that emit a fixed set of typed edges from a closed enum. So no current producer can emit an out-of-vocab `edge_type`, which means the CHECK would reject nothing that the type system does not already reject at compile time. The migration would add a table rebuild and a runtime guard that defends against a violation no live code path can cause.

The honest read leans CUT, the same verdict that retired the 16 cut experiments, because the CHECK earns its keep only against an untyped or external edge writer, and none exists. It is recorded as CUT-or-REFINE because there is one narrow consumer that would flip it to a real win: an ingest validator on an EXTERNAL edge source, for example a future import of edges from another tool or a hand-authored edge overlay that does not pass through the typed indexer. The smallest proving consumer is therefore an untyped edge-ingest path that the CHECK can actually catch, and the proving test is a single out-of-vocab `edge_type` insert that the CHECK rejects and that no upstream type guard would have caught. Absent that path the migration guards nothing, so the recommendation is CUT now and revisit only if an external edge writer is ever added.

## Default-off safety
All three flags are confirmed default-off and byte-identical when off. The staleness flag-OFF path leaves the importer skipped and the edge stale (the measured OFF column above). The bitemporal read flag has no read consumer so nothing reads the columns. The live `code_edges` has no governance CHECK so the migration never ran in production. No default is flipped by this phase.

## Reproduce
From the code-graph server working directory, `node <phase>/scripts/edge-staleness-rebind-benchmark.mjs` rebuilds `results/staleness-metrics.json` from fresh throwaway graphs, exit 0. The two schema-flag facts are reproduced by a read-only `sqlite3` open of the live `code-graph.sqlite`, the edges DDL shows no CHECK, the `invalid_at` count is 0, and `rg` over `lib/` shows the bitemporal read flag has no consumer.
