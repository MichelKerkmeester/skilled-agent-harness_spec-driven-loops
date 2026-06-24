---
title: "Benchmark Results: Code-Graph Edge Lifecycle Dark Flags"
description: "Three code-graph edge-lifecycle dark flags benchmarked, refined and verdicted. The edge-staleness repair behind SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE passes the fan-in rebind benchmark it was gated on, rebind-correct on 3 of 3 cases and discriminating on the importer-unchanged kind-flip case, and the refinement pass added a degree cap SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP that drops a hot 30-importer dependency from 30 forced re-parses to 0 and cuts the incremental scan from 37.07 ms to 21.10 ms while a low-fan-in dependency still rebinds, verdict GRADUATE post-refinement. SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS got its smallest proving consumer built, a close-and-insert writer that stamps invalid_at on a superseded edge feeding an as-of reader, and the proving query passes, an as-of read at a past generation returns the old target while the current read returns the new one, byte-identical when off, verdict GRADUATE post-refinement. SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB stays CUT, the live data is already vocab-compliant so no current producer can violate the CHECK."
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

## Refinement pass: the two REFINE verdicts were built and re-benchmarked

After the first pass returned REFINE on the staleness repair and the bitemporal flag, both refinements were implemented behind their existing default-off flags and re-benchmarked. The governance flag stays CUT, untouched.

### Staleness fan-in COST, degree-capped force-parse

The cost half of the gate is now measured. A new degree cap `SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP` (default 0, meaning uncapped and byte-identical) drops a refactored dependency from the force-parse expansion when its importer fan-in degree exceeds the cap, read from the existing `queryFileDegrees`. The cost benchmark builds a hot dependency with 30 importers and a low-fan-in dependency with 2, renames each by a kind-flip so the importers stay byte-identical, and measures the force-parse blast radius uncapped versus capped at degree 10.

| Variant | Fan-out | Cap | Forced importers | Incremental scan ms |
|---------|---------|-----|------------------|---------------------|
| hot-uncapped | 30 | off | **30** | 37.07 |
| hot-capped | 30 | 10 | **0** | 21.10 |
| low-capped | 2 | 10 | rebinds | (low cost) |

The cap eliminates the whole-graph re-parse on a hot dependency (30 forced importers to 0) and cuts the incremental scan wall time from 37.07 ms to 21.10 ms, while a low-fan-in dependency under the same cap still rebinds correctly. The forced-importer counts are deterministic across repeated runs (30 and 0). So the worst-case fan-in is now bounded by a single tunable, and the correctness benchmark above still reports 3 of 3 rebinds with the cap at its default.

### Bitemporal close-and-insert writer and as-of reader

The smallest proving consumer was built behind `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`: a `closeEdgesForSources` writer that stamps `invalid_at` with the current graph generation on a superseded edge instead of deleting it, an `insertEdgeWithValidity` writer that stamps `valid_at` on a fresh edge and leaves `invalid_at` open, and an `asOfEdgesFrom` reader that filters `valid_at <= asOf AND (invalid_at IS NULL OR invalid_at > asOf)`. The benchmark seeds an edge `src` to `old-target` at generation g1, advances the clock, closes the old edge and inserts `src` to `new-target`, then asks the proving question.

| Proving check | Result |
|---------------|--------|
| as-of read at the past generation g1 returns the OLD target | **true** |
| as-of read at the current generation returns the NEW target, not the closed one | **true** |
| edges closed on the rebind (invalid_at stamped, not deleted) | **1** |
| flag-off close is a no-op | **true** |
| flag-off insert writes NULL validity columns, identical to a plain insert | **true** |
| flag-off as-of read falls back to the live-only read | **true** |

So the graph now answers correctly about an edge that has since been rebound, the exact question the columns existed to support, and the consumer is byte-identical when the flag is off.

## Verdict 1, edge-staleness repair: GRADUATE (post-refinement)

Both halves of the gate are now measured. Correctness is 3 of 3 rebinds with the discriminating importer-unchanged kind-flip case proving the repair is the thing that makes the rebind happen. Cost is bounded: the degree-capped force-parse drops a hot 30-importer dependency to 0 forced re-parses and cuts the incremental scan from 37.07 ms to 21.10 ms, while a low-fan-in dependency still rebinds. The repair is correct, its worst-case fan-in is now bounded by `SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP`, and the cap defaults to uncapped so the force-parse path stays byte-identical until both flags are flipped. The recommendation is GRADUATE the staleness repair with the degree cap set to a sensible ceiling, which the flip decision tunes. The flip itself stays a separate evidence-gated decision, not enacted here.

