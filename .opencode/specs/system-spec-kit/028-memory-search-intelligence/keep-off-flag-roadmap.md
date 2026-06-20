<!-- SPECKIT_TEMPLATE_SOURCE: analysis | roadmap -->

# Keep-Off Flag Resolution: The Final Reckoning

Every 028 flag that benchmarked keep-OFF was first reinvestigated for a path to useful, then put through a fair real-world simulation and a fresh-Opus final decision gate. The path-to-useful exploration is over. This document records the final disposition: each flag is either KEPT default-ON because it earned its place or DELETED because the simulation showed it was not worthwhile. The cross-cutting finding held, every keep-off flag was mechanism-shipped and claim-deferred, but the resolution went further than "the gap is a missing connection to live data". When the connection was made and the metric still did not move, the flag was removed from the tree rather than left dormant.

## Resolution

| Flag | Disposition | One-line deciding evidence |
|------|-------------|----------------------------|
| `confidence_calibration` | KEPT default-ON | Held-out ECE 0.184 to 0.023 across all folds with a shipped isotonic model and a label-decoupling fix that removed the earlier overfit. |
| `derived_id_provenance` | KEPT default-ON | Content-addressed identity correctness 4 of 4: stability 50/50, replay 3/3, dedup discrimination 50/50, zero collisions. |
| `retention_forgetting_v1` | KEPT default-ON | Safety and no-harm guarantee, spares 386 keep-set rows the OFF path would delete with dropRecall delta 0. |
| `world_summary_prelude` | KEPT default-ON | No-displacement grounding aid, recovers 11 targets with 0 regressions by construction in append placement. |
| `temporal_edges` | KEPT default-ON | Additive graph lane, edge-hop recall +0.083 ON versus OFF on a live-DB copy, so OFF removes the mitigation. |
| `procedural_reliability_recall` (with `outcome_emitter`) | DELETED | Shadow-only with an empty outcome ledger and an eval rankDelta of 0, the de-rate fix stayed committed but the bounded multiplier moves only synthetic near-ties with zero real-data effect. |
| `summary_fusion_lane` | DELETED | Displacement-only, Recall@20 -0.036, the lane only pushes a real channel hit out of the result list, structural at K=20. |
| `cardinality_penalty` | DELETED | Recall@20 movement 0.0000, the degree-lane cap is too small to be decisive at K=20, flat even with hub distractors present. |
| `sleeptime_consolidation` | DELETED | Net -1.67pp, the dedup pass hurts recall rather than helping it. |
| `code_graph_seeded_ppr` | DELETED | Negative on the real forward-CALLS graph, uniform edges make PPR equal to the prior ranking. |
| `edge_family` (`semantic_edge_layer`, `edge_vector_index`, `edge_triplet_search`, `edge_semantic_dedup`, `edge_semantic_invalidation`) | DELETED | Generic relation-template edges carry no pair identity, recall-inert at K=20 with a single-item +0.083 that does not generalize. |
| `advisor_outcome_weighted_rerank` | DELETED | MRR within noise on an empty ledger, every skill resolves to neutral so the order never moves. |
| `bitemporal_recall` | DELETED | Zero callers, no point-in-time consumer reads the validity window. |
| `edge_presence_currentness` | DELETED | Integrity reconciliation pass that repairs 0 on the live graph, not a recall lever. |
| `agentic_recall` | DELETED | Oracle ceiling +0.344 but the live reasoner nets zero with regressions at 51s per query and no production consumer. |

## Why the path-to-useful framing was retired

The earlier triage gave each keep-off flag a root cause, a path to useful, an effort estimate and a flip potential. That framing assumed the gap was always a missing connection to live data, so every flag carried an implied "someday it flips". The simulation refuted that assumption for ten of them. Wiring the connection did not move the metric, because the structural keep-offs are recall-inert at K=20 by construction, the ledger-gated flags have no production signal to learn from, and the consumer-gated flags have no caller. A flag whose path to useful leads to no measurable win is not a deferred flip, it is dead code. The reckoning deleted the ten and their code so the tree carries only switches a reader can trust.

## How the five survivors were judged

The five kept switches split by evidence kind. Two are unqualified wins where a real metric moved: `confidence_calibration` on held-out ECE and `derived_id_provenance` on content-addressed correctness. Two are no-harm guarantees that add protection or grounding without dropping a real result: `retention_forgetting_v1` spares keep-set rows with zero dropRecall loss, and `world_summary_prelude` recovers targets in append placement without displacing a baseline row. One is an additive graph lane: `temporal_edges` reserves its own slot and recovers +0.083 edge-hop recall ON versus OFF. None of the five rests on a synthetic, circular or self-recall number alone, and the honest framing of the two no-harm flips is kept so a release sign-off never reads a safety flip as a precision win.

## The coupling note that survived deletion

`confidence_calibration` (default-ON) and `absolute_relevance_calibration` (default-ON) are coupled by construction. The isotonic model was fitted on the cosine-prior value distribution, so its input domain assumes the absolute lever is ON. Setting `absolute_relevance_calibration=false` while `confidence_calibration=true` feeds the model an RRF-magnitude input it never saw and silently mis-calibrates. The pair is in its correct state today. A coupling guard that degrades to identity on a provenance mismatch belongs on the kept calibration path so the footgun cannot fire.

## Out-of-028 follow-up that the deletions surfaced

`temporal_edges` is the additive mitigation, not a regression. The within-noise graph-channel harm belongs to the separate pre-028 graph flags `useGraph`, `SPECKIT_GRAPH_SIGNALS` and `SPECKIT_DEGREE_BOOST`, where the broad-corpus delta is -0.039 at p=0.219. That is a noted follow-up out of 028 scope and does not change any 028 disposition above.
