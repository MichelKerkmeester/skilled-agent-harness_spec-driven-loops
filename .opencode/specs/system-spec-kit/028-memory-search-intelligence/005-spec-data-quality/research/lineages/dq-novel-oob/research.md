# Research Synthesis (lineage dq-novel-oob): the novel, out-of-the-box data-quality capabilities the reuse-first program missed

<!-- ANCHOR:dq-novel-oob-index -->
Fan-out lineage `dq-novel-oob` under packet 005-spec-data-quality. The parent converged on the truncation law and a reuse-first program. The siblings built that program out: `dq-deep` named A1/B1/B2/B3/C2, `dq-automation-impl` made it build-ready, `dq-probe` named the DQI scorer, `dq-skilldoc-cmd-ctx` named the empty cron tier and per-surface detectors. Every prior lineage asked what to reuse. This lineage asks the opposite question: what genuinely-NEW capability did the reuse-first framing never reach for, and which of those survive the same truncation law. The unit is a per-candidate verdict, not a build. The truncation law and the two hard rails are inherited as settled and are NOT re-derived, they are used as the test.

## 1. Executive finding: every genuinely-novel win is a floor-bypasser, and they form a correctness-and-adherence program the reuse-first retrieval program left open

Thirteen ambitious candidates were each driven against the one live ranking consumer and the truncation law. The result is sharp and one-directional:

**Not one novel candidate recovers floor-cut recall.** The prod path truncates each query to a 3-result floor (`confidence-truncation.ts:35,102-199`), and the only live pre-truncation quality consumer is a narrow [0.9,1.1] multiplier (`stage2-fusion.ts:264-296`). So the only way an idea can change the prod top-3 is to feed that multiplier or re-rank, which is retrieval-class, re-index-bound, and promotable solely by a prod-mode completeRecall@3 read. Every candidate that tries to beat the floor on recall (auto-rewriting, the score-changing budget optimizer, auto-summarization rollups) lands in NO-GO or CONDITIONAL. The truncation law is airtight against out-of-the-box framing, not just against the reuse-first candidates.

**The genuinely-novel wins all win by NOT competing with the floor.** They serve a reader the floor does not tax. The reuse-first program optimized the retrieval, write-time, and governance axes. The open axis it never named is the one this lineage finds: corpus CONSISTENCY, measurement INTEGRITY, adherence CONCRETENESS, and context DENSITY. Four headline capabilities sit there, each floor-bypassing by construction:

1. **Cross-doc contradiction and staleness detection** (the lineage headline). Nothing in the reuse-first program serves the logic reader who needs the corpus to be internally consistent. Grep for `contradict|staleness` is empty. This is a clean new detector class, candidate-pair-gated by the already-shipped entity catalog and causal graph, entailment-scored, report-only.
2. **Embedding-drift monitoring with alerting**, reframed precisely as the mixed-vector guard the reuse-first re-index path already needs. The parent Stage 5 warns that partial coverage mixes prefixed and unprefixed vectors under the floor and confounds every delta. A standing drift monitor is the instrument that makes that warning enforceable and protects every prod-mode read.
3. **Automatic example and test generation from specs**, the strongest adherence lever in the whole topic. Concrete generated examples and a test stub steer an implementing agent far better than prose requirements. It is additive and human-approved, so it dodges the auto-rewrite rail.
4. **A context-budget-fitting assembler** at the response-envelope layer (`response/envelope.ts:19`). It refines the density and diversity of the rows truncation already returned, with no re-index. It is the rare retrieval-adjacent idea that bypasses the floor tax entirely, at the honest cost of never improving recall.

The honest headline: the best-possible automated data quality on this corpus, beyond what the reuse-first program reached, is a correctness-and-adherence program. It is built almost entirely on shipped substrate (the entity extractor, the FSRS scheduler, the causal graph, the envelope token budget) plus a small set of new report-only detectors. None of it beats the floor, and that is exactly why it is safe to ship on cost.

## 2. The 13 candidates, tiered

Reader tags: R retrieval, A adherence, L logic. Every verdict is grounded to a file:line or an inherited parent finding. The novel contribution of each is stated against the reuse-first exclusion set.

### Tier NOVEL-GO (floor-bypassing, ship on cost, distinct from the reuse-first program)