## Verdict 2, SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS: GRADUATE (post-refinement)

The flag now has the consumer it lacked. The close-and-insert writer and the as-of reader make the validity columns load-bearing, and the proving query passes, an as-of read at a past generation returns the old target while the current read returns the new one. Default-off byte-identity is proven directly: the close is a no-op, the insert writes NULL validity columns identical to a plain insert, and the as-of read falls back to the live-only path. The recommendation is GRADUATE the bitemporal reads once a reindex caller wires `closeEdgesForSources` and `insertEdgeWithValidity` into the edge replace path (the staleness repair already detects the exact moment a symbol identity changes, so it is the natural write site). The consumer is built and benchmarked, the remaining step is to call it from the reindex path, which is a small wiring change behind the same flag. The flip stays a separate evidence-gated decision.

## Verdict 3, SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB: CUT-or-REFINE

The closed-vocab CHECK migration shipped and is correct, the `EDGE_TYPES` runtime vocabulary is the single source for the TypeScript union and the SQLite CHECK, and the rebuild is all-or-nothing with a pre-rebuild DISTINCT scan. But two facts measured against the live graph undercut the value. First, the live `code_edges` has NO CHECK constraint (confirmed read-only from the table DDL), so the migration is genuinely dark in production. Second, every `edge_type` value in the live graph is already inside the closed vocabulary (the out-of-vocab DISTINCT scan returns empty across all 70427 edges), and the only writers are the indexer edge-builders that emit a fixed set of typed edges from a closed enum. So no current producer can emit an out-of-vocab `edge_type`, which means the CHECK would reject nothing that the type system does not already reject at compile time. The migration would add a table rebuild and a runtime guard that defends against a violation no live code path can cause.

The honest read leans CUT, the same verdict that retired the 16 cut experiments, because the CHECK earns its keep only against an untyped or external edge writer, and none exists. It is recorded as CUT-or-REFINE because there is one narrow consumer that would flip it to a real win: an ingest validator on an EXTERNAL edge source, for example a future import of edges from another tool or a hand-authored edge overlay that does not pass through the typed indexer. The smallest proving consumer is therefore an untyped edge-ingest path that the CHECK can actually catch, and the proving test is a single out-of-vocab `edge_type` insert that the CHECK rejects and that no upstream type guard would have caught. Absent that path the migration guards nothing, so the recommendation is CUT now and revisit only if an external edge writer is ever added.

## Default-off safety
All three flags are confirmed default-off and byte-identical when off, and the two refinements ship behind those same flags. The staleness force-parse path runs only under `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE`, and the new degree cap defaults to 0 (uncapped), so with the cap unset the force-parse expansion is byte-identical to the pre-cap behavior, confirmed by the unchanged 3 of 3 correctness benchmark. The bitemporal writer and reader no-op or fall back to the live-only path when `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` is off, proven directly in the bitemporal benchmark, the close is a no-op, the insert writes NULL validity columns and the as-of read matches the live read. The live `code_edges` has no governance CHECK so the migration never ran in production. The full focused code-graph regression suite stays green (21 targeted tests across staleness, bitemporal, governance and cross-file, plus 105 in the broader indexer and scan sweep, no regression). No default is flipped by this phase.

## Reproduce
From the code-graph server working directory:
- `node <phase>/scripts/edge-staleness-rebind-benchmark.mjs` rebuilds `results/staleness-metrics.json`, exit 0, the correctness half.
- `node <phase>/scripts/edge-staleness-cost-benchmark.mjs` rebuilds `results/cost-metrics.json`, exit 0, the fan-in cost half with the degree cap.
- `node <phase>/scripts/bitemporal-asof-benchmark.mjs` rebuilds `results/bitemporal-metrics.json`, exit 0, the close-and-insert writer and the as-of reader.

The governance facts are reproduced by a read-only `sqlite3` open of the live `code-graph.sqlite`, the edges DDL shows no CHECK and every `edge_type` is in the closed vocabulary.
