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
| `temporal_edges` | KEPT default-ON | Prod-path displacement protection. The +0.083 edge-hop recall is an eval-mode artifact the 3-result truncation floor cuts to a 0.000 prod delta, so the keep rests upstream of truncation on the graph-additive reorder that protects the prod top-3 from graph-channel displacement, 3 of 12 golden queries with 0 regressions. |
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

The five kept switches split by evidence kind. Two are unqualified wins where a real metric moved: `confidence_calibration` on held-out ECE and `derived_id_provenance` on content-addressed correctness. Two are no-harm guarantees that add protection or grounding without dropping a real result: `retention_forgetting_v1` spares keep-set rows with zero dropRecall loss, and `world_summary_prelude` recovers targets in append placement without displacing a baseline row. One earns its keep on prod-path displacement protection: `temporal_edges` adds no row the prod truncation floor keeps, so its +0.083 edge-hop recall is an eval-mode artifact with a 0.000 prod delta, but its graph-additive reorder protects the prod top-3 from being displaced by low-signal graph-only candidates, measured on 3 of 12 golden queries with 0 regressions. None of the five rests on a synthetic, circular or self-recall number alone, and the honest framing of the two no-harm flips is kept so a release sign-off never reads a safety flip as a precision win.

## The coupling note that survived deletion

`confidence_calibration` (default-ON) and `absolute_relevance_calibration` (default-ON) are coupled by construction. The isotonic model was fitted on the cosine-prior value distribution, so its input domain assumes the absolute lever is ON. Setting `absolute_relevance_calibration=false` while `confidence_calibration=true` feeds the model an RRF-magnitude input it never saw and silently mis-calibrates. The pair is in its correct state today. A coupling guard that degrades to identity on a provenance mismatch belongs on the kept calibration path so the footgun cannot fire.

## Out-of-028 follow-up that the deletions surfaced

`temporal_edges` is the additive mitigation, not a regression. The within-noise graph-channel harm belongs to the separate pre-028 graph flags `useGraph`, `SPECKIT_GRAPH_SIGNALS` and `SPECKIT_DEGREE_BOOST`, where the broad-corpus delta is -0.039 at p=0.219. That is a noted follow-up out of 028 scope and does not change any 028 disposition above.

## Track C data-quality proposed keep-off candidates

The new Track-C data-quality research produced a conditional retrieval slate that, if built, would ship default-off exactly like the keep-off flags above. These candidates would stay off until the phase-015 prod-mode completeRecall@3/@5/@8 gate plus an order-sensitive NDCG@K with a top1 guard `015-c2-prodmode-recall-gate` shows a real move, because the truncation law makes their eval-mode contribution untransferable. Token-budget truncation is the real prod-limiting stage and confidence truncation only guarantees a never-cut-below-3 minimum, the same eval-vs-prod fidelity gap that decided `temporal_edges` in the table above, so a retrieval candidate that lifts recall@K in eval mode lands invisible to the prod reader and cannot earn a keep on eval numbers alone. A promotion at phase 015 now needs a recall rise across the @3/@5/@8 window AND a ranking-quality hold on NDCG@K with a top1 guard. The phase-015 gate is the named unblocker for the whole slate.

Four candidates make up the conditional retrieval slate. `014-c1-chunk-prefix` prefixes each embedded chunk with its header path and global identity to lift recall. `016-c3-answerable-questions-tags` tags each doc with the questions it can answer so retrieval matches intent. `017-c4-metadata-fusion` fuses metadata into the embedding so the signal travels inside the vector not beside it. `018-c5-llm-judge-scorer` grades the retrieval candidates the floor would otherwise hide. Each would ship behind a C-tier retrieval flag whose name is indicative only and not yet assigned.

The seven novel capabilities in phases 019 through 025 also ship default-off, but as a dark-launch safety default not a truncation gate. Each is floor-bypassing by construction and each spec explicitly disclaims the C2 gate, because its value proof is non-retrieval, a found contradiction or a queued stale doc rather than a recall rise. They are not keep-off-by-truncation candidates. The one bridge the research names is conditional. If a future change feeds a novel signal such as the `023-novel-typed-relation-kg` edges into the retrieval fusion path, that extension becomes retrieval-class and inherits the same phase-015 gate.

None of this is built. Track-C is research-only and nothing has shipped, so these are not yet keep-off flags. They are future keep-off candidates with their gate already named, the phase-015 prod-mode completeRecall@3/@5/@8 read plus an order-sensitive NDCG@K with a top1 guard, so a later build inherits the disposition discipline of the table above rather than reopening the question.

## The 005 data-quality build: thirteen real keep-off flags with a named graduation gate

