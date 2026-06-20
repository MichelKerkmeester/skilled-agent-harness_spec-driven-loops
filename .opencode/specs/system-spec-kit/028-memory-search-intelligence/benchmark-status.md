# 028 Benchmark Status (DoD criterion 4) + remaining cleanup (criterion 6)

Actionable record of the two open 028 completion items. Everything else (37 phases, all 42 sub-phases
built-or-gated, schema cluster, NO-GO, narrative docs, full changelog polish, 9/9 release-cleanup) is
committed and pushed.

## Criterion 4 - eval-harness benchmark pass: RUN (resolved)

### Driver-fidelity correction - supersedes the per-flag measurement below

The per-flag benchmark driver (`mcp_server/scripts/evals/run-retrieval-flag-eval.mjs`) had two
measurement defects that made its per-flag deltas non-representative of production:

- The per-flag pass hardcoded `forceAllChannels: true`, so every flag was measured on an
  all-channels path instead of the default routing path `routeQuery()` actually selects.
- The channel sweep reported a `trigger` row whose delta was identical-by-construction noise: the
  trigger lane (`exactTriggerSearch`) runs unconditionally and ignores the `triggerPhrases` lever,
  so it could never be ablated through the driver's public options.

Both are fixed driver-side only - production routing code is unchanged and default-off byte-identity
is preserved. The criterion-4 per-flag benchmark was re-run on the corrected driver against the same
aligned golden set (60 queries, 137 labels, 0 missing/chunk, vector lane healthy, 0 query-embedding
failures, vector-ablation delta +0.256 confirming the live embedder). **This re-run supersedes the
prior per-flag measurement.**

Reproduce (from `mcp_server/`, requires the live `database/context-index.sqlite` + active vector shard
and a reachable embedder): `SPECKIT_RETRIEVAL_EVAL_OUTPUT=/tmp/speckit-retrieval-flag-eval.json node scripts/evals/run-retrieval-flag-eval.mjs`

Corrected per-flag Recall@20 on the default routing path (K=20):

| Flag | Default | Recall off | Recall on | Delta | Verdict |
|------|---------|-----------|-----------|-------|---------|
| summary_fusion_lane | off | 0.4861 | 0.4500 | -0.0361 | keep OFF - enabling hurts recall |
| cardinality_penalty | off | 0.4861 | 0.4861 |  0.0000 | keep OFF - no Recall@20 movement |

The per-flag off-baseline (0.4861) is now higher than the forced all-channels baseline (0.4583)
precisely because the default routed path is what production serves - the prior all-channels number
was the non-representative artifact. All other flags are `runSearch: false` (not exercised by this
Recall@20 hybrid path, they live in memory_context / temporal-edge / write-time / maintenance /
off-turn / confidence-display paths) and stay conservatively default-off pending path-specific evals.

Channel ablation (forced all-channels baseline 0.4583, K=20), trigger noise row dropped:

| Channel | Baseline | Ablated | Delta | pValue |
|---------|----------|---------|-------|--------|
| vector  | 0.4583 | 0.7139 | +0.2556 | 0.000002 |
| graph   | 0.4583 | 0.5528 | +0.0944 | 0.0117 |
| bm25    | 0.4583 | 0.4583 |  0.0000 | n/a |
| fts5    | 0.4583 | 0.4583 |  0.0000 | n/a |

**Flip verdict re-derived from the corrected deltas: NO default-off flag earns a flip.** The only two
flags exercised by this path either hurt recall when enabled (`summary_fusion_lane`: -0.0361 on the
production routing path, confirming the prior all-channels signal) or show zero Recall@20 movement
(`cardinality_penalty`). Default-off remains the correct conservative state. Recommendation to the
orchestrator: hold all default-off flags off, no unilateral production-default flip is warranted on
this evidence.

### Prior measurement (superseded by the corrected re-run above)

