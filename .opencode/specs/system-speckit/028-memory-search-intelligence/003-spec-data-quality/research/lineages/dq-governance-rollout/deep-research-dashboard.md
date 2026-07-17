# Deep Research Dashboard: dq-governance-rollout

Auto-generated. Do not edit by hand.

## Iteration Table

| run | focus | newInfoRatio | findings | status |
|-----|-------|--------------|----------|--------|
| 1 | KQ1 unified rollout sequence | 0.88 | 5 dependency edges -> 17-stage / 7-phase master sequence | complete |
| 2 | KQ2 corpus migration plan | 0.80 | four-beat per gate; Stage-0 census; two distinct migrations (doc-gate vs retrieval) | complete |
| 3 | KQ3 safety/governance model | 0.72 | fixClass taxonomy + 2 invariants; per-stage rollback; 4 human boundaries; 4 drift guards | complete |
| 4 | KQ4 measurement plan | 0.66 | one-reader-one-metric; 4 tiers each with an earns-its-keep bar | complete |
| 5 | KQ5 NO-GO + anti-patterns | 0.40 | 18 NO-GOs derived from 10 generative anti-patterns | complete |
| 6 | KQ6 cross-lineage reconciliation | 0.30 | 3 conflicts share one build-vs-wire shape; census is the resolver | insight |
| 7 | KQ7 adversarial convergence | 0.05 | 6 attacks; 1 gap closed (self-guarding registry); 0 deliverables overturned | complete |

## Question Status

7/7 key questions answered.

- KQ1-KQ7: RESOLVED (all five deliverables complete + cross-lineage reconciliation + adversarial pass).

3 open measurements deferred to a build (inherited, named not resolved): A1 on-write write-latency on a large spec; the per-detector corpus-wide failure counts (Stage-0 census); the contradiction-detector precision/recall.

## Trend

Last 3 newInfoRatio: 0.40 -> 0.30 -> 0.05 (descending, converged).
Full: 0.88 -> 0.80 -> 0.72 -> 0.66 -> 0.40 -> 0.30 -> 0.05. One insight iteration at 6.

## The consolidated program (one line)

ONE shared safe-fix engine over a frozen fixClass registry, three front doors (on-write/scheduled/interactive) filling the one empty timing tier, every authored-body and retrieval change gated to report-only/human/C2, migrated warn->backfill->re-measure->error per gate, measured one-reader-one-metric, retrieval half frozen behind a prod-mode completeRecall@3 read it does not yet have.

## Deliverable Tally (5 deliverables)

- D1 Unified rollout sequence: 17 stages, 7 phases, 5 dependency edges. Phases I-V floor-bypassing (ship on cost); VI novel correctness/adherence (report-only, parallelizable); VII retrieval (frozen behind C2).
- D2 Migration plan: four-beat per gate (warn/backfill/re-measure/error); Stage-0 census; doc-gate migration vs retrieval migration (coverage guard + dual-cache-key, both net-new).
- D3 Safety/governance model: fixClass {safe, guarded, report-only}; INV-1 (no body auto-fix) + INV-2 (no retrieval promotion without prod@3); per-stage rollback; 4 human boundaries; 4 drift guards; self-guarding registry.
- D4 Measurement plan: 4 tiers, one-reader-one-metric. write-time = conformance-to-zero + regression-catch; scheduled = escape-class defects; retrieval = prod@3 RISE only; novel = per-item non-retrieval metric.
- D5 NO-GO + anti-patterns: 18 NO-GOs derived from 10 generative anti-patterns.

## Dead Ends

Interleaving retrieval before C2; forcing the report-only novel slate behind the migration; compressing warn->error into one flip; per-detector ad-hoc safe/risky flags; --confirm unlocking risky fixes; promoting retrieval on external/eval @K; treating the NO-GO list as a static blocklist; carrying both sides of a cross-lineage conflict; CI auto-committing safe fixes; any retrieval promotion path skipping C2.

## Next Focus

None. Lineage converged at iteration 7. Synthesis written to research.md.

## Active Risks

None outstanding. The adversarial pass (iter 7) overturned no deliverable; the one real governance gap (registry self-guarding) is closed. The two hard rails (RAIL-1 no body auto-fix, RAIL-2 no retrieval promotion without prod@3) survived as INV-1/INV-2 with no escape path.
