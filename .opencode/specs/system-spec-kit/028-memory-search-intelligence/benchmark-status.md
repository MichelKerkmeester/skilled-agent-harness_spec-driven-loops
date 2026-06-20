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
aligned golden set (60 queries, 137 labels, 0 missing/chunk; vector lane healthy, 0 query-embedding
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
Recall@20 hybrid path; they live in memory_context / temporal-edge / write-time / maintenance /
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
orchestrator: hold all default-off flags off; no unilateral production-default flip is warranted on
this evidence.

### Prior measurement (superseded by the corrected re-run above)

RESOLVED. The golden set was regenerated as a live-DB-aligned known-item benchmark (60 queries, 137
labels, 0 missing; the old curated set is backed up to `ground-truth.curated.bak.json`). The harness ran
on it via the `lib/eval` ablation framework and produced channel Recall@20 deltas (baseline ~0.46, some
channels contributing +0.09 to +0.26) plus per-flag deltas. No default-off flag earned a flip: the flags
exercised by the Recall@20 hybrid path are flat; the rest live in paths this harness does not exercise
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
  `generateGroundTruth()` just returns that static data; it does NOT derive labels from the live DB.
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
   was deliberately NOT done; default-off is the correct conservative interim state.

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
