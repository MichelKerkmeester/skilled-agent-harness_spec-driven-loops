# Research Report: Code Graph — External Mining

> Self-contained synthesis of a 4-iteration deep-research session mining AIONFORGE (`bi-temporal-model.md`, `consolidation.md`, `retrieval.md`) and GALADRIEL (zero-token local retrieval) for improvements to the tree-sitter→SQLite code graph under `.opencode/skills/system-code-graph/`. Evidence markers: **[CONFIRMED]** = verified against source/doc by direct read or grep; **[INFERRED]** = design mapping not yet verified end-to-end (names what would confirm it).

---

## Executive Summary

The code-graph reindex is **destructive DELETE+INSERT with no temporal columns**: `code_edges` has no validity-window/generation columns and currentness equals physical edge presence, so a broken or partial scan can only block reads (binary `freshness !== 'fresh'` gate), never serve as-of-last-green-scan results. The **biggest near-term wins are rank-time-only additions** — a **trust multiplier** (Q4-C1, `effectiveScore = structuralWeight × reliability`, fields already plumbed to formatting) and a **soft generation watermark** (Q6-C2, additive `generation` int on the freshness envelope) — because neither touches the destructive write path and both fall back to neutral/non-breaking behavior. The structurally heavier cluster — **bi-temporal validity columns (Q1-C1), a hard generation counter (Q6-C1), and PPR-seeded impact ranking (Q3-C1)** — all share one `code-graph-db.ts` transaction boundary (the reindex DELETE+INSERT swap): they should land together behind a single schema migration + atomic swap or each re-pays the migration cost. Renames are a fragility because the symbol ID is path-coupled (`sha256(filePath::fqName::kind)`), so a pure rename masquerades as delete+create — fixable cheaply with a `SUPERSEDES` edge (Q1-C2) without any schema change. All eight key questions are evidence-backed and code-mapped; the session saturated at iteration 4 (newInfoRatio 0.92→0.78→0.62→~0.45, no new open questions in iter-4).

---

## Internal Baseline

The in-scope structural map of the code graph, with file:line evidence. All **[CONFIRMED]** unless noted.

