# Iteration 4: Doc-lane (Q5) + cross-cutting 001 reuse (Q7/Q8) + full ranked candidate table

## Focus
Saturation iteration — close out remaining questions and rank everything:
- **Q5 (doc-lane):** Does `language='doc'` extract symbols today, or is it hash-only? Propose a zero-token (no-LLM) doc-symbol pass (markdown headings, json/yaml/toml keys as graph nodes).
- **Q7/Q8 (cross-cutting from 001-memory):** State which 001 primitives port to code-graph — content-derived deterministic ordering, `graph_available:false` graceful-degrade, shared `fuseResultsMulti {bonusOverChannels}` for impact ranking, apply-once G2 invariant.
- **Ranked candidate table:** every candidate (Q1-C1/C2, Q2-C1, Q3-C1, Q4-C1, Q5, Q6-C1/C2, plus cross-cutting) with file:line seam, leverage/effort/conflict, PROMOTE-off-state vs BUILD-new, ranked; name top-5.

Candidate proposals only — confirmed vs inferred kept legible.

## Actions Taken
1. Read state (`deep-research-state.jsonl`), strategy (`deep-research-strategy.md`), iteration-003.md for prior candidate seams.
2. Located language/doc handling: `rg SupportedLanguage` → `tree-sitter-parser.ts:50` (`ParserLanguage = Exclude<SupportedLanguage,'doc'>`), `structural-indexer.ts:1236`.
3. Read `indexer-types.ts:108-189` — `detectLanguage` doc mapping + default include globs.
4. Read `structural-indexer.ts:1228-1264` — the `language === 'doc'` early-return branch.
5. Synthesized Q7/Q8 from 001 cross-cutting seed (strategy §12 KNOWN CONTEXT) + iter-1 confirmed `graph_available:false` consumer at `memory-context.ts:1513`.
6. Ranked all candidates by leverage × low-effort × low-conflict.

## Findings

### Q5 — the doc lane is HASH-ONLY today; zero symbol extraction

- **CONFIRMED — `'doc'` is explicitly excluded from the tree-sitter parser.** `tree-sitter-parser.ts:50` declares `type ParserLanguage = Exclude<SupportedLanguage, 'doc'>`. The doc language can never reach a grammar.
- **CONFIRMED — doc files return zero nodes/edges, content-hash only.** `structural-indexer.ts:1236-1248`: when `language === 'doc'`, the indexer short-circuits and returns `{ nodes: [], edges: [], contentHash, parseHealth: 'clean', parseErrors: [], parseDurationMs: 0 }`. So a `doc` row exists purely as a change-detection content-hash; it contributes nothing to the symbol/edge graph.
- **CONFIRMED — markdown/prose is NOT indexed at all by default; only structured config is.** `indexer-types.ts:124-125` maps `md|json|jsonc|yaml|yml|toml → 'doc'`, but the default include globs (`:156-177`) deliberately OMIT `**/*.md` ("Markdown/prose docs are deliberately NOT indexed … the code graph models code structure and structured config, not documentation"). Only `json/jsonc/yaml/yml/toml` are in the default scan; markdown only enters via a caller-supplied `includeGlobs` and even then is hash-only.
- **INFERRED — a local doc-symbol pass is a clean additive lane.** Because the doc branch is a single early-return (`:1236`), a zero-token extractor (markdown ATX/Setext headings → `heading` nodes with `CONTAINS` nesting edges; json/yaml/toml top-level + nested keys → `key` nodes) can be slotted in WITHOUT touching the tree-sitter path or the parser-language exclusion. Would confirm: that `SymbolKind` accepts new kinds (`heading`/`key`) or needs a union extension in `indexer-types.ts`, and that downstream `code-graph-context` rendering tolerates non-code node kinds.

**Q5 candidate proposal (zero-token local doc-symbol pass — galadriel no-LLM):**
- **C1 — Local doc-symbol extractor.** Replace the `language === 'doc'` empty-return (`structural-indexer.ts:1236`) with a deterministic, dependency-free extractor: markdown headings (regex ATX `^#{1,6} ` / Setext) → `heading` nodes with parent-`CONTAINS`-child nesting by heading level; structured config (json/yaml/toml) → top-level + nested `key` nodes via the already-available parsers (JSON.parse / a yaml lib) or a shallow key walk. All deterministic (content-derived), no LLM, no network. **Leverage: M** (makes config/docs queryable as graph nodes — e.g. "what defines key X", "which doc covers Y"). **Effort: M** (new extractor + `SymbolKind` union extension + render tolerance). **Conflict: L** (additive branch behind the existing `=== 'doc'` guard; code lanes untouched). **BUILD-new** (no off-state to promote — the lane is empty today).