| # | Capability | Reader | Floor | Novel contribution | Verdict |
|---|------------|--------|-------|--------------------|---------|
| N5a | **Cross-doc contradiction + staleness detection** (headline). New detector class, candidate pairs nominated by the shipped entity catalog + causal graph (NOT all-pairs), LLM-entailment-scored, report-only | L high, A real | BYPASS (emits findings, not vector rows) | The reuse-first program has no corpus-consistency check of any kind; grep `contradict|staleness`=EMPTY | GO-on-cost |
| N6a | **Embedding-drift monitoring + alerting**. Per-chunk `embedding_context_version` + model/normalizer fingerprint, coverage readout, alert on a mixed-regime corpus | R (measurement integrity), gov | BYPASS (meta-check on the index) | The mixed-vector guard the reuse-first re-index path (parent Stage 5) needs and never specified as a standing monitor | GO-on-cost |
| N6b | **Automatic example/test generation from specs**. Additive generated-examples block + optional test stub, human-approved, never a silent rewrite | A high, L real | BYPASS (additive adherence artifacts) | Strongest adherence lever in the topic; feeds the reuse-first EARS/AC_COVERAGE work as its consumer | GO-on-cost |
| N1a | **Context-budget-fitting assembler**. Selects the highest-value subset of the returned rows under the agent token budget, dedup + diversity, at the envelope layer | A + L (context density) | BYPASS (runs AFTER the floor, no re-index) | No lineage proposed value-under-budget selection over the returned set; it protects top-3 quality without paying the floor tax | GO-on-cost |
| N4a | **Typed-relation KG auto-extraction**. LLM typed edges (depends-on, supersedes) atop the shipped rule-based entity extractor, as a navigation + provenance surface | L real, R marginal | BYPASS (L/nav surface), weak on graph-boost | The shipped extractor gets entity MENTIONS only; typed relations are the new delta, built as a surface NOT a ranking lane | GO-on-cost |
| N5b | **Freshness decay auto-refresh queue**. Threshold the shipped FSRS retrievability and file a report-only refresh item | L/gov modest | BYPASS (queues maintenance) | Novel only as the queue wiring on top of the shipped decay number; FSRS already models the decay | GO-on-cost |
| N7b | **Per-doc quality SLAs** (thin). A target field on the description.json governance block + a breach-files-a-report-only-queue-item rule | L/gov modest | IRRELEVANT (governance only) | A threshold + a ticket over signals and a queue that already exist or are already proposed | GO-on-cost (thin) |
| N2a | **LLM-as-judge wired to the qualityScore consumer** (governance role). The judge is a better INPUT to the shipped [0.9,1.1] multiplier | A + gov real, R weak | BYPASS for governance; floor-relevant-but-weak for ranking | Reframes the parent's CONDITIONAL judge: it is not a new lane, the consumer already exists | GO-on-cost (governance) |
| N3b | **Suggest-only doc rewriting** (the salvage of auto-rewrite). LLM proposes a diff, a human approves, the change flows through the normal authored-write path | A + L | n/a (human-gated) | Produces a concrete candidate DIFF, more than the reuse-first B3 generic queued action | GO-on-cost |

### Tier CONDITIONAL (retrieval-class, re-index-bound, promotable only by a prod-mode completeRecall@3 read)

| # | Capability | Reader | Floor | Verdict |
|---|------------|--------|-------|---------|
| N2b | LLM-as-judge as a RANKING lever (the same judge, now asked to move the top-3) | R | Floor-relevant but capped at the ±10% multiplier band; prove marginal value over the form-only scorer via C2 before paying an LLM pass per doc | CONDITIONAL |
| N3a | Auto-generated answerable_questions/semantic_intent FUSED as pseudo-queries | R | A dropped no-op on disk until a fusion consumer is built (grep=EMPTY); the consumer is retrieval-class and C2-gated | CONDITIONAL (input half only) |

### Tier NOVEL-NO-GO (ambition meets the floor or a rail and loses)

| # | Capability | Reader | Why it dies | Verdict |
|---|------------|--------|-------------|---------|
| N3c | Retrieval-driven AUTO-rewriting of authored bodies | R claimed | Mutates the source of truth to chase a proxy, reward-hacks the embedding, unprovable per-change (re-index + prod@3 per rewrite), crosses the no-body-mutate rail | NO-GO |
| N4b | Auto-summarization rollup nodes | R claimed | The already-rejected new-node-type + an LLM infidelity multiplier, sitting on the parent's one net-negative seam (a summary can displace a higher-fidelity child in the top-3) | NO-GO |
| N7a | Doc-quality leaderboard/dashboard | none direct | The least-novel item: a presentation of existing signals (quality_score, DQI, the stage2-fusion bonuses), redundant with the B1 sweep report; floor-irrelevant human instrumentation | NO-GO (fold into B1 report) |
| N1b | Score-changing context-budget optimizer | R | It is the qualityScore reranker by another name, retrieval-class and C2-gated, not novel | NO-GO as novel |

## 3. Cross-cutting findings