| Area | Finding | Evidence (file:line) |
|---|---|---|
| **Scan / edge-write delete sites** | Reindex is destructive-replace, not supersede. `replaceNodes(fileId, nodes)`: `DELETE FROM code_nodes WHERE file_id = ?` then re-INSERT; also hard-deletes node-touching edges. `replaceEdges`: delete-per-source then re-insert. Deferred dangling delete + `pruneDanglingEdges()` physically delete edges whose source/target is no longer a live node. | `code-graph-db.ts:936` (node delete), `:941` (edge delete in replaceNodes), `:985` (replaceEdges delete), `:1012` (deferred dangling), `:1027`/`:1031` (`pruneDanglingEdges`); plus `:1149` (removeFile/symbol-removal), `:1540`/`:1546` (orphan GC) |
| **`code_edges` schema — no temporal cols** | `code_edges(id, source_id, target_id, edge_type, weight REAL DEFAULT 1.0, metadata TEXT)` — NO valid_from/valid_to/generation/superseded_by. Currentness = physical presence. SCHEMA_VERSION = 5. 10 edge relations (CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, TESTED_BY, DECORATES, OVERRIDES, TYPE_OF). | `code-graph-db.ts:177-184` (schema), `:142` (version); `indexer-types.ts:19-22` (relations) |
| **Path-coupled symbol IDs** | Symbol IDs are deterministic but path-coupled: `sha256(filePath + '::' + fqName + '::' + kind).slice(0,16)`. Content hash for change-detection is separate: `sha256(content).slice(0,12)`. A pure rename mints a NEW id → looks like delete+create. | `indexer-types.ts:99-102` (symbol ID), `:107-110` (content hash) |
| **Skip-list has no transient/fatal axis** | `parser_skip_list(file_path PK, error_class CHECK IN ('B1','B2','OTHER'), ...)` — B1/B2/OTHER are tree-sitter WASM **crash cohorts**, not a retry policy. Add is idempotent upsert bumping `attempt_count`; NO `max_retries` ceiling, NO transient-leaves-pending. Removal is an intentional permanent no-op (`recordSuccess` `@deprecated`, empty body, "must not auto-unskip… or imply self-heal"). | `code-graph-db.ts:203-211` (table); `parser-skip-list.ts:9,27-35` (cohorts), `:78-91` (upsert/attempt_count), `:93-97` (no-op removal) |
| **Flat single-hop impact walk** | `code_graph_context` impact mode walks reverse `CALLS`/`IMPORTS` edges at depth 1 only, pushing edges in DB iteration order, bounded by a 400 ms budget that truncates with `omittedEdges`. No recursive spread, no mass propagation, no centrality. Zero `pagerank\|personaliz\|teleport\|damping\|ppr` tokens in `handlers/`, `lib/`, `graph/`. `score` is hardcoded `null`. Shared BFS primitive `traverseGraphBfs` is visited-set + depth-bound only. | `code-graph-context.ts:627-671` (impact walk), `:343-360` (edge format), `:297-300`/`:720` (budget/null score); `graph/bfs-traversal.ts:76-174` (BFS primitive) |
| **Static edge weights (no learning)** | `edgeWeights`: CONTAINS/IMPORTS/EXPORTS 1.0, EXTENDS/IMPLEMENTS 0.95, DECORATES/OVERRIDES 0.9, TYPE_OF 0.85, CALLS 0.8, TESTED_BY 0.6. Consumed ONLY at index time by `structural-indexer.ts`; `grep edgeWeights` returns ZERO hits in `code-graph-context.ts`. Edge metadata already carries `confidence`, `detectorProvenance`, `evidenceClass` — an unwired rank-time hook. | `config-defaults.ts:45-59` (weights); `indexer-types.ts:24` (override env), `:26-37` (metadata fields); `structural-indexer.ts:127,827,853,1006-1011` (index-time use) |
| **Binary readiness gate** | `ensure-ready` computes 4-state `GraphFreshness` (fresh/stale/empty/error); `readiness-contract.ts` maps to `StructuralReadiness` + trust axis. Read-path gate: `shouldBlockReadPath()` returns true when `freshness !== 'fresh'`, returning a `status:'blocked'`, `degraded:true`, `graphAnswersOmitted:true` payload with a `fallbackDecision` (degrades, does not throw). Separate `code-graph-context.computeFreshness()` is binary wall-clock: `ageMs<300_000→fresh`, `<3_600_000→recent`, else `stale`; collapsed to live/stale/unavailable for metrics. No generation/commit counter anywhere. | `ensure-ready.ts:395-518`; `readiness-contract.ts:68-118`; `handlers/query.ts:903-915` (block), `:1321`/`:1348`/`:939-967` (payload/fallback); `code-graph-context.ts:313-321` (wall-clock buckets), `:227` (3-way collapse) |
| **Doc-lane is hash-only** | `'doc'` is explicitly excluded from the tree-sitter parser (`ParserLanguage = Exclude<SupportedLanguage,'doc'>`). When `language === 'doc'` the indexer short-circuits, returning `{nodes:[], edges:[], contentHash, parseHealth:'clean'...}` — a doc row is purely a change-detection content-hash. `md\|json\|jsonc\|yaml\|yml\|toml → 'doc'`, but default include globs OMIT `**/*.md` (markdown deliberately not indexed); only json/yaml/toml are scanned (and still produce empty doc rows). | `tree-sitter-parser.ts:50` (exclusion); `structural-indexer.ts:1236-1248` (early-return); `indexer-types.ts:124-125` (lang map), `:156-177` (include globs) |
| **Tombstones (opt-in, off)** | Tombstones for deleted nodes/edges exist but are OPT-IN and OFF by default (`SPECKIT_CODE_GRAPH_TOMBSTONES`, gated). Reusable machinery for rename-lineage. | `code-graph-db.ts:227-243` (gate), `:245-288` (machinery) |
| **001 graceful-degrade consumer present** | The `graph_available:false`-vs-throw degrade pattern from 001 already has a wired consumer. | `memory-context.ts:1513` |

> **Missing-dependency correction (iter-1→iter-2):** iter-1 reported the aionforge docs absent (looked at repo-root `external/`, gitignored at `.gitignore:176`). They are in fact present at `.opencode/specs/system-spec-kit/028-memory-search-intelligence/external/aionforge-memory-development/docs/` and were read in full from iter-2 onward. Iter-1's code baseline stands; only the external-doc note was corrected.

---

## Broadening Addendum (100-iteration campaign — Code Graph corrections)

> Pass-1 was 4 iterations; broadened to **24**. Authoritative cross-cutting record: `../../research/roadmap.md` → "BROADENING ADDENDUM". Code-Graph-specific corrections:

- **Q4-C1 must be RRF-additive, not multiplicative-neutral.** A `score × reliability` fallback with neutral = 1 **fails** against the rowid baseline (it re-orders ties). Blend trust additively into the RRF instead.
- **Q6-C2 bump site at `ensure-ready.ts:497` is REFUTED** — `:497` is `setLastGitHead` (git-HEAD bookkeeping) inside an out-of-scope branch, NOT a generation bump. Q6-C2 needs a different, scan-commit-atomic bump site.
- **Q6-C1 / closed-vocab are WEAKER** than their pass-1 billing (see roadmap §6 caveats); each still ships in Wave-0 with its caveat.
- **New gap:** incremental **edge staleness** — `structural-indexer.ts:2171-2177` skips re-index on unchanged mtime, so a file whose dependency changed but whose own mtime is stable leaves stale edges, with no current repair path.
- **Shared infra:** the bi-temporal validity-window schema (Q1-C1 `code_edges`) shares its column shape with Memory C3-B — reconcile rather than fork.

---

## Candidate Catalog