RESOLVED. The golden set was regenerated as a live-DB-aligned known-item benchmark (60 queries, 137
labels, 0 missing, the old curated set is backed up to `ground-truth.curated.bak.json`). The harness ran
on it via the `lib/eval` ablation framework and produced channel Recall@20 deltas (baseline ~0.46, some
channels contributing +0.09 to +0.26) plus per-flag deltas. No default-off flag earned a flip: the flags
exercised by the Recall@20 hybrid path are flat, the rest live in paths this harness does not exercise
(memory_context, temporal-edge, write-time, maintenance, off-turn, confidence/display) so stay
conservatively default-off pending path-specific evals. Reusable helpers landed in `scripts/evals/`
(generate-known-item-ground-truth, run-retrieval-flag-eval, assert-ground-truth-alignment). Remaining
deployment note: the running daemon caches the golden set at init, so the MCP `eval_run_ablation` entry
point serves the old set until the daemon is reloaded (the lib path is authoritative and is aligned).

Original diagnosis (now fixed), for the record:

The eval-harness and its gate-zero guard work as designed. `eval_run_ablation` correctly refused to
score and named the remediation. Root cause, confirmed by direct inspection:

- The golden set is STATIC and hand-curated: `mcp_server/lib/eval/data/ground-truth.json` mirrors
  `GROUND_TRUTH_QUERIES` + `GROUND_TRUTH_RELEVANCES` in `lib/eval/ground-truth-data.ts`.
  `generateGroundTruth()` just returns that static data, it does NOT derive labels from the live DB.
- Its relevance `memoryId`s reference parent IDs that have turned over: they resolve against
  `memory_history` (99/50 sampled) but only 1/50 against the active `memory_index` (20,050 rows).
- Net: 0 of 110 queries align with the current index. `scripts/map-ground-truth-ids.js --write` runs
  but rewrites nothing (no current targets to map to). There is no aligned subset to benchmark.

Remediation (deliberate data + judgment work, NOT implementation):
1. Re-curate `GROUND_TRUTH_RELEVANCES` against the live DB (assign each query its now-relevant
   `memory_index` IDs), or fix `map-ground-truth-ids.ts` to remap old->current by content/embedding.
2. Re-run `eval_run_ablation` (requires `SPECKIT_ABLATION=true`, already honored by the daemon).
3. Review the channel + C9 deltas, then flip ONLY the default-off flags whose own metric improves.
   Flipping memory-retrieval behavior defaults on a benchmark of unknown validity is high-blast and
   was deliberately NOT done, default-off is the correct conservative interim state.

Default-off flags awaiting per-flag benchmark evidence (registered in `tests/flag-ceiling.vitest.ts`):
SPECKIT_BITEMPORAL_RECALL, SPECKIT_AGENTIC_RECALL, SPECKIT_EDGE_PRESENCE_CURRENTNESS, plus the
derived-id / retention / semantic-edge / procedural / sleeptime / calibration flags from phases
009/011/017/012/018/020, the advisor SPECKIT_ADVISOR_* shadow flags and the Code Graph
SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING, SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS and
SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB flags.

### Production-truth baseline - what the prod route actually serves

This is the production-truth baseline any append-placement feature has to clear. The production default
route collapses every query to the `DEFAULT_MIN_RESULTS=3` floor through token-budget truncation, so the
prod result window is three rows for the benchmarked corpus. Measured against that floor the prod
`completeRecall` is FLAT at about 0.0357 across K=3, K=5 and K=8, because the truncation cuts the window
to three before K=5 or K=8 can ever see a fourth row. The consequence for feature evaluation is direct:
any contribution that lands past rank 3 is invisible at prod, so a tail-additive append never reaches the
prod reader and an eval-mode gain that lives past the truncation floor does not transfer to production. A
feature earns a prod-path keep only by changing the composition of the top-3, not by adding rows the floor
cuts. The eval-mode-versus-prod-mode fidelity gap that 008 exposed is the same effect viewed from the
metric side.

## Criterion 6 - release-cleanup: 9/9 executed, two file-subsets deferred to a concurrent session