**The floor is the filter that sorts ambition from reality.** The single most useful operation in this lineage was to ask of each candidate: does it change the composition of the truncated top-3, or does it serve a reader the floor does not tax. The first group is always retrieval-class and C2-gated, the second group is always the genuinely-shippable novel win. There is no third group. No clever framing escapes this.

**Half the topic was already half-built.** The entity extractor ships (`lib/extraction/entity-extractor.ts`, `SPECKIT_AUTO_ENTITIES`), the decay model ships (`fsrs-scheduler.ts`), the causal graph ships (`handlers/causal-graph.ts`), the token budget exists on the envelope (`response/envelope.ts:19`), and the quality multiplier exists (`stage2-fusion.ts:264-296`). So even the out-of-the-box candidates mostly resolve to enrichment of shipped substrate, not green-field. The genuinely-empty grounds, the ones where grep returns nothing, are exactly the four headline wins: contradiction detection, drift monitoring, test generation, and the budget-fitting assembler.

**The two rails are correctness, not caution.** Auto-rewriting independently re-derives the no-body-mutate rail as reward-hacking-a-proxy-on-the-source-of-truth. Auto-summarization independently re-derives the net-negative-rollup caution with an added infidelity term. Both rails survive a fresh adversarial attack from the most ambitious direction available. The rails are where ambition meets the source-of-truth contract and the floor, and loses on the merits.

**The novel program does not compete with the reuse-first program, it completes it.** The reuse-first program owns the retrieval, write-time-gate, and governance axes. This lineage owns the consistency, integrity, adherence-concreteness, and density axes. The two are disjoint and additive. Every novel GO here either rides a reuse-first surface (the B1 sweep hosts the contradiction detector, the A7 EARS work consumes the generated tests, the B3 queue absorbs the freshness and SLA tickets) or sits at a layer the reuse-first program never reached (the response envelope, a standing drift monitor).

## 4. The shippable novel slate, ordered by safety

The order is the safety property, mirroring the parent doctrine. Every item is report-only or additive or human-gated. None touches the retrieval floor.

1. **Embedding-drift monitor (N6a)** first, because it is the instrument that protects every later measurement, including the reuse-first C2 prod-mode read, from the mixed-vector confound. Per-chunk version + fingerprint, coverage readout, alert on mixed-regime.
2. **Cross-doc contradiction + staleness detector (N5a)** as a new detector class on the reuse-first B1 sweep / B2 doctor surface. Graph-nominated candidate pairs, entailment-scored, report-only. The headline corpus-consistency win.
3. **Example/test generation from specs (N6b)** as an additive, human-approved adherence artifact feeding the EARS/AC_COVERAGE work.
4. **Typed-relation KG surface (N4a)** atop the shipped entity catalog, as navigation and provenance, never a ranking lane.
5. **Context-budget-fitting assembler (N1a)** at the envelope layer, default-off, measured on context density and duplicate rate, not recall.
6. **Freshness decay auto-refresh queue (N5b)** and **per-doc SLAs (N7b)** as thin report-only tickets once the B3/KQ5 queue exists.
7. **LLM-judge as a governance score (N2a)** wired to the existing qualityScore field, with its ranking use (N2b) held behind C2 like every other retrieval-class item.

## 5. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Score-changing context-budget optimizer | It is the qualityScore reranker, retrieval-class, C2-gated, not novel | `stage2-fusion.ts:264-296` | 1 |
| Context-budget optimizer as a recall lever | Recall is fixed before the floor runs; an assembler cannot add a floor-cut row | `confidence-truncation.ts:102-199` | 1 |
| LLM-judge as a new ranking lane | The [0.9,1.1] multiplier already exists; a second scorer repeats dq-deep's rail | `stage2-fusion.ts:264-296` | 2 |
| Auto-gen answerable_questions without a fusion consumer | Dropped no-op on disk, the 028 silent-drop trap | grep `answerable_questions`=EMPTY | 2 |
| Closed-loop auto-rewrite-and-re-embed of authored bodies | Reward-hacks a proxy on the source of truth, unprovable per-change, crosses the no-body-mutate rail | `quality-loop.ts attemptAutoFix`; `content-normalizer.ts:222,228` | 3 |
| Rewriting to a form-only quality-loop score | A high form score is not a retrieval win | dq-deep measurement-honesty finding | 3 |
| Parallel KG index lane | Duplicates the shipped entity catalog + causal graph, risks the self-referential community cycle | `entity-extractor.ts`; parent new-node-type NO-GO | 4 |
| Auto-summarization rollup nodes | The rejected new-node-type + an LLM infidelity multiplier on the parent's net-negative seam | parent rollup net-negative caution | 4 |
| All-pairs contradiction scan | O(n^2) LLM passes, intractable and noisy | design; `entity-extractor.ts` | 5 |
| Embedding-similarity-alone contradiction | Flags paraphrase not contradiction, needs an entailment/negation signal | design | 5 |
| A new decay model for freshness | FSRS already ships the canonical decay | `fsrs-scheduler.ts` | 5 |
| Drift monitoring as a generic model-version abstraction | The concrete measurable drift here is mixed-version vectors under the floor | parent Stage 5 | 6 |
| Auto-generated tests written as authoritative | Must be additive + suggest-and-approve, same authorship rail as auto-rewrite | the two hard rails | 6 |
| Separate doc-quality dashboard service | Presentation of existing signals, redundant with the B1 sweep report + DQI | reuse-first B1; dq-probe DQI | 7 |
| SLAs that auto-remediate on breach | Crosses the no-body-mutate rail; a breach files a report-only item only | the two hard rails | 7 |
| Any novel idea beating the truncation floor on recall | None does; the law is airtight against out-of-the-box framing too | parent truncation law | 8 |

