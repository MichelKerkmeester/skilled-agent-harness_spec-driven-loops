# Packet 028 Feature Flags: The Five Switches That Survived

> Packet 028 added a lot of new search and memory behavior behind environment-variable switches, and almost every switch was meant to ship in the OFF position until a real before-and-after benchmark earned it a flip. The flag-resolution reckoning closed that experiment. Every default-off switch was reopened, simulated under a fair real-world load and given a final keep-or-delete decision per flag. Five switches earned default-ON and stayed. Ten did not earn their keep and their code was removed from the tree. This document explains the five that survived: what each feature is, what turning it ON changes and why it earned its place. The ten that were deleted are listed at the end so a reader who remembers them knows where they went.

---

## THE BIG IDEA

028 shipped its new machinery for correctness and safety first, then asked each switch to prove it was worth turning on. The bar was deliberate. A switch that only changed output without improving a real metric did not earn a default-ON flip, and a switch that did nothing measurable for live recall did not earn a place in the tree at all. The reckoning measured each one under a real-world simulation rather than a synthetic harness, then made a final per-flag decision. Five switches cleared the bar and ship default-ON. The other ten were deleted along with their code, so the tree no longer carries dead switches that a future reader has to reason about.

The five survivors split by the kind of evidence that earned them. Two are unqualified wins where a real metric moved in the right direction. Two are no-harm guarantees where the switch adds protection or grounding without dropping a real result. One is an additive graph lane that recovers extra recall by reserving a slot rather than displacing a baseline row. Each survivor routes through the shared `isFeatureEnabled` resolver, so the environment override still works and a user can force any of them off with `SPECKIT_<FLAG>=false`.

A note on phases. Packet 028 is split into phase folders. Phase `001-speckit-memory` is the memory and search engine. Phase `002-code-graph` is the code structure index. Phase `003-skill-advisor` is the skill recommender. Phase `004-deep-loop` is the multi-agent loop runtime. Four of the five surviving switches live in `001-speckit-memory`. The fifth, the confidence-calibration switch, rides a pre-028 switch (027/017) whose promotion was decided during 028.

---

## 1. THE FIVE DEFAULT-ON SWITCHES

| env var | default | what it does (plain English) | why it earned the flip | 028 phase |
| --- | --- | --- | --- | --- |
| `SPECKIT_DERIVED_ID_PROVENANCE` | ON (`true`) | Gives every auto-generated link a stable id computed from its own content, so the same generated link always gets the same id and is traceable. | Unqualified correctness win. Content-addressed identity passed every check: stable ids 50 of 50, reproducible on replay 3 of 3, near-duplicates kept distinct 50 of 50, zero collisions. | 001 |
| `SPECKIT_CONFIDENCE_CALIBRATION` | ON (`true`) | Fine-tunes a recall confidence score through a fitted isotonic model so the number it reports means what a reader thinks it means. | Unqualified win. Held-out ECE moved from 0.184 to 0.023 across all folds with a shipped isotonic model, and a label-decoupling fix removed the earlier overfit where the model was fitted and evaluated on the same set. | pre-028 (027/017), promoted during 028 |
| `SPECKIT_RETENTION_FORGETTING_V1` | ON (`true`) | Adds conservative guardrails so forgetting only ever drops genuinely spare items and never drops something that other live memories still point to. | Safety and no-harm guarantee, not a precision win. It spares 386 keep-set rows the OFF path would delete with a dropRecall delta of 0. The keep-versus-drop labels are circular because they derive from the reducer's own thresholds, so it earns the flip as a guardrail rather than a measured precision gain. | 001 |
| `SPECKIT_WORLD_SUMMARY_PRELUDE` | ON (`true`) | Adds a coarse-to-fine warm-up step. Before the detailed search runs it reads a high-level summary of the whole memory to get its bearings, then appends that grounding to the results. | No-displacement grounding aid, not a recall-quality win. In append placement it recovers 11 targets with 0 regressions by construction because it never displaces a baseline row. Its apparent gain is partly a self-recall and an append-by-construction artifact, so it earns the flip as a grounding aid. | 001 |
| `SPECKIT_TEMPORAL_EDGES` | ON (`true`) | Adds a time-aware graph lane that reserves its own additive slot rather than competing for an existing one, so edge-hop targets get an extra path to recall. | Additive graph-lane mitigation. Re-measured on a live-DB copy the edge-hop recall is +0.083 with the flag ON versus OFF, so turning it OFF removes the mitigation and makes recall worse. | 001 |

---

## 2. HOW TO TURN ONE OFF

These five switches ship ON. Each is read from the environment through the shared resolver, so a user can force any of them off and restart so the server picks it up. For example:

```bash
export SPECKIT_TEMPORAL_EDGES=false
# then restart the MCP server, or start a fresh session
```

The accepted "off" values are `false`, `0`, `no`, `off` and `disabled`. The accepted "on" values are `true`, `1`, `yes`, `on` and `enabled`, and these are the defaults for all five. A coupling note applies to the calibration pair. `SPECKIT_CONFIDENCE_CALIBRATION` was fitted on the value distribution that `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION` (also default-ON) produces, so the two are coupled by construction. Turning the absolute lever off while the calibration lever stays on feeds the model an input it never saw and silently mis-calibrates. Keep the pair in its shipped state unless you understand the coupling.

---

## 3. WHY ONLY FIVE

The whole point of the reckoning was to stop carrying machinery the system never uses. A switch that adds a knob is only worth keeping when flipping it improves a real metric or guarantees no harm. The five above clear that bar. Two move a real number in the right direction, two add protection or grounding without dropping a real result, and one recovers extra recall through an additive slot. Everything else was measured under a fair real-world simulation, found not worthwhile and removed from the tree along with its code, so the surviving surface is exactly the set of switches a reader can trust.

