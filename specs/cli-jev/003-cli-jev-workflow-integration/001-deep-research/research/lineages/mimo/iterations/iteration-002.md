# Iteration 2 — mimo-02: Active skill-advisor recommendations, the proof

**Lineage:** `mimo` (UX and measurement lens)
**Session:** `fanout-mimo-1790438758756-5mso8j`
**Focus Area:** `mimo-02` — Active skill-advisor recommendations, the proof
**Angle question:** Is there measurable headroom on the advisor corpus for a Jev tie-break to show a gain, and what shadow design proves it without touching the ratchet?

## Grounding opened this iteration

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-53` — full baseline capture.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs:1-60` — MRR/right@3 eval with train/held-out split.
- `.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:81-155` — shadow delta recording and its opt-in.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:1-58` — live ambiguity cluster rule.
- Digest claims used with attribution: H1 ratchet mechanics and the older top-3 ceiling capture, H2's no-baseline status, H5's "measures nothing by itself", S01 to S05 seam descriptions, the 2500 ms advisor child deadline.

## The headroom question, answered with the recorded numbers

The baseline capture (opened) records: full corpus top-1 152/195 = 0.7795, unknown 13, gold-none false fires 5 (`scorer-eval-baseline.json:14-24`); holdout top-1 53/70 = 0.7571 (`:25-29`); ambiguity slice top-1 18/24 = 0.75 at tau 0.03 (`:30-35`); buckets review 24/31, memory_save 27/32, delegation 9/9 (`:36-52`).

What a tie-break can move at most: 6 rows on the ambiguity slice (18 of 24 right), and 17 rows on the holdout in the absolute worst case where every wrong row is a near-tie. The real eligible count is UNKNOWN until top-2 margins are recorded over the corpus, and recording them is the arm's first measurement step. The current capture records no top-3 number, so the older 0.9026 top-3 ceiling (measurement digest H1, ceiling estimate on a different 72-row holdout) is the only rank headroom figure and is not a baseline.

Two populations a tie-break structurally cannot move: the 13 unknowns and the 5 gold-none false fires (`scorer-eval-baseline.json:19-24`), which are abstention behavior at S01, not ranking behavior. `score-outcome-rerank.mjs:47` also skips gold-'none' rows when loading the corpus, so the H2 script as written cannot even score an abstention arm.

One trap confirmed in code: the eval slice used tau 0.03 (`scorer-eval-baseline.json:34`) but the live ambiguity cluster admits candidates within 0.05 of the top on score OR confidence (`ambiguity.ts:7-8,28-35`). An arm gated on 0.03 measures a narrower population than the one the operator would ever see ambiguity tags on. The arm must state which population it covers.

## Per-idea records

### Idea 1: Offline `jev choice` tie-break arm over near-tie rows, scored on H1, never served

| Field | Record |
|---|---|
| **Idea** | For rows where the passing top-2 sit inside one margin of each other, ask `jev choice` over the top 2 or 3 skill ids with skill descriptions as option text (the S02 fit: a cluster is a small explicit option map, seam-map claim). Record the pick to JSONL. Never serve it. |
| **Value** | The operator's decision this could eventually change: which skill the advisor recommends when it is itself unsure. Today the operator gets a cluster tagged `ambiguousWith` (`ambiguity.ts:52-55`, opened) and picks themselves. The measured question is whether a numeric judge picks the gold skill in those clusters more often than the scorer's tie order. |
| **Seam** | Recording seam: `.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:103-133` (`recordShadowDelta` appends JSONL with rotation) or, for the offline arm, a plain JSONL beside the routing-accuracy scripts. Call seam for a later live shape: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:22-36` (cluster construction). Opened this iteration. |
| **Metric, baseline, harness** | Metric: top-1 accuracy on eligible rows (margin-eligible), reported separately for the holdout (honest arm) and the ambiguity slice (chosen by low margin, so never the headline). Baseline to beat: holdout 53/70 = 0.7571 and slice 18/24 = 0.75 (`scorer-eval-baseline.json:25-35`, opened). For a full reorder instead of a tie-break, H2's MRR and right@3 apply, whose baseline is UNKNOWN until the first baseline-arm run (measurement digest H2). Harness: H1 for accuracy, H2 for rank, H5 for any live collection. |
| **Cost, latency, privacy** | One billed `jev choice` per eligible row only. If the near-tie share of 195 rows is like the slice's 24, expect a few dozen calls per eval run; that share is UNKNOWN until counted. Offline, no deadline. Privacy: prompt text plus skill descriptions leave the machine; corpus prompts are synthetic routing prompts, low exposure. Live shape would carry real operator prompts off the machine, which is the privacy line between Idea 1 and Idea 2. |
| **Opt-in and no key** | The offline arm is a script flag on the eval, not a product surface. The live shadow shape copies the existing opt-in: `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` or `SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED` (`shadow-sink.ts:144-155`, opened: "advisor_recommend is a read-style call and must not write durable telemetry unless the operator expressed intent"). No key: the arm records `skipped: no key` rows and the scorer path is untouched, which is today's behavior. |
| **Complexity** | Roughly 100-150 lines for the offline arm script plus a results table; one new file under `scripts/routing-accuracy/`, zero changes to the scorer or the ratchet. |
| **Verdict** | **build-now** as the measurement slice: it is the only design that can produce the tie-break accuracy number without serving anything or touching the ratchet baseline (`scorer-eval-baseline.json:8-12` pins a deterministic env; a network judge must never be recaptured into it, measurement digest H1). |
| **Confidence** | Confirmed from code: baseline numbers, cluster rule, sink opt-in, gold-none skip at `score-outcome-rerank.mjs:47`. Inferred: eligible-row count and any gain. Would confirm: one run recording top-2 margins over the corpus, then the arm on those rows. |

