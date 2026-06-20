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

## Criterion 6 - release-cleanup: 9/9 executed, two file-subsets deferred to a concurrent session

Executed: 001, 002, 003, 004, 005, 006, 007, 008, 009. All nine children ran their cleanup on this
branch. Two file-subsets stay deferred to the concurrent session that owns those files, not
whole-phase gaps:
- 006-commands: the command docs executed with one route-drift fix in doctor/speckit.md (commit
  818db21c54). The deep-research command-router and agent_router.md stay deferred to that session.
- 003's deep-research subset: the same session owns those SKILL.md, references and assets, so the
  agent's overstep edits there were left for reconciliation, not swept in.

These deferrals are external coordination boundaries, not implementation gaps.

## Flip decisions

This section records the per-flag promotion decisions made after the criterion-4 measurement above.
Four flags earned a default-on flip, two on an unqualified recall/calibration win and two on a no-harm
safety or grounding guarantee rather than a precision number. The rest hold off, stay off, or carry a
follow-up. The decisions below are the authoritative disposition for each measured flag.

### Flipped to default-ON

Two flags flipped on an unqualified win, two on a no-harm guarantee. The honest framing of each is in the
Evidence column so a release sign-off does not read the safety flips as precision wins they are not.

| Flag | Helper | Evidence | Verdict |
|------|--------|----------|---------|
| SPECKIT_DERIVED_ID_PROVENANCE | isDerivedIdProvenanceEnabled | UNQUALIFIED win: content-addressed identity correctness 4/4 (stability 50/50, replay 3/3, dedup discrimination 50/50, 0 collisions) | FLIP-ON |
| SPECKIT_CONFIDENCE_CALIBRATION | isConfidenceCalibrationEnabled | UNQUALIFIED win: held-out ECE 0.184 to 0.023 across all folds with a shipped isotonic model resolved by default, so the earlier overfit (fit and eval on the same set) no longer applies | FLIP-ON |
| SPECKIT_RETENTION_FORGETTING_V1 | isRetentionForgettingEnabled | SAFETY / no-harm: spares 386 keep-set rows the OFF path would delete, with dropRecall delta 0. NOT a precision win - the keep/drop labels are circular (derived from the reducer's own thresholds), so it earns the flip as a no-harm guardrail, not a measured precision gain | FLIP-ON |
| SPECKIT_WORLD_SUMMARY_PRELUDE | isWorldSummaryPreludeEnabled | GROUNDING aid: in APPEND placement it recovers 11 targets with 0 regressions by construction (it never displaces a baseline row). NOT a recall-quality win - the +0.275 is partly a self-recall plus an append-by-construction artifact, so it earns the flip as a no-displacement grounding aid, not a ranking improvement | FLIP-ON |

All four helpers now route through `isFeatureEnabled` so the env override still works. A user can force any
flag off with `SPECKIT_<FLAG>=false`. The test cascade was true-fixed: every test that encoded the old
default-off via env absence now reaches the off path through an explicit `false`, and the flag-ceiling
drift guard keeps every token accounted for as default-on.

### Held marginal

All previously held-marginal flags have been resolved. SPECKIT_WORLD_SUMMARY_PRELUDE flipped on as a
no-displacement grounding aid once the prepend-to-append fix removed its baseline displacement (see
Flipped to default-ON above).

### Default-ON (graduated, separate from the per-flag flip pass)

SPECKIT_TEMPORAL_EDGES ships default-ON (`isTemporalEdgesEnabled` graduates to TRUE via `isFeatureEnabled`,
set `SPECKIT_TEMPORAL_EDGES=false` to disable). It is the additive graph-lane mitigation, not a regression.
Re-measured on a live-DB copy the edge-hop recall is +0.083 with the flag ON versus OFF, so turning it OFF
removes the mitigation and makes recall worse. The within-noise graph-channel harm belongs to the separate
pre-028 graph flags `useGraph`, `SPECKIT_GRAPH_SIGNALS` and `SPECKIT_DEGREE_BOOST`, where the broad-corpus
delta is -0.039 at p=0.219, a noted follow-up out of 028 scope.

| Flag | Measurement | Verdict |
|------|-------------|---------|
| SPECKIT_TEMPORAL_EDGES | additive graph-lane mitigation, edge-hop recall +0.083 ON vs OFF on a live-DB copy | DEFAULT-ON |

### Kept OFF (measured)

| Flag | Measurement | Verdict |
|------|-------------|---------|
| SPECKIT_AGENTIC_RECALL | net 0, unwired scaffold with no production consumer (BUG) | KEEP-OFF |
| SPECKIT_PROCEDURAL_RELIABILITY_RECALL | the de-rate bug is fixed (the multiplier is now a prior-centered evidence-weighted delta that promotes a reliable procedure and demotes an unreliable one in a near-tie, a correctness fix that stays committed), but it moves only synthetic near-ties and has zero measurable effect on real data, so it does not earn default-on | KEEP-OFF |
| SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION | default-on already, raw cosine overstates, ECE +0.022 | KEEP-OFF (no change) |
| SPECKIT_SLEEPTIME_CONSOLIDATION | dedup 1.0 and no data loss in shadow, net benefit unmeasured | KEEP-OFF |
| SPECKIT_SLEEPTIME_LIVE_WRITE | dedup 1.0 and no data loss in shadow, net benefit unmeasured | KEEP-OFF |
| SPECKIT_ADVISOR_OUTCOME_WEIGHTED_RERANK | +0.023 held-out (2 prompts within noise), shadow-only | KEEP-OFF |
| SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING | no change on a real forward-CALLS graph | KEEP-OFF |
| SPECKIT_SUMMARY_FUSION_LANE | -0.0361 Recall@20 | KEEP-OFF |
| SPECKIT_CARDINALITY_PENALTY | 0.000 Recall@20 movement | KEEP-OFF |
| SPECKIT_BITEMPORAL_RECALL | edge family no-win | KEEP-OFF |
| SPECKIT_EDGE_VECTOR_INDEX | edge family dead flag | KEEP-OFF |
| SPECKIT_EDGE_TRIPLET_SEARCH | edge family empty table | KEEP-OFF |
| SPECKIT_SEMANTIC_EDGE_LAYER | edge family no-win | KEEP-OFF |
| SPECKIT_EDGE_PRESENCE_CURRENTNESS | edge family no-win | KEEP-OFF |

### Follow-ups

1. Wire SPECKIT_AGENTIC_RECALL to a real production consumer or remove the unwired scaffold. This is the
   only open flag bug, it stays default-off until it has a consumer to measure.
2. Re-measure SPECKIT_PROCEDURAL_RELIABILITY_RECALL on a near-tie benchmark. The de-rate bug is fixed and
   the multiplier is now promotion-capable, but it is a bounded tie-breaker with zero measurable effect on
   real data, so it stays default-off until a near-tie golden set shows a real win.

Resolved since the original follow-up list: confidence calibration earned a held-out ECE 0.184 to 0.023
across all folds with a shipped isotonic model and flipped on as an unqualified win, and the world-summary
prelude switched from prepend to append, erased its baseline displacement, and flipped on as a
no-displacement grounding aid. The procedural de-rate bug was fixed (the multiplier is committed as a
prior-centered evidence-weighted delta) but the flag reverted to default-off because the fix moves only
synthetic near-ties.