---

## 4. THE TEN DELETED SWITCHES (FOR THE RECORD)

The reckoning deleted ten default-off switches and their code after a fair real-world simulation showed each one was not worthwhile. They are listed here so a reader who remembers them knows they were resolved and removed, not silently left off. The per-flag deciding evidence lives in [`benchmark-status.md`](./benchmark-status.md) and [`007-kept-off-flag-resolution/`](./007-kept-off-flag-resolution/).

| deleted flag | one-line deciding evidence | 028 phase |
| --- | --- | --- |
| `SPECKIT_PROCEDURAL_RELIABILITY_RECALL` (with `SPECKIT_PROCEDURAL_OUTCOME_EMITTER`) | Shadow-only with an empty outcome ledger and an eval rankDelta of 0, the multiplier moves only synthetic near-ties. | 001 |
| `SPECKIT_SUMMARY_FUSION_LANE` | Displacement-only, Recall@20 delta -0.036, the lane only pushes a real channel hit out of the result list. | 001 |
| `SPECKIT_CARDINALITY_PENALTY` | Recall@20 movement 0.0000, the degree-lane cap is too small to be decisive at K=20. | 001 |
| `SPECKIT_SLEEPTIME_CONSOLIDATION` | Net -1.67pp, the dedup pass hurts recall rather than helping it. | 001 |
| `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` | Negative on the real forward-CALLS graph, the uniform edges make PPR equal to the prior ranking. | 002 |
| `SPECKIT_SEMANTIC_EDGE_LAYER` (the edge family: `SPECKIT_EDGE_VECTOR_INDEX`, `SPECKIT_EDGE_TRIPLET_SEARCH`, `SPECKIT_EDGE_SEMANTIC_DEDUP`, `SPECKIT_EDGE_SEMANTIC_INVALIDATION`) | The fact-text is generic relation-template boilerplate carrying no pair identity, recall-inert at K=20 with a single-item +0.083 that does not generalize. | 001 |
| `SPECKIT_ADVISOR_OUTCOME_WEIGHTED_RERANK` | MRR within noise on an empty ledger, every skill resolves to neutral so the order never moves. | 003 |
| `SPECKIT_BITEMPORAL_RECALL` | Zero callers, no point-in-time consumer reads the validity window. | 001 |
| `SPECKIT_EDGE_PRESENCE_CURRENTNESS` | A correct integrity reconciliation pass that repairs 0 on the live graph, not a recall lever. | 001 |
| `SPECKIT_AGENTIC_RECALL` | Oracle ceiling +0.344 but the live reasoner nets zero with regressions at 51s per query and has no production consumer. | 001 |

The path-and-value knobs that only existed to serve a deleted feature were removed with it. The retrieval-class routing flag and the calibration and parser value knobs that serve surviving or always-on behavior remain, documented in `mcp_server/ENV_REFERENCE.md`.

---

## 5. THE TRACK B BUILT-BUT-HELD SWITCHES

The deleted ten taught the campaign why a lever fails to move live recall, and those teachings drove a research pass that found four new candidates. One of the four was a measurability tool rather than a switch. eval-v2 was built and kept as standing infrastructure: it adds three non-self-recall classes so a feature cannot win by recalling the query back to itself (`thematic_multi_target`, `causal_chain` and `hard_negative`), a completeRecall@K metric at K of 3, 5 and 8 that scores whether the full target set is recovered, and a dual-mode eval-vs-prod fidelity measurement. The headline it exposed is the eval-saturation that had hidden the deleted features: eval-mode completeRecall@8 is 0.212 against prod-mode 0.036, a +0.176 fidelity gap. eval-v2 is not a flag and ships as kept infrastructure regardless of any feature decision.

The other three candidates were built default-off, benchmarked in prod mode and held by a fresh-Opus gate. None flips on prod-mode evidence. They stay in the tree as honest shadows with a measured reason and a next step each, routed through the shared `isFeatureEnabled` resolver like every other switch.

| env var | default | what it does (plain English) | why it is held (prod-mode evidence) | next step | 028 phase |
| --- | --- | --- | --- | --- | --- |
| `SPECKIT_DETERMINISTIC_MULTIHOP` | OFF (`false`) | Appends a second-hop set of related memories to the result so an edge-hop target gets a recall path. | Prod completeRecall delta 0.000. The appended hop-2 docs land at the tail and prod confidence-truncation cuts them, so the multi-hop content never reaches the prod result window. | A scoped truncation-exemption probe on the causal_chain class with displacement accounting. It earns the flip on that class or proves tail-recall structurally doomed at prod K. | 001 |
| `SPECKIT_LANE_CHAMPION_BACKFILL` | OFF (`false`) | Reserves a backfill slot for the top hit of each retrieval lane so no lane is shut out of the result set. | 0.000 delta, structurally redundant with RRF which already absorbs every lane champion. Reserving a slot duplicates work the fuser already does. | Retire the investment. It has no path to a flip and is redundant with the fuser. | 001 |
| `SPECKIT_TRUE_CITATION_EMITTER` | OFF (`false`) | Emits a clean default-off shadow that produces the corpus's missing negative-citation labels for evaluation. | The shadow is clean and produces the missing negatives, but its positive label depends on the assistant literally echoing the memory id, so positives are under-counted and the measured signal cannot credit it yet. | Fix the positive label with content-attribution, then run a one-shot offline mining pass before any collection decision. | 001 |

The full method, the per-feature prod-mode numbers and the append-not-displace truncation finding live in [`008-new-feature-research-build/`](./008-new-feature-research-build/).