### Idea 2: Live `SPECKIT_ADVISOR_JEV_SHADOW` shadow lane (the S04 promotion path)

| Field | Record |
|---|---|
| **Idea** | A shadow lane that runs `jev choice` beside the live scorer on real prompts, writes live-versus-shadow deltas, and never fuses into the live channel (the S04 pattern: `live: false`, own env flag, lane-registry claim, seam-map). |
| **Value** | Replaces nothing yet. It collects the disagreement rate on real prompts, which the offline corpus arm cannot show (corpus prompts are synthetic). Its value is data for the later decision, and the repo already has the flag pattern so the wiring risk is low. |
| **Seam** | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:21-27,37-38` (shadow lane registration, seam-map S04 claim, not opened this iteration) and the sink at `shadow-sink.ts:103-133` (opened). |
| **Metric, baseline, harness** | Shadow-versus-live disagreement rate, then accuracy on gold for the disagreed rows (H5 "measures nothing by itself", measurement digest H5; scoring still needs H1 or H2 gold). Baseline: none exists; H5 is a collection surface. |
| **Cost, latency, privacy** | One billed call per routed prompt on opted-in machines, inside the 2500 ms advisor child where a live call does not fit (seam-map S04: "a live Jev lane would not fit, a precomputed one might" — seam-map inference). So the lane must be async or precomputed, and its answer always arrives after the routing decision. Privacy: real operator prompts leave the machine; this is the step that needs the clearest egress announcement of any advisor idea. |
| **Opt-in and no key** | Own flag copying `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW` (seam-map S04 claim). No key: lane reports `disabledReason` like the semantic shadow lane (seam-map S04), routing unchanged. |
| **Complexity** | Roughly 150-250 lines: lane module, registration, sink wiring, tests; touches `lane-registry.ts`, a shared contract, which needs its owner and callers named first (repo-rules-digest Q8). |
| **Verdict** | **next,** after Idea 1 shows a gain on the holdout. Building it first would pay real prompt egress to collect data the offline arm can falsify cheaper. |
| **Confidence** | Inferred from the seam-map S04 description and H5; would confirm by opening `lane-registry.ts` and the semantic-shadow lane in a later iteration. |

### Idea 3: `jev noul` abstention arm for the 13 unknowns and 5 false fires

| Field | Record |
|---|---|
| **Idea** | `jev noul` "does this prompt ask for skill X" to decide fire versus abstain, aimed at the two abstention failure counts. |
| **Value** | Potentially the larger win than the tie-break: 18 rows of the corpus fail on abstention versus 43 wrong top-1s, and abstention errors are the ones the operator notices (a wrong skill recommendation or a missing one). But it is a different judgment from the tie-break and a different seam (S01 thresholds, not S02 clusters). |
| **Seam** | S01 `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:780-787` (seam-map claim, not opened this iteration). |
| **Metric, baseline, harness** | Metric: false-fire and unknown counts against the corpus gold-none rows. Baseline: 5 false fires and 13 unknowns (`scorer-eval-baseline.json:19-24`, opened). Harness: H1's corpus; note `score-outcome-rerank.mjs:47` skips gold-none rows so H2 cannot score this arm as written. |
| **Cost, latency, privacy** | One `jev noul` per candidate skill per prompt is a fan-out of calls unless batched via `jev run`; cost grows with cluster size. Offline for eval. |
| **Opt-in and no key** | Same shape as Idea 1. No key: thresholds unchanged. |
| **Complexity** | Comparable to Idea 1 offline (about 100 lines) but a live shape would touch the fusion path, a much wider blast radius. |
| **Verdict** | **next,** sequenced after the tie-break arm proves the measurement pipeline, because it reuses the same scorer-over-corpus harness with a different question. |
| **Confidence** | Confirmed: the two baseline counts and the gold-none skip. Inferred: that Jev would do better than the threshold rule; no evidence yet. |

### Idea 4: Serve Jev's pick as the cluster default before it is measured

| Field | Record |
|---|---|
| **Idea** | Let Jev order or resolve the ambiguity cluster in the live brief immediately. |
| **Value** | Removes a decision from the operator on ambiguous prompts, which is the best-case UX. But an unmeasured judge steering live routing can only be believed after an accuracy number exists, and a wrong steer is silent. |
| **Seam** | `ambiguity.ts:44-58` (`applyAmbiguity` tags, opened). |
| **Metric, baseline, harness** | Cannot be measured after serving: the moment Jev's order is served, there is no unbiased comparison. |
| **Cost, latency, privacy** | As Idea 2 plus the operator-visible misroute risk. |
| **Opt-in and no key** | Even opt-in, serving before measuring breaks the doctrine this research is bound by. |
| **Complexity** | Small code, large epistemic cost. |
| **Verdict** | **drop for now.** It is Idea 1's promotion candidate, not a first slice. |
| **Confidence** | Doctrine-level judgment from the angle contract and repo-rules-digest §5. |

## Ruled out this iteration

- Using the archived `specs/sk-doc/z_archive/019-.../routing-baseline.json` top-3 capture as a baseline: different corpus size (72-row holdout) and older capture; usable only as a ceiling estimate (measurement digest H1).
- Writing the Jev arm into `scorer-eval-baseline.json` or the ratchet: the capture pins a deterministic env (`scorer-eval-baseline.json:8-12`, opened); a network judge would poison the ratchet.
- Running `score-outcome-rerank.mjs` now: it imports built `dist` (`score-outcome-rerank.mjs:35-38`, opened) and running repo tooling is out of scope inside a lineage; the top-2 margin count waits for the build phase.

## Hand-off

- The arm design to carry forward: eligibility by the live cluster rule (0.05 score-or-confidence union, `ambiguity.ts:28-35`), report the 0.03-slice separately (`scorer-eval-baseline.json:34`), holdout is the headline arm, never the slice.
- The headroom measurement no one has recorded: the count of corpus rows whose passing top-2 are within one margin. Everything about "can a tie-break show a gain" is UNKNOWN until that count exists; mimo-08's proof plan should make it check 1.
- When Jev and the scorer disagree, the operator sees nothing during measurement (JSONL only); the only post-measurement surface that passes the UX test is a suggested order inside the existing `ambiguousWith` cluster with the cluster still shown.
- The abstention population (13 unknowns, 5 false fires) is a separate arm with a shared harness; whoever ranks build order should note it may be the bigger win and the H2 script cannot score it (`score-outcome-rerank.mjs:47`).