### Q7/Q8 — 001 cross-cutting primitives that port to code-graph

- **CONFIRMED (iter-1) — graceful degradation already present.** The `graph_available:false`-vs-throw degrade pattern from 001 already has a consumer wired at `memory-context.ts:1513` (strategy §12; iter-1 baseline). Code-graph already returns a graceful "unavailable" envelope rather than throwing — this primitive is PRESENT, only needs the generation watermark (Q6) layered on the same envelope.
- **INFERRED — content-derived deterministic ordering ports cleanly.** 001's content-derived render-order + apply-once G2 invariant maps onto two code-graph seams: (a) the impact walk currently orders by DB-iteration order (`code-graph-context.ts:626-671`, iter-3) — a content-derived tiebreak (stable sort on node id/hash) makes impact output deterministic; (b) the doc-symbol pass (Q5) must use content-derived node ids to stay idempotent across rescans. Would confirm: whether impact results are already stable across runs or rely on SQLite row order.
- **INFERRED — `fuseResultsMulti {bonusOverChannels}` belongs in impact ranking.** 001's shared multi-channel fuse with the `bonusOverChannels` option is the natural home for combining the rank-time reliability multiplier (Q4-C1) with a future PPR score (Q3-C1): CALLS-channel and IMPORTS-channel impact results (currently concatenated flat at `:626-671`) would fuse with a cross-channel bonus for nodes reached via BOTH edge types. **PROMOTE** (reuse the 001 primitive) rather than build a code-graph-specific fuser. Would confirm: the `fuseResultsMulti` signature is generic enough to accept code-graph result shapes.
- **CONFIRMED (synthesis) — apply-once / idempotency is the shared invariant across Q1, Q2, Q6.** The content-addressed edge ID (Q2-C1), the temporal supersede-not-delete (Q1-C1), and the generation counter (Q6-C1) all encode the same 001 apply-once G2 property: a rescan of unchanged content must be a no-op (same edge ids, same validity windows, generation unchanged). This is the unifying design constraint, not a separate candidate.

### Shared transaction-boundary insight (carried + confirmed)
Temporal columns (Q1-C1), the generation counter (Q6-C1), and the existing destructive DELETE+INSERT reindex (iter-1) **all touch the same `code-graph-db.ts` write path**. Sequencing matters: a single schema migration + a single atomic swap should land valid_at/invalid_at + a generation bump together, or each will re-pay the migration cost. This is the highest-conflict zone and gates Q1-C1 / Q6-C1 effort.

### FULL RANKED CANDIDATE TABLE

Rank score = leverage (H=3/M=2/L=1) × effort-inverse (S=3/M=2/L=1) × conflict-inverse (L=3/M=2/H=1). Higher = better promote-first.

| # | ID | One-line description | file:line seam | Leverage | Effort | Conflict | Promote/Build | Score |
|---|----|----|----|----|----|----|----|----|
| 1 | **Q4-C1** rank-time trust mult | `effectiveScore = structuralWeight × reliability(confidence×evidenceClassFactor)`; structural weight never mutated | `code-graph-context.ts:350-356` (plumbed), sort at `:607,:649` | M | S | L | PROMOTE (fields pre-plumbed, terminate at formatting) | 18 |
| 2 | **Q6-C2** soft watermark | add `generation` int to freshness envelope + metrics, no error gate yet | `code-graph-context.ts:313-321,:227` | M | S | L | PROMOTE (additive on existing freshness path) | 18 |
| 3 | **Cross-cut** graceful-degrade + determinism | `graph_available:false` already wired; add content-derived stable tiebreak to impact order | `memory-context.ts:1513`; `code-graph-context.ts:626-671` | M | S | L | PROMOTE (degrade present; tiebreak is a stable-sort add) | 18 |
| 4 | **Q1-C2** rename→SUPERSEDES | renamed symbol emits `SUPERSEDES` edge instead of delete+recreate | edge-write path `structural-indexer.ts` + `code-graph-db.ts` | M | S | M | BUILD (new edge type on existing schema) | 12 |
| 5 | **Q2-C1** transient/fatal parser retry | classify parse failure transient-vs-fatal; quarantine the poison file, don't wedge the scan | `tree-sitter-parser.ts` catch / `structural-indexer.ts:1254-1262` | M | M | L | BUILD (new classification on existing catch) | 12 |
| 6 | **Q5-C1** doc-symbol pass | local no-LLM markdown-heading/config-key extractor as graph nodes | `structural-indexer.ts:1236`; `indexer-types.ts` SymbolKind | M | M | L | BUILD (lane empty today) | 12 |
| 7 | **Q3-C1** PPR impact | Personalized-PageRank seeding over flat single-hop walk | `code-graph-context.ts:626-671` | L→M | L | M | BUILD (new ranking algo + walk rewrite) | 4 |
| 8 | **Q1-C1** valid_at/invalid_at supersede | bi-temporal validity windows; close edge instead of delete (as-of-last-green-scan) | `code-graph-db.ts` reindex DELETE+INSERT | M | M | H | BUILD (schema migration, shared txn boundary) | 4 |
| 9 | **Q6-C1** generation counter (hard gate) | monotonic generation; stale read = ERROR not stale set | `code-graph-db.ts` swap + `code-graph-context.ts:313-321,:227` | M | M | H | BUILD (bumps atomically with destructive reindex) | 4 |

