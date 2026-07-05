===FINDINGS START===
## RelevanceScoring (signals | how combined | cheap/expensive)

Five signals, each normalized to `[0,1]`, combined by **log-odds averaging** (mirrors the Laplace-smoothing Bayesian flavor of `lib/deep-loop/bayesian-scorer.ts:13-25` but on independent binary-evidence log-odds so one signal cannot dominate). Weights renormalize over present signals so a missing signal does not silently deflate the score.

```
s_i = clamp(signal_i, ε=0.02, 1-ε)
combined_logit = Σ (w_i / Σ w_present) * ln(s_i / (1 - s_i))
relevance_r = sigmoid(combined_logit) = 1 / (1 + exp(-combined_logit))
```

| Signal | Formula | Source / data field | Cost |
|---|---|---|---|
| `s_path` | `max(0.85*exact_basename + 0.65*exact_parent_dir + 0.35*trigram)` over `query.keywords[]` (extracted once at init) | `coverage_nodes.name` metadata + `path` (no new I/O) | O(1) per unit, pure string ops (~10ms / 10k units) |
| `s_centrality` | `0.6 * (1/(1+hops_from_seed)) + 0.4 * tanh(degree/median_degree)` seeded on query-extracted symbols via `code_graph_query(operation=blast_radius, includeTransitive=true, maxDepth=3)` | Reuses `NodeSignal` fields already produced by `lib/coverage-graph/coverage-graph-signals.ts:248-274` (`degree`, `inDegree`, `outDegree`, `depth`) | O(1) per unit if `code_graph_status().readiness === 'fresh'` (1 batched blast-radius call per iteration, cached). Fallback: `s_centrality = 0.5` (neutral) when graph is `stale`/`absent`/`unavailable`; flag in node metadata `signals.centrality.degraded=true` |
| `s_grep` | `1 - exp(-α * hits) * (1 + exp(-β * cooccurring_keyword_count))` with α=0.3, β=0.7; saturates to avoid spam-reward | `Grep -c <kw> <path>` per keyword + co-occurrence count | O(K) Greps per unit, K=query-keyword count |
| `s_embed` | `cosine(embed(unit.content[:N=512] + docstring), embed(query))` | `mk-spec-memory.embedder_list` → pick active backend; per-iteration batch; cache in sidecar `deep-context-embeddings.sqlite` keyed on `content_hash` so re-runs hit the cache | ~50-200ms per unit batched, free on cache hit. **Fallback: when `embedder_status` ≠ ready OR `embedder_set` failed, set `s_embed = 0.5` (neutral) and record `signals.embed.degraded=true`; the loop never blocks on embeddings** — explicit per the brief |
| `s_model` | `median({score : score ∈ lineage_judgments})` over the K=1..N fan-out lineages that emitted the unit; if K=0, set to neutral 0.5 | `metadata.model_judgments: [{lineageId, score, why}]` produced for free by the slice's small-model analyzer | Marginal cost 0 (already paid during fan-out) |

Default weights (all present): `[0.20, 0.20, 0.20, 0.20, 0.20]`. On degraded signal, that weight redistributes proportionally over the remaining four (e.g. embedder down → `[0.25, 0.25, 0.25, 0.25, 0.0]` renormalized). The combined log-odds form is what prevents a single degraded-signal value from collapsing the score.

## RelevanceGate (threshold + what gets pruned)

Three-band gate, configurable in `deep-context-config.json` (analog to `convergenceThreshold` at `deep-research/SKILL.md:29`):

| Band | Range | Action | Storage |
|---|---|---|---|
| `kept` | `r ≥ r_keep = 0.55` | Counts toward `newCoverageDelta` and `relevanceFloor`; rendered in final Context Report main sections (Codebase Findings, REUSE catalog) | `coverage_nodes` row with `metadata.relevance_band = "kept"` |
| `marginal` | `r_marginal = 0.35 ≤ r < 0.55` | Does **not** count toward coverage saturation; rendered in report's `Gaps & Unknowns` with `relevance_band: marginal` for honest reporting | `coverage_nodes` row with `metadata.relevance_band = "marginal"` (no edges to QUESTION nodes) |
| `pruned` | `r < 0.35` | Not stored in coverage graph at all; pruned before the `upsert.cjs` call | Iteration JSONL only, as `{ type: "pruned", unit_id_preview, score, signals, reason: "low_relevance" }` for post-mortem |