Executed: 001, 002, 003, 004, 005, 006, 007, 008, 009. All nine children ran their cleanup on this
branch. Two file-subsets stay deferred to the concurrent session that owns those files, not
whole-phase gaps:
- 006-commands: the command docs executed with one route-drift fix in doctor/speckit.md (commit
  818db21c54). The deep-research command-router and agent_router.md stay deferred to that session.
- 003's deep-research subset: the same session owns those SKILL.md, references and assets, so the
  agent's overstep edits there were left for reconciliation, not swept in.

These deferrals are external coordination boundaries, not implementation gaps.

## Flip decisions: the final flag-resolution tally

This section records the final per-flag disposition after the criterion-4 measurement above, the
keep-off reinvestigation and the flag-resolution reckoning. The earlier transitional state had four
default-on flips with the rest held off pending a path to useful. The reckoning closed that experiment.
Each default-off flag was simulated under a fair real-world load and given a final keep-or-delete decision
per flag, fresh-Opus confirmed. Five switches earned default-ON and stayed. Ten did not earn their keep
and their code was removed from the tree. The full per-flag method and the 4-layer verification live in
[`007-kept-off-flag-resolution/`](./007-kept-off-flag-resolution/).

**Final tally: KEEP 5 default-ON, DELETE 10.**

### Kept default-ON (5)

Two flags kept on an unqualified win, two on a no-harm guarantee, one as an additive graph lane. The honest
framing of each is in the Evidence column so a release sign-off does not read the safety flips as precision
wins they are not. All five route through `isFeatureEnabled` so the env override still works and a user can
force any flag off with `SPECKIT_<FLAG>=false`.

