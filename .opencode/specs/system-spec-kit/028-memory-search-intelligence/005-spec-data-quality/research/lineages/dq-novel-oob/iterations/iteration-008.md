# Iteration 008 — KQ8 (adversarial): which novel candidates actually survive the truncation law and earn a GO distinct from the reuse-first program

## Focus

Adversarial verification. Take every GO/GO-on-cost from iters 1-7 and attack it on three axes: (1) is it actually NOVEL, or does it collapse into a reuse-first item, (2) does it survive the truncation law (reach/protect the prod top-3, or honestly bypass it), (3) does it respect the two hard rails (no body auto-fix, no retrieval promotion without prod@3).

## The 13 candidates, attacked

| # | Candidate | Novel? | Floor verdict | Rail-safe? | Final |
|---|-----------|--------|---------------|-----------|-------|
| 1 | Context-budget optimizer (budget-fitting assembler variant) | YES — no lineage proposed value-under-budget selection over the returned set | BYPASS — runs after the floor, refines top-3 density/diversity, no re-index, never recovers recall | yes | GO-on-cost |
| 1b | Context-budget optimizer (score-changing variant) | NO — it is the qualityScore reranker | floor-taxed, C2-gated | yes | NO-GO as novel |
| 2 | LLM-judge → qualityScore consumer | partial — judge is a better INPUT to a shipped [0.9,1.1] multiplier, not a new lane | floor-relevant-but-weak (±10% band); governance value bypasses floor | yes | GO-on-cost (governance) / CONDITIONAL (retrieval) |
| 3 | Auto-gen answerable_questions/semantic_intent fused | auto-gen is novel; the field is a dropped no-op without a consumer | CONDITIONAL — dead field until a fusion consumer is built + C2-proven | yes | CONDITIONAL (input half only) |
| 4 | Retrieval-driven doc AUTO-rewriting | the automated form is novel and wrong | floor-taxed, re-index-per-change, reward-hacks a proxy on the source of truth | NO — crosses the body-mutate rail | NO-GO (suggest-only salvage = GO-on-cost) |
| 5 | Typed-relation KG auto-extracted | YES — LLM relations atop the shipped rule-based entity extractor | BYPASS (L/governance surface), weak on graph-boost | yes | GO-on-cost (as L/nav surface, not a lane) |
| 6 | Auto-summarization rollup nodes | NO — rejected new-node-type + infidelity multiplier | floor-ENGAGED, net-negative-capable (parent's one net-negative seam) | risky | NO-GO |
| 7 | Cross-doc contradiction + staleness detection | YES — serves the logic-consistency reader nothing else touches | BYPASS — emits findings, not vector rows | yes | GO-on-cost (lineage headline) |
| 8 | Freshness decay auto-refresh queue | novel as queue wiring on shipped FSRS | BYPASS — queues maintenance, report-only | yes | GO-on-cost |
| 9 | Embedding-drift monitoring + alerting | YES as a standing monitor — the mixed-vector guard | BYPASS — meta-check on the index; protects every prod@3 read | yes | GO-on-cost |
| 10 | Automatic example/test generation from specs | YES — strongest adherence lever, additive | BYPASS — additive adherence artifacts, no vector row | yes (additive + human-approved, dodges the rewrite rail) | GO-on-cost |
| 11 | Doc-quality leaderboard/dashboard | NO — presentation of existing signals, redundant with B1 report + DQI | floor-IRRELEVANT (human instrumentation only) | yes | NO-GO (fold into sweep report) |
| 12 | Per-doc quality SLAs | thin — threshold + ticket over existing signals/queues | floor-irrelevant; governance only | yes (report-only breach) | GO-on-cost (thin) |

## The pattern the adversarial pass exposes

1. **Every genuinely-novel GO is a FLOOR-BYPASSER.** Contradiction detection (7), drift monitoring (9), example/test generation (10), typed-relation KG (5), the budget-fitting assembler (1), the freshness queue (8) all win by serving a reader the floor does not tax (logic-consistency, adherence, index-integrity, navigation) OR by protecting the returned top-3 without a re-index. NOT ONE novel candidate beats the floor on recall. The truncation law holds with full force: no out-of-the-box idea recovers floor-cut recall without paying the re-index + prod@3 tax, and the candidates that try (auto-rewrite, score-changing budget optimizer, auto-summarization rollup) are exactly the NO-GOs.

2. **The two rails survived a fresh adversarial attack, not just inheritance.** Auto-rewriting (4) independently re-derives the no-body-mutate rail as reward-hacking-a-proxy-on-the-source-of-truth. Auto-summarization (6) independently re-derives the net-negative-rollup caution with an added infidelity term. The rails are not timidity; they are where ambition meets correctness and loses.

3. **The novel program is a CORRECTNESS + ADHERENCE program, not a retrieval program.** The reuse-first lineages optimized the retrieval/write-time/governance axes. The genuinely-new ground this lineage finds is the axis the floor leaves wide open: corpus CONSISTENCY (contradiction/staleness), measurement INTEGRITY (drift monitoring), adherence CONCRETENESS (example/test generation), and context DENSITY (budget-fitting assembler). These are the best-possible automated DQ gains that do NOT require beating the floor, and the reuse-first program named none of them.

## Dead Ends (this iteration)

- Hoping any novel idea beats the floor on recall: none does; the law is airtight against out-of-the-box framing too.
- Re-litigating the rails: both survived independent adversarial re-derivation.

## Sources

- All iters 001-007 file:line grounding (confidence-truncation, stage2-fusion, entity-extractor, fsrs-scheduler, content-normalizer, vector-index-schema, hyde, envelope, pressure-monitor)
- Parent truncation law + net-negative caution + two rails

## Assessment

newInfoRatio 0.05 — converged. No new candidate, no overturned verdict; the adversarial pass confirms the pattern (every novel GO is a floor-bypasser serving consistency/integrity/adherence/density) and the rails. The lineage's distinct contribution over the reuse-first program is now fully characterized: four headline novel floor-bypassing capabilities the reuse-first program missed.