Path/scope noise (lockfiles, `.git/`, vendored deps, generated files, test fixtures) is **not** the relevance gate's job — those are filtered at scope-lock (cheaper, before fan-out). The relevance gate is the second defense against "in-scope by path, off-topic by content."

## DedupModel (identity key, merge rule, attribution)

**Identity key** (deterministic, lineage-agnostic, line-precise):
```
unit_id = sha256( normalize(path) + ':' + symbol_or_range + ':' + kind )
```
- `path` = repo-relative POSIX, normalized (no `./`, `..`, trailing slash)
- `symbol_or_range` = either fully-qualified symbol name (e.g. `coverage-graph-signals.computeSignals`) **or** `startLine:endLine` for non-symbolic content (regex hit, docstring chunk, code region)
- `kind` ∈ `{FILE, SYMBOL, PATTERN, REUSE_CATALOG, GAP, SLICE, QUESTION}` — context-specific node kinds (new, requires ADR per `deep-loop-runtime/SKILL.md §4`; see OpenQuestions)

The existing `coverage_nodes` table already has a `content_hash` column (`references/coverage_graph_schema.md:107`) and a composite primary key `(spec_folder, loop_type, session_id, id)` (line 113). Setting `id = unit_id` means the SQLite PK conflict on `scripts/upsert.cjs` upsert **is the dedup** — no new SQL, no new dedup table. The first inserter wins on row fields, subsequent matches merge metadata (see below).

**Merge rule** (when the same `unit_id` is hit by ≥2 lineages and/or ≥2 iterations):
1. `metadata.relevance` = `max(prev, new)`; `metadata.max_relevance_lineage` = lineage that produced it.
2. `metadata.lineages: string[]` = deduped insertion-ordered append (preserves "who saw it first" + "who else confirmed it").
3. `metadata.model_judgments: [{lineageId, score, why}]` = append, never replace (allows post-hoc disagreement inspection).
4. `iteration` and `created_at` of first hit preserved; `updated_at` bumped. Cheap signals (`s_path`, `s_grep`, `s_centrality`, `s_embed`) are recomputed from scratch at each iteration by the central synthesis (lineage disagreement on structural signals = the file or query moved; do not inherit).
5. **Content-drift defense**: if the same `unit_id` arrives with a different `content_hash` (file edited between iterations), preserve old content as `metadata.prev_content_hash` + `metadata.prev_iteration`, overwrite the row, set `metadata.content_drift = true`. Convergence delta treats it as the **same** unit (no re-count — active edits would otherwise let the loop never converge).

Attribution answerable from the merged row alone: "which lineages found it, what each judged, when first seen, when last confirmed, whether content changed."

## ConvergenceInteraction (how relevance feeds saturation)

Convergence is computed by a new `computeContextSignals()` in `lib/coverage-graph/coverage-graph-signals.ts`, parallel to the existing `computeResearchSignals` (line 447) and `computeReviewSignals` (line 472). The five context signals (mirroring the 5-of-research / 5-of-review count):

1. `questionCoverage` — fraction of `QUESTION` nodes with ≥2 distinct `SYMBOL`/`PATTERN` units reachable via `COVERED_BY` edges. **Reuses research's `computeResearchQuestionCoverageFromData` shape** (line 285) so the existing `scripts/convergence.cjs` scaffolding extends without rewriting.
2. `reuseCatalogCoverage` — fraction of `REUSE_CATALOG` nodes with ≥1 `EVIDENCE` edge (a `code_graph_query` confirmation or `Read` verification). Unique to context; maps to "REUSE catalog is the highest-value section."
3. `sliceSaturation` — fraction of dispatched `SLICE` nodes that yielded ≥1 KEPT unit, weighted by slice-size (LOC or symbol count). Analog to review's `hotspotSaturation` (line 200).
4. `evidenceDepth` — average of `1 / (1 + log2(weightSum))` over kept units, reusing the existing `NodeSignal.weightSum` field (line 28).
5. `relevanceFloor` — fraction of newly added units in the last iteration that landed in `kept` (not `marginal`, not `pruned`). **This is the direct enforcement of the brief's "low-relevance finds must NOT count as new coverage" constraint.**

**New-coverage delta formula** (per-iteration):
```
newCoverageDelta = | kept_ids_in_iteration_N \ kept_ids_in_iteration_<N |
                   / | sub_questions |
```
`marginal` and `pruned` units are never in the numerator. The loop's `convergenceThreshold` defaults to `0.10` (between deep-research's 0.05 and deep-review's 0.10 — context is a discovery loop with quality constraints, not pure novelty and not audit-severity). When rolling-average of `newCoverageDelta` over the last 3 evidence iterations falls below threshold → STOP candidate, gated by legal-stop and graph gates exactly like the research loop's `Rolling Average` signal (`deep-research/references/convergence/convergence_signals.md:34`).