| Flag | Helper | Evidence | Verdict |
|------|--------|----------|---------|
| SPECKIT_DERIVED_ID_PROVENANCE | isDerivedIdProvenanceEnabled | UNQUALIFIED win: content-addressed identity correctness 4/4 (stability 50/50, replay 3/3, dedup discrimination 50/50, 0 collisions) | KEEP-ON |
| SPECKIT_CONFIDENCE_CALIBRATION | isConfidenceCalibrationEnabled | UNQUALIFIED win: held-out ECE 0.184 to 0.023 across all folds with a shipped isotonic model resolved by default, so the earlier overfit (fit and eval on the same set) no longer applies | KEEP-ON |
| SPECKIT_RETENTION_FORGETTING_V1 | isRetentionForgettingEnabled | SAFETY / no-harm: spares 386 keep-set rows the OFF path would delete, with dropRecall delta 0. NOT a precision win - the keep/drop labels are circular (derived from the reducer's own thresholds), so it earns the keep as a no-harm guardrail, not a measured precision gain | KEEP-ON |
| SPECKIT_WORLD_SUMMARY_PRELUDE | isWorldSummaryPreludeEnabled | GROUNDING aid: in APPEND placement it recovers 11 targets with 0 regressions by construction (it never displaces a baseline row). NOT a recall-quality win - the gain is partly a self-recall plus an append-by-construction artifact, so it earns the keep as a no-displacement grounding aid, not a ranking improvement | KEEP-ON |
| SPECKIT_TEMPORAL_EDGES | isTemporalEdgesEnabled | PROD-PATH displacement protection: the +0.083 edge-hop recall is an eval-mode artifact that the 3-result token-budget truncation floor cuts entirely (prod edge-hop recall delta 0.000). The keep is justified upstream of truncation. The graph-additive REORDER in `applyGraphAdditiveRecall` protects the prod top-3 from graph-channel displacement. With it OFF, low-signal graph-only candidates evict higher-scored lexical and vector hits from the truncated top-3, measured on 3 of 12 golden queries with 0 regressions (one case rescued a 64.6-scored lexical hit from eviction by roughly 31-scored graph-only candidates). The within-noise graph-channel harm belongs to the separate pre-028 graph flags `useGraph`, `SPECKIT_GRAPH_SIGNALS` and `SPECKIT_DEGREE_BOOST` (broad-corpus -0.039 at p=0.219), a noted follow-up out of 028 scope | KEEP-ON |

### Deleted (10)

Ten default-off switches and their code were removed after the fair real-world simulation showed each one
was not worthwhile. The deciding evidence is one line per flag. The code removal is already committed, so
the tree no longer carries these switches.

| Flag | Deciding evidence | Verdict |
|------|-------------------|---------|
| SPECKIT_PROCEDURAL_RELIABILITY_RECALL (with SPECKIT_PROCEDURAL_OUTCOME_EMITTER) | shadow-only with an empty outcome ledger and eval rankDelta 0, the de-rate correctness fix stayed committed but the bounded multiplier moves only synthetic near-ties with zero real-data effect | DELETE |
| SPECKIT_SUMMARY_FUSION_LANE | displacement-only, Recall@20 -0.036, the lane only pushes a real channel hit out of the list, structural at K=20 | DELETE |
| SPECKIT_CARDINALITY_PENALTY | Recall@20 movement 0.0000, the degree-lane cap is too small to be decisive at K=20, flat even with hub distractors present | DELETE |
| SPECKIT_SLEEPTIME_CONSOLIDATION | net -1.67pp, the dedup pass hurts recall rather than helping it | DELETE |
| SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING | negative on the real forward-CALLS graph, uniform edges make PPR equal to the prior ranking | DELETE |
| SPECKIT_SEMANTIC_EDGE_LAYER + edge family (SPECKIT_EDGE_VECTOR_INDEX, SPECKIT_EDGE_TRIPLET_SEARCH, SPECKIT_EDGE_SEMANTIC_DEDUP, SPECKIT_EDGE_SEMANTIC_INVALIDATION) | generic relation-template edges carry no pair identity, recall-inert at K=20 with a single-item +0.083 that does not generalize | DELETE |
| SPECKIT_ADVISOR_OUTCOME_WEIGHTED_RERANK | MRR within noise on an empty ledger, every skill resolves to neutral so the order never moves | DELETE |
| SPECKIT_BITEMPORAL_RECALL | zero callers, no point-in-time consumer reads the validity window | DELETE |
| SPECKIT_EDGE_PRESENCE_CURRENTNESS | a correct integrity reconciliation pass that repairs 0 on the live graph, not a recall lever | DELETE |
| SPECKIT_AGENTIC_RECALL | oracle ceiling +0.344 but the live reasoner nets zero with regressions at 51s per query and no production consumer | DELETE |

### What the reckoning changed from the transitional state

The transitional state read four flips plus a separately-graduated temporal lane, with procedural held off
behind a committed de-rate fix and the rest awaiting a path to useful. The reckoning folded temporal into
the kept-five, moved procedural from held-off to deleted because its path to useful led to zero real-data
effect, and deleted the structural keep-offs, the ledger-gated flags, the consumer-gated flags and the edge
family rather than leaving them dormant. `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION` is a pre-028 default-on
switch and is unaffected, kept on as the calibration pair partner.

### Temporal edges sign-off

SPECKIT_TEMPORAL_EDGES is signed off as a defensive guard with no measured prod-K recall benefit on the
eval-v2 classes (0 of 21 queries put a graph-only candidate in the top-3, so the reorder never fires there),
kept only for its load-bearing displacement protection on the edge-hop golden set (3 of 12, 0 regressions).
The guard is regression-pinned by `mcp_server/tests/temporal-edges-displacement-protection.vitest.ts`, which
fails closed if the graph-additive reorder ever stops quarantining a graph-only candidate that would
otherwise evict a higher-scored lexical hit from the truncated top-3.

### Follow-ups

1. Add a coupling guard on the kept calibration pair so `absolute_relevance_calibration=false` with
   `confidence_calibration=true` degrades to identity rather than silently mis-calibrating.
2. Track the within-noise graph-channel harm on the separate pre-028 graph flags `useGraph`,
   `SPECKIT_GRAPH_SIGNALS` and `SPECKIT_DEGREE_BOOST` as a follow-up out of 028 scope. `SPECKIT_TEMPORAL_EDGES`
   is the additive mitigation and is not the source of that harm.