## 6. Open Questions

- Whether the LLM-judge semantic score beats the form-only quality_score over the existing [0.9,1.1] multiplier. OPEN, inherits the parent C2 gate (needs a prod-mode completeRecall@3 read).
- The precision and recall of an entailment-based contradiction detector on graph-nominated candidate pairs. OPEN, deferred to a build-stage measurement.
- The corpus-wide count of mixed-embedding-regime chunks, the drift monitor's Stage-0 census. OPEN, deferred to a build.

## 7. Prove-First Caveats

This is a research deliverable, not a build. Nothing here is shipped.

- **Confirmed by file:line:** the truncation floor (`confidence-truncation.ts:35,102-199`), the single live pre-truncation quality consumer (`stage2-fusion.ts:264-296`), the shipped entity extractor (`lib/extraction/entity-extractor.ts`), the shipped FSRS decay (`fsrs-scheduler.ts`), the envelope token budget (`response/envelope.ts:19`), and the empty greps that prove contradiction detection, drift monitoring, and test generation are net-new.
- **Floor-bypassing and therefore shippable on cost:** the four headline novel wins and the thin governance items all serve a reader the floor does not tax, or refine the returned set without a re-index. Their value is in consistency, integrity, adherence, and density, all directly enforceable, none of it a retrieval claim.
- **Hypothesis-until-prod-measured:** every retrieval-class item (the LLM-judge as a ranking lever, the auto-gen answerable-questions fusion) stays frozen until the reuse-first C2 gate reads a prod-mode completeRecall@3 RISE, never the eval column. The novel program does not change that gate, it routes around it.

## 8. Convergence Report

- **Stop reason:** converged / all_questions_answered. 8/8 key questions resolved with file:line grounding; the adversarial pass confirmed the pattern and overturned no verdict.
- **Total iterations:** 8.
- **Questions answered:** 8/8 key questions; 3 open questions deferred to a build stage.
- **newInfoRatio trend:** 0.90 -> 0.80 -> 0.74 -> 0.70 -> 0.66 -> 0.62 -> 0.34 -> 0.05 (descending; two insight iterations at 3 and 5).
- **Quality guards:** source diversity PASS (confidence-truncation, stage2-fusion, entity-extractor, entity-linker, causal-graph, fsrs-scheduler, content-normalizer, vector-index-schema, hyde, envelope, pressure-monitor, quality-loop, learned-feedback, plus parent and sibling lineage findings, independent file:line sources); focus alignment PASS (every candidate carries concept + value-per-reader + feasibility + floor-survival + go/no-go); no-single-weak-source PASS.

## References

- Parent: `../../research.md` (truncation law, two rails, net-negative rollup caution).
- Siblings: `../dq-deep/research.md` (A1/B1/B2/B3/C2), `../dq-automation-impl/research.md` (build-ready keystones), `../dq-probe/research.md` (DQI scorer), `../dq-skilldoc-cmd-ctx/research.md` (empty cron tier, per-surface detectors). These define the reuse-first exclusion set this lineage works around.
- Floor + consumer: `confidence-truncation.ts:35,102-199`; `stage2-fusion.ts:264-296,277-287`.
- Shipped substrate: `lib/extraction/entity-extractor.ts`; `lib/search/entity-linker.ts`; `handlers/causal-graph.ts`; `lib/cognitive/fsrs-scheduler.ts`; `response/envelope.ts:19`; `cognitive/pressure-monitor.ts`; `lib/search/hyde.ts`.
- Rails + cautions: `quality-loop.ts attemptAutoFix`; `content-normalizer.ts:222,228`; `vector-index-schema.ts:643,771-785`.

(`resource-map.md` not present at init; no coverage gate cited.)
<!-- /ANCHOR:dq-novel-oob-index -->
