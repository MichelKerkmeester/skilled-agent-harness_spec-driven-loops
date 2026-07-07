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

## Track C - spec-kit data quality benchmark status: PROPOSED, not run

Supersession note: the later "005 data-quality flag benchmarks" section records the landed thirteen-switch build and phase-040 measured verdicts that supersede this earlier proposed-only snapshot.

The proposed Track-C data-quality measurement slate is research-only and scaffolded. Every un-built proposed
measurement phase carries a Level-2 doc set marked PLANNED and no code has landed for that slate, so NOTHING
in this proposed Track-C slate is measured yet. The status below records what each proposed measurement would have to clear, not a result. The honest
buildable-now subset is single-digit: A4 (004), the shared engine (026), A1 (001) and A3 (003). The
retrieval tier and the thin novel items are deferred until a prod-mode read justifies them. No phase was
deleted, all 28 scaffolds are kept by operator intent.

The keystone retrieval unblocker is a spec-corpus prod-mode benchmark (phase
015-prodmode-recall-gate) built around the existing dual-mode `run-eval-v2.mjs`. It would read the
spec-doc corpus through the production default route and score completeRecall across the @3/@5/@8 window the
harness already emits plus an order-sensitive NDCG@K with a top1 guard, so a promotion needs a recall rise
AND a ranking-quality hold rather than a single set-membership number. It is PROPOSED and not yet built or
run. The operator-agreed retrieval-floor experiment (phase 027-retrieval-floor-experiment) to raise the
token budget and measure whether results 4 through 10 are signal or truncation noise is also PROPOSED, not
run.

The program explicitly inherits the production-truth eval-vs-prod fidelity finding above. Token-budget
truncation is the real prod-limiting stage and confidence truncation only guarantees a never-cut-below-3
minimum (it returns 3 to 20, cliff-conditional), so an eval-mode recall gain that lands past the prod window
does not transfer to the prod reader. That is why every Tier-C retrieval phase (014 through 018) stays
default-off: a retrieval candidate cannot earn a prod-path keep until the prod-mode read at phase 015 moves,
and the prod window itself does not widen until the phase-027 experiment shows results past rank 3 are signal
rather than noise. Until both run, no Tier-C retrieval claim carries measured support.

