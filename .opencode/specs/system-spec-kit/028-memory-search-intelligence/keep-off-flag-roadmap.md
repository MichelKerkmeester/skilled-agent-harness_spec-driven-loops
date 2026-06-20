<!-- SPECKIT_TEMPLATE_SOURCE: analysis | roadmap -->

# Keep-Off Flag Reinvestigation: Path to Useful

Every 028 flag that benchmarked keep-OFF, reinvestigated through deep research to find the concrete path that makes it improve a real metric. Each entry gives root cause, the fix path, effort, flip potential, and the validation gate. The cross-cutting finding: every keep-off flag is mechanism-shipped claim-deferred by design, so the gap is always a missing connection to live data, not a logic bug.

## Triage

| Flag | Root cause | Path to useful | Effort | Flip potential |
|------|-----------|----------------|--------|----------------|
| `procedural_reliability_recall` | multiplier is `score*(mean-1) <= 0`, only de-rates | FIXED with a prior-centered evidence-weighted delta, the de-rate is gone and it is promotion-capable (committed df25873966) | S | SAFE now, but the flip needs a near-tie benchmark because the bounded nudge is a tie-breaker not a large-gap mover |
| `temporal_edges` graph lane | competitive top-K evicts lexical hits (-0.167) | additive reserved-slot, the append-not-displace pattern | S-M | HIGH, repairs a live regression (implementing) |
| `sleeptime_consolidation` | benefit unmeasurable, no index mutation, intrinsic-only metric | materialize dedup on a DB copy then A/B-query it | M | MED, cheap unlock, reuses the harness |
| `code_graph_seeded_ppr` | data mismatch, uniform edges plus no depth-2 make PPR equal RRF | caller-centrality prior plus real depth-2 anchor fixtures | M-L | MED |
| `agentic_recall` | half-built, no consumer and no reasoner (spec phase 016) | IRCoT wiring reusing the LLM-reformulation transport, plus a multi-hop golden set and the mode-enum | M | MED, prove-first |
| `semantic_edge_layer` (producer) | DONE, the batch pass populates 20530 edge vectors that dedup-collapse to 506 distinct fact_texts | works, but the fact_text is generic relation-template boilerplate encoding the relation type, not the pair identity | M | prerequisite BUILT, but the input carries no pair-identity signal |
| `edge_vector_index` + `edge_triplet_search` (consumer) | WIRED additively (flag-off no-op, no displacement) but recall-inert, surfaces the edge-hop target for 0 of 12 golden items | a richer producer input (endpoint titles, not bare relation templates) might carry pair-identity, a future producer redesign | M | KEEP-OFF, structurally recall-inert at K=20, joins summary_fusion and cardinality |
| `advisor_outcome_weighted_rerank` | severed from the live sort and the outcome ledger is empty so every skill is neutral 0.5 | populate the ledger via a post-task emitter, wire the Beta resolver, reorder only inside a near-tie window | M-L | LOW-MED, the ledger is the long pole |
| `bitemporal_recall` | no point-in-time consumer reads the validity window | an as-of recall mode plus a new bitemporal golden set | L | DEFER until time-travel queries are a requirement |
| `edge_presence_currentness` | a correct integrity reconciliation pass, not a recall lever (repairs 0 on the live graph) | none needed | n/a | WON'T, keep off by design |
| `summary_fusion_lane` | STRUCTURALLY inert, vector plus BM25 plus FTS already saturate the topics at recall 1.0, so the lane only displaces real channel hits | a participation gate reduces harm-if-on from -0.05 to -0.028, but the lane stays net-negative even on the now-authored real thematic and graph_relationship classes (-0.125 on graph_relationship) | M | KEEP-OFF, structural at K=20, the missing-class hypothesis is refuted |
| `cardinality_penalty` | the degree channel cap (0.15) is too small to be decisive at K=20, so damping it changes zero results | raising the degree-lane influence is a broad-blast ranking change | High | KEEP-OFF, structurally flat, proven even with graph_relationship hub distractors present |
| `absolute_relevance_calibration` | already correct, the committed isotonic model was fitted on the cosine prior so it must stay paired with `confidence_calibration` | keep both ON and add a coupling guard so abs-OFF plus calib-ON cannot silently mis-calibrate | S | DONE (correctly paired), harden with the guard |

## The golden-set skew was NOT the blocker (refuted by the authored classes)

The hypothesis was that the class skew explained the inert fusion levers. Authoring 16 real thematic and graph_relationship golden queries (ids 61-76, all gold ids grounded in the live DB) refuted it: `summary_fusion_lane` stays net-negative (-0.125 on graph_relationship) and `cardinality_penalty` stays flat even on their target classes. The inertness is STRUCTURAL at K=20, not a fixture gap. The new classes plus the per-class eval are still the win, they turn the verdict from a guess into a measured fact. The prerequisite for evaluating either is a per-class Recall@20 plus nDCG@10 eval (the class fields and both metric helpers already exist, the eval just computes a single mean) plus authoring the two missing query classes. Until then the per-class eval will honestly report no signal for both, which is itself a useful result.

## Coupling footgun (acts on the confidence_calibration flip just shipped)

`confidence_calibration` (now default-ON) and `absolute_relevance_calibration` (default-ON) are coupled by construction. The isotonic model was fitted on the cosine-prior value distribution, so its input domain assumes absolute relevance is ON. Setting `absolute_relevance_calibration=false` while `confidence_calibration=true` feeds the model an RRF-magnitude input it never saw and silently mis-calibrates. The pair is in its correct state today, but a coupling guard (degrade to identity on a provenance mismatch) should be added so the footgun cannot fire.

## Quick wins versus packets

- **Quick wins (low effort, clear flip):** `procedural_reliability_recall` (center on prior) and `temporal_edges` (additive lane). Both are being implemented and re-benchmarked now. The temporal-edges fix also repairs a current default-ON recall regression.
- **Cheap unlocks (medium, high leverage):** `sleeptime_consolidation` A/B reuses the existing backup-to-copy harness in full, and the PPR real-anchor fixtures are small.
- **Scoped packets (prove-first):** `agentic_recall` (IRCoT plus multi-hop benchmark plus the mode-enum contract change) and the edge producer-then-consumer pair (gated on whether the flat graph carries relation signal).
- **Long pole:** `advisor_outcome_weighted_rerank` needs a production post-task ledger emitter across three runtimes plus a corpus three to four times larger before its effect clears noise.
- **Defer or won't:** `bitemporal_recall` until point-in-time queries are real, and `edge_presence_currentness` stays off as a non-recall integrity pass.

## Metric corrections to adopt regardless

- `advisor_outcome_weighted_rerank` should report MRR plus right-skill@3, not right-skill@1 alone, because a tie-break reranker moves rank 2 to rank 1 rather than changing the head.
- PPR and sleeptime both need multi-run benchmarks. The current numbers are single-run and preliminary.

## Validation gates

- procedural: `rankDelta > 0` AND `ndcgDelta > 0` on the existing procedural metric.
- temporal_edges: `graphLaneDelta >= 0` (was -0.167) with no other lane regressing.
- sleeptime: `recall_delta >= -epsilon` AND `precision_delta >= 0` AND `row_count` down AND no ground-truth id in the drop-set.
- ppr: `ranking_changed` plus `target_rank_improved` on real depth-2 anchors, multi-run.
- agentic: net `Recall@K > 0` on a multi-hop golden set with near-zero single-hop regression and latency inside budget.
