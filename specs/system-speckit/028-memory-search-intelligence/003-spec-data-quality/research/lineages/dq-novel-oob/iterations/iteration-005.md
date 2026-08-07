# Iteration 005 — KQ5: Cross-doc contradiction + staleness detection, and doc-freshness decay with auto-refresh queueing

## Focus

Two correctness-oriented candidates the reuse-first program never named. (a) Automatic cross-doc contradiction + staleness detection: find pairs of docs that assert conflicting facts, or a doc whose claims the corpus has since superseded. (b) Doc-freshness decay with auto-refresh queueing: a doc's trust decays over time and crosses a threshold that queues a refresh.

## What the live code actually does

- Contradiction detection: grep for `contradict | staleness | inconsisten` across mcp_server search/lib is EMPTY. No contradiction detector, no cross-doc consistency check exists. Genuinely net-new.
- Freshness decay: the decay PRIMITIVE already ships. `lib/cognitive/fsrs-scheduler.ts` is the canonical long-term decay (retrievability via the FSRS v4 formula, stability, `nextReviewDate`), consumed by composite-scoring temporal decay and `attention-decay.ts`. So "freshness decays" is already modeled for RANKING. What is absent is a decay-crosses-threshold → QUEUE-a-refresh action; the decay today only down-weights, it never queues maintenance.
- The reuse-first program proposed freshness GOVERNANCE FIELDS (temporal/freshness in description.json) and freshness-binding causal_summary to source_docs, but never a decay-driven auto-refresh QUEUE.

## The novel analysis

1. **Cross-doc contradiction detection is the strongest genuinely-novel correctness capability in the whole topic.** It serves a reader job none of the existing machinery touches: the LOGIC reader who needs the corpus to be internally consistent. It is floor-bypassing by construction (it is a write-time / sweep-time CHECK that emits a finding, not a vector row). It maps onto the reuse-first B1 sweep + B2 /doctor surfaces as a NEW detector class. The hard part is precision: naive embedding-similarity-plus-negation is noisy; a useful detector needs an LLM entailment pass over candidate pairs, which is expensive at O(n^2) pairs but tractable if gated to within-packet and cross-reference pairs (use the shipped entity catalog + causal graph to nominate candidate pairs instead of all-pairs).
2. **Staleness detection** is the temporal half of the same capability: a doc that asserts X where a newer doc asserts not-X. It reuses the same entailment detector plus the existing timestamp/provenance fields. Distinct from FSRS decay (which is time-since-review, content-blind); staleness is content-superseded.
3. **Freshness decay auto-refresh queue** is a thin, honest addition: read the SHIPPED FSRS retrievability, threshold it, and emit a report-only refresh item into the same B3-style queue. It bypasses the floor (it queues maintenance, it does not rewrite or re-rank). It is novel only as the QUEUE wiring on top of the shipped decay number.

## Value per reader

- Contradiction/staleness detection: L logic HIGH (corpus consistency is a logic-reader job nothing else serves), A adherence real (contradictory specs produce contradictory agent behavior), R none.
- Freshness decay auto-refresh queue: L/governance modest (surfaces stale docs for human refresh), R none, A low.

## Floor survival

Both bypass the floor entirely. Contradiction detection emits findings; the refresh queue emits maintenance items. Neither adds or reorders a vector row, so neither pays the truncation tax. This is the cleanest floor-survival profile in the lineage.

## Go / No-Go

- Cross-doc contradiction + staleness detection: GO-on-cost, novel, distinct from the entire reuse-first program. Build as a new detector class on the B1 sweep / B2 doctor surface, candidate-pair-gated by the shipped entity catalog + causal graph (NOT all-pairs), LLM-entailment-scored, report-only. This is the lineage's headline novel capability.
- Freshness decay auto-refresh queue: GO-on-cost, novel as queue wiring, cheap (reads shipped FSRS retrievability). Report-only; it must never auto-refresh a body (inherits the no-body-mutate rail).

## Dead Ends

- All-pairs contradiction scan: O(n^2) LLM passes, intractable and noisy; gate by graph-nominated candidate pairs.
- Embedding-similarity-alone contradiction: high similarity flags PARAPHRASE, not contradiction; needs an entailment/negation signal.
- A new decay model: FSRS already ships; reuse its retrievability, do not re-derive decay.

## Sources

- grep `contradict|staleness|inconsisten` in mcp_server = EMPTY (net-new)
- `lib/cognitive/fsrs-scheduler.ts` (shipped decay: retrievability, stability, nextReviewDate)
- `lib/extraction/entity-extractor.ts` + `handlers/causal-graph.ts` (candidate-pair nomination substrate)
- Reuse-first B1 sweep / B2 doctor (the host surface for a new detector class)

## Assessment

newInfoRatio 0.66 — surfaced the lineage's strongest novel capability (cross-doc contradiction detection: a clean floor-bypass serving the logic reader, served by nothing in the reuse-first program). Freshness auto-refresh is a thin honest queue on shipped FSRS. Both GO-on-cost, report-only.