The nearest-to-measured item in the whole program is A4 (phase 004-schema-warn-to-error, the JSON-schema
shape-rule warn-to-error promotion). It touches write-time validation not retrieval ranking, so it sits
upstream of the prod truncation stages and carries zero prod-retrieval risk. A4 is unconditional as a
DECISION but its error flip is gated on a backfill-to-zero: a real `graphMetadataSchema` run fails 24 files
today (16 excluding archives), not the 11 an earlier JSON-parse subcount reported, so the warn-to-error flip
waits until the re-measure reads zero. Every other phase ships on cost reasoning or stays gated, none on a
measured retrieval gain.

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
[`001-speckit-memory/022-kept-off-flag-resolution/`](./001-speckit-memory/022-kept-off-flag-resolution/).

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
| SPECKIT_RETENTION_FORGETTING | isRetentionForgettingEnabled | SAFETY / no-harm: spares 386 keep-set rows the OFF path would delete, with dropRecall delta 0. NOT a precision win - the keep/drop labels are circular (derived from the reducer's own thresholds), so it earns the keep as a no-harm guardrail, not a measured precision gain | KEEP-ON |
| SPECKIT_WORLD_SUMMARY_PRELUDE | isWorldSummaryPreludeEnabled | GROUNDING aid: in APPEND placement it recovers 11 targets with 0 regressions by construction (it never displaces a baseline row). NOT a recall-quality win - the gain is partly a self-recall plus an append-by-construction artifact, so it earns the keep as a no-displacement grounding aid, not a ranking improvement | KEEP-ON |
| SPECKIT_TEMPORAL_EDGES | isTemporalEdgesEnabled | PROD-PATH displacement protection: the +0.083 edge-hop recall is an eval-mode artifact that the 3-result token-budget truncation floor cuts entirely (prod edge-hop recall delta 0.000). The keep is justified upstream of truncation. The graph-additive REORDER in `applyGraphAdditiveRecall` protects the prod top-3 from graph-channel displacement. With it OFF, low-signal graph-only candidates evict higher-scored lexical and vector hits from the truncated top-3, measured on 3 of 12 golden queries with 0 regressions (one case rescued a 64.6-scored lexical hit from eviction by roughly 31-scored graph-only candidates). The within-noise graph-channel harm belongs to the separate pre-028 graph flags `useGraph`, `SPECKIT_GRAPH_SIGNALS` and `SPECKIT_DEGREE_BOOST` (broad-corpus -0.039 at p=0.219), a noted follow-up out of 028 scope | KEEP-ON |

### Deleted (10)

Ten default-off switches and their code were removed after the fair real-world simulation showed each one
was not worthwhile. The deciding evidence is one line per flag. The code removal is already committed, so
the tree no longer carries these switches -- except SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING, recovered from
git history in `002-code-graph/010-edge-confidence-and-ppr-revisit/` for a second, fairer benchmark pass
(see that row below); the CUT verdict stands and the flag remains default-off.

| Flag | Deciding evidence | Verdict |
|------|-------------------|---------|
| SPECKIT_PROCEDURAL_RELIABILITY_RECALL (with SPECKIT_PROCEDURAL_OUTCOME_EMITTER) | shadow-only with an empty outcome ledger and eval rankDelta 0, the de-rate correctness fix stayed committed but the bounded multiplier moves only synthetic near-ties with zero real-data effect | DELETE |
| SPECKIT_SUMMARY_FUSION_LANE | displacement-only, Recall@20 -0.036, the lane only pushes a real channel hit out of the list, structural at K=20 | DELETE |
| SPECKIT_CARDINALITY_PENALTY | Recall@20 movement 0.0000, the degree-lane cap is too small to be decisive at K=20, flat even with hub distractors present | DELETE |
| SPECKIT_SLEEPTIME_CONSOLIDATION | net -1.67pp, the dedup pass hurts recall rather than helping it | DELETE |
| SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING | negative on the real forward-CALLS graph, uniform edges make PPR equal to the prior ranking. Revisited in `002-code-graph/010-edge-confidence-and-ppr-revisit/` after edge confidence stopped being uniform: PPR now loses on every metric instead of tying, so the code was recovered from git history to run that test. Present in the tree again (default-off), not currently deleted | CUT (reconfirmed) |
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

## 005 data-quality flag benchmarks: phase 040 graduation verdicts

The `003-spec-data-quality` build landed thirteen real switches, unlike the still-PROPOSED Track-C slate above.
Phase 039 restamped the tree and phase 040 ran the graduation benchmark, so every switch now carries a measured
verdict rather than a pending read. The benchmark harness toggled each flag in isolation against the phase 039
migrated tree, reusing the phase 036 integrity validator through the migrate driver verify pass for the
migration-gated flags and the phase 025 false-confirm driver plus the envelope-fidelity replay checker for the
behavioral flags. The false-confirm baseline reproduced the documented 0.833 rate exactly, which confirms the
driver is wired to the live verdict path. The full numbers live in
[`003-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/benchmark-results.md`](./003-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark/benchmark-results.md).

**Final verdict tally: twelve of thirteen kept, one deleted.** Eleven graduated on a measured before-and-after, one stays default-ON by construction, and grounding-signal was deleted as purely informational. A migration re-run then wrote the drift-gate and generator-hardening fields and a fixture re-benchmark measured the verdict and render flags, so the two pending-re-run rows and three of the four neutral rows below have since graduated, recorded in place.

### Graduated on the first benchmark (6)

Four flip default-ON, one flips OFF to enforce and one sets its CI ceiling. Each rests on a measured before-and-after.

| Flag | Phase | Verdict | Measured evidence |
|------|-------|---------|-------------------|
| `SPECKIT_IDENTITY_MERGE_SAFETY` | 033 | GRADUATE default-ON | Migrate driver verify pass on the restamped tree read 2049 folders with 0 violations, clean true, exit 0, so the lineage-preserving re-derive now reads a tree written under the new merge. |
| `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` | 035 | GRADUATE default-ON | A double generate held deterministic on 61 of 61 folders, so the no-op-skip no longer mass-rewrites the normalized tree on first save. |
| `SPECKIT_LEXICAL_GROUNDING` | 026 | GRADUATE default-ON | Off-corpus false-confirm rate fell from the 0.833 baseline to 0.000 with the flag on, a clean before-and-after on the metric the switch exists to move. |
| `SPECKIT_NOISE_FLOOR_SUBTRACTION` | 028-scoring-hardening | GRADUATE default-ON | Off-corpus false-confirm rate fell from the 0.833 baseline to 0.000 with the flag on, the same measured win lexical grounding cleared. |
| `SPECKIT_GENERATED_METADATA_GRANDFATHER` | 036 | GRADUATE default-OFF enforcing | Verify pass on the restamped tree read 2049 folders with 0 violations, exit 0, so the integrity rule flips from report-only `info` to a hard strict error. |
| `SPECKIT_FALSE_CONFIRM_MAX_RATE` | 025 | GRADUATE ceiling 0 | The CI gate exits 0 with lexical grounding on and exits 1 with the verdict flags off, so the ceiling is set to 0 and the gate now fails on any off-corpus false confirm. |

### Graduated after a migration re-run (2)

The phase 039 migration restamped the tree under identity-merge-safety and idempotent-writes only, so the two
fields these flags enforce against were never written on the first pass. A migration re-run with both field-writing
flags on then stamped source_doc_hashes and source_fingerprint across the tree, and both graduated.

| Flag | Phase | Verdict | Measured evidence |
|------|-------|---------|-------------------|
| `SPECKIT_GENERATED_METADATA_DRIFT_GATE` | 037 | GRADUATE default-ON | The re-run stamped `source_doc_hashes` across the tree (treeDocHashes 2021), and the validator with the gate on then read 2049 folders with 0 violations, so it flipped ON. |
| `SPECKIT_GENERATOR_HARDENING` | 038 | GRADUATE default-ON | The re-run stamped `source_fingerprint` (treeFingerprint 2049), and the verify pass with the flag on fell from mass-failing 2049 of 2049 to 0 violations, so it flipped ON. |

### Graduated on built fixtures (3), one deleted (1)

These four do not move the off-corpus false-confirm rate because that class never exercises their input. A fixture
re-benchmark then built the borderline, gap and render-corpus fixtures the class could not produce. Three showed a
measurable effect and graduated. Grounding-signal set its display field correctly but moved no retrieval metric, so
it was deleted with its code under the earn-or-delete bar.

| Flag | Phase | Verdict | Measured evidence |
|------|-------|---------|-------------------|
| `SPECKIT_GROUNDING_SIGNAL_V1` | 028-scoring-hardening | DELETED | A grounded-vs-low fixture confirmed it sets the field correctly, but it moves no retrieval metric: a display-only field. Deleted with its flag, reader, fixture and test under earn-or-delete. |
| `SPECKIT_CITE_WITH_CAVEAT` | 028-scoring-hardening | GRADUATE default-ON | On a borderline-grounded fixture it recovered one result the binary policy drops to do_not_cite and fired only on the borderline, a measurable effect. |
| `SPECKIT_EVIDENCE_GAP_VERDICT` | 028-scoring-hardening | GRADUATE default-ON | On a Stage-4 gap fixture it capped one otherwise-good verdict to weak and left a no-gap verdict unchanged, a measurable safety effect. |
| `SPECKIT_ENVELOPE_FIDELITY` | 027 | GRADUATE default-ON | A captured render corpus showed the checker flags 3 of 3 dropped renders a no-checker baseline passes silently and passes 3 of 3 faithful renders, a measurable effect. |

### Default-ON by construction (1)

| Flag | Phase | Verdict | Measured evidence |
|------|-------|---------|-------------------|
| `SPECKIT_GENERATED_METADATA_Z_EXCLUSION` | 034 | Stays default-ON | Cannot mass-fail, ships ON on cost with a one-var opt-out, needs no benchmark to keep. |

The drift gate and generator hardening were the first-pass blocker, measured not assumed: the field census read both fields on 0 of 2093 folders. The resolution was a migration re-run with both field-writing flags on, which stamped the fields tree-wide and graduated both. The four verdict and render flags then graduated or were deleted on built fixtures. The reckoning is complete: twelve kept, one deleted, no flag left in a pending state.