The Track-C section above closed on a promise, that the data-quality slate was research-only and its candidates were future keep-off flags with a gate already named. The `005-spec-data-quality` build has now landed the first concrete generation of that lineage. Thirteen switches exist in the tree across the descriptions cache, the metadata generators and the search-verdict path. They are real keep-off flags now, not proposals, and they inherit the disposition discipline of the resolution table at the top of this document rather than reopening the question. None has earned a default-ON flip on a measured before-and-after, so each carries the same honest framing the original keep-offs carried: built first, kept off until the evidence earns the flip.

The gate is two phases and it is named. Phase 039 is a full-repo migration that restamps every `description.json` and `graph-metadata.json` in the whole tree, including `z_archive` and `z_future`, from the old prose-status, prefixed-path and wall-clock shapes to the new contract. That restamp earns every migration-gated flip, because the reason those flags ship off is that the live files still speak the old contract the new switch rejects or would rewrite. Phase 040 is the benchmark that measures each behavioral switch's before-and-after on live data and graduates the earners to default-ON under the original 028 earn-or-delete discipline. A migration-gated flag waits on 039. A benchmark-gated flag waits on 040. One waits on both.

| Flag | Disposition | Graduation gate | One-line reason it is off |
|------|-------------|-----------------|---------------------------|
| `SPECKIT_IDENTITY_MERGE_SAFETY` | keep-OFF until 039 | Phase 039 restamp | Existing graph-metadata files were written by the old merge, so the lineage-preserving re-derive has nothing in the old shape to read. |
| `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` | keep-OFF until 039 | Phase 039 restamp | Live files carry wall-clock stamps, so the no-op-skip would still mass-rewrite the tree on first save until the stamps are normalized. |
| `SPECKIT_GENERATED_METADATA_DRIFT_GATE` | keep-OFF (grandfather) until 039 | Phase 039 restamp | No legacy file carries `source_doc_hashes`, so the drift read has no freshness baseline until the tree is stamped. |
| `SPECKIT_GENERATOR_HARDENING` | keep-OFF (grandfather) until 039 | Phase 039 restamp | The `source_fingerprint` is absent from every legacy file, so the integrity rule would mass-fail the tree before a restamp. |
| `SPECKIT_GENERATED_METADATA_GRANDFATHER` | default-ON report-only, flips OFF at 039 | Phase 039 restamp | Ships ON so legacy files do not mass-fail strict, and graduates by flipping OFF to a hard error once the files are clean. |
| `SPECKIT_GENERATED_METADATA_Z_EXCLUSION` | default-ON, opt-out | none | Cannot mass-fail, so it ships ON on cost with a one-var opt-out and needs no graduation. |
| `SPECKIT_LEXICAL_GROUNDING_V1` | keep-OFF until 040, lead candidate | Phase 040 benchmark | Already part-proven. A measured pass drove the off-corpus false-confirm rate from 0.833 to 0, so it is the lead graduation candidate. |
| `SPECKIT_FALSE_CONFIRM_MAX_RATE` | report-only until 040 | Phase 040 benchmark | Reports the false-confirm rate without failing until the rate is driven to 0, then a max rate enforces the gate. |
| `SPECKIT_GROUNDING_SIGNAL_V1` | keep-OFF until 040 | Phase 040 benchmark | Dark-launch. With it off the envelope shape is byte-for-byte the shipped behavior, one env var from a flip. |
| `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1` | keep-OFF until 040 | Phase 040 benchmark | Changes the request-quality band, so it earns its flip only on a measured before-and-after. |
| `SPECKIT_CITE_WITH_CAVEAT_V1` | keep-OFF until 040 | Phase 040 benchmark | Adds a hedged citation tier, so it earns its flip only on a measured before-and-after. |
| `SPECKIT_EVIDENCE_GAP_VERDICT_V1` | keep-OFF until 040 | Phase 040 benchmark | Caps a good verdict at weak on a true Stage 4 gap, a verdict change that earns its flip only on a measured before-and-after. |
| `SPECKIT_ENVELOPE_FIDELITY_V1` | keep-OFF until 039 then 040 | Phase 039 clean grandfather report, then phase 040 | Default off keeps the response shape byte-for-byte until a clean grandfather report clears the way and the render change is measured. |

The distinction from the original keep-offs is worth stating plainly. The ten the reckoning deleted led to no measurable win once their connection to live data was wired, so they were dead code. These thirteen have not been to that gate yet. They are connected to live data by construction, their reason to be off is a migration that has not run or a benchmark that has not been taken, and their graduation is scheduled rather than hypothetical. A reader should treat each as a deferred flip with a date on it, not a someday-maybe. If phase 040 measures a behavioral switch and the number does not move, that switch inherits the same earn-or-delete fate the original ten met.