(`fuseResultsMulti {bonusOverChannels}` reuse and apply-once G2 are cross-cutting *invariants/primitives*, not standalone scored candidates — they ride on Q3/Q4 ranking and Q1/Q2/Q6 idempotency respectively.)

### TOP-5 (promote-first)
1. **Q4-C1 rank-time trust multiplier (score 18, PROMOTE)** — confidence/evidenceClass already plumbed end-to-end to formatting; just needs a scoring read-site. Lowest-risk, highest-leverage-per-effort.
2. **Q6-C2 soft watermark (score 18, PROMOTE)** — additive `generation` field on the existing freshness envelope; the safe staged predecessor to the Q6-C1 hard gate.
3. **Cross-cut graceful-degrade + deterministic impact order (score 18, PROMOTE)** — degrade already present; a content-derived stable tiebreak makes impact output reproducible. Near-zero new surface.
4. **Q1-C2 rename→SUPERSEDES (score 12, BUILD)** — new edge type, no schema migration; lighter than the full bi-temporal window (Q1-C1) while capturing the rename-not-delete signal.
5. **Q2-C1 transient/fatal parser retry (score 12, BUILD)** — removes the single-poison-file scan wedge; classification sits on the existing parse-error catch (`structural-indexer.ts:1254-1262`).

## Questions Answered
- **Q5** — Answered. Doc lane is hash-only (`structural-indexer.ts:1236-1248`); markdown not indexed by default (`indexer-types.ts:169-171`); only json/yaml/toml index as empty `doc` rows. Proposed local no-LLM doc-symbol pass C1 (leverage M / effort M / conflict L, BUILD).
- **Q7** — Answered. 001 primitives that port: graceful-degrade (already present, `memory-context.ts:1513`), content-derived deterministic ordering (impact tiebreak + doc-node ids), apply-once G2 invariant (shared across Q1/Q2/Q6 idempotency).
- **Q8** — Answered. `fuseResultsMulti {bonusOverChannels}` is the right home for fusing CALLS/IMPORTS impact channels with a cross-channel bonus (PROMOTE the 001 fuser rather than build a code-graph-specific one); rides on Q3/Q4 ranking.

## Questions Remaining
- None blocking. All Q1-Q8 are evidence-backed and code-mapped. Residual *confirmation* items (not new research): (a) `SymbolKind` union tolerance for `heading`/`key` (Q5); (b) `fuseResultsMulti` signature genericity for code-graph shapes (Q8); (c) impact-walk current stability across runs (Q7). These are implementation-time checks, not open research questions.

## Next Focus
**SATURATED — recommend synthesis.** newInfoRatio fell 0.92→0.78→0.62→~0.45 across iters 1-4; iter-4 added no new open questions, only closed Q5/Q7/Q8 and ranked the existing candidate set. All 8 key questions answered and code-mapped. The synthesis step should: (1) emit the ranked table as the deliverable, (2) sequence the shared `code-graph-db.ts` transaction-boundary work (Q1-C1 + Q6-C1 land together or re-pay migration), (3) flag the 3 residual implementation-time confirmation items above.