**Vacuous-pass mirrors** (parallel to research's `computeResearchClaimVerificationRateFromData` vacuous-1.0 at line 325 — never let an empty denominator loop forever):
- No `SLICE` nodes dispatched → `sliceSaturation = 1.0`
- No `REUSE_CATALOG` nodes → `reuseCatalogCoverage = 1.0` (feature has no reusable utilities; don't penalize)
- No `QUESTION` nodes extracted → `questionCoverage = 0.0` (loop is malformed, fail loudly elsewhere)

Per-iteration JSONL record (extends the existing `graphEvents` shape from `references/state_format.md:159-165`):
```json
{
  "type": "iteration",
  "iteration": 3,
  "newCoverageDelta": 0.07,
  "relevanceFloor": 0.83,
  "keptCount": 12, "marginalCount": 3, "prunedCount": 17,
  "status": "complete",
  "focus": "...",
  "graphEvents": [
    { "type": "node", "id": "<unit_id>", "kind": "SYMBOL", "label": "...",
      "metadata": { "relevance": 0.81, "relevance_band": "kept",
                    "lineages": ["L1","L2"], "model_judgments": [...],
                    "signals": { "path": 0.7, "centrality": 0.6, "grep": 0.9,
                                 "embed": 0.5, "model": 0.85,
                                 "embed": {"degraded": false}, "centrality": {"degraded": false} } } },
    { "type": "edge", "id": "e1", "relation": "COVERED_BY", "source": "<unit_id>", "target": "<question_id>" }
  ]
}
```

## OpenQuestions

1. **NEW OWNERSHIP ADR (governance trigger)** — `deep-loop-runtime/SKILL.md §4` requires an ADR for a 3rd loop consumer. ADR must define: (a) `loop_type='context'` extension of the script's allow-list (currently `research`/`review` only, `references/script_interface_contract.md:67`); (b) the new `CONTEXT_*` node-kind set (proposed: `SLICE`, `UNIT`, `SYMBOL`, `PATTERN`, `REUSE_CATALOG`, `GAP`, reuse existing `QUESTION`); (c) `computeContextSignals` ownership — adds a new branch to `computeSignals()` in `coverage-graph-signals.ts:565-570` and a new `ContextConvergenceSignals` type alongside `ResearchConvergenceSignals`/`ReviewConvergenceSignals` (lines 31-45).
2. **Embedding storage location** — `mk-spec-memory.embedder_*` is built for spec docs, not code units. Sidecar `.opencode/skills/deep-context/database/deep-context-embeddings.sqlite` keyed on `content_hash` keeps the coverage-graph schema unchanged and lets the sidecar be re-indexed/swapped without touching the runtime-owned graph. Alternative: extend `coverage_nodes` with an `embedding BLOB` column — rejected, changes runtime-owned schema for a loop-type-specific concern.
3. **REUSE_CATALOG emission path** — let the small-model analyzer emit `REUSE_CATALOG` as a tagged subtype of `UNIT` (single source of truth: fan-out output), or run a separate post-processing pass that scans kept UNITS for "X is the canonical utility for Y" patterns (mirrors `manual_testing_playbook/09--fanout/fanout-merge-review-strongest-restriction.md`)? Lean: emit-from-analyzer, keeps convergence math pure.
4. **Marginal-units surface area in the final Context Report** — render `marginal` units under `Gaps & Unknowns` with `relevance_band: marginal` (honest, lets the reader find near-miss context), or silently drop (cleaner, but the report hides borderline relevance). Brief says "REUSE catalog is highest-value" — borderline units are exactly the "you might have missed this" catalog, lean toward surfacing.
5. **Active-edit convergence gaming** — if a developer edits a hot file between iterations and the same `unit_id` arrives with a new `content_hash`, do we re-count it as new coverage (loop never converges on an active repo) or treat as the same unit (active edits don't manufacture new evidence)? My design above chooses the latter. Confirm with the operator before locking in.
6. **Per-lineage re-weighting of structural signals** — `s_path`/`s_centrality`/`s_grep` are recomputed at each iteration by the central synthesis, so lineage disagreement on them is really a "the world changed" signal, not a "the analyzers disagree" signal. Confirm: re-run cheap signals at synthesis, do not store lineage-tagged versions of them.
===FINDINGS END===
