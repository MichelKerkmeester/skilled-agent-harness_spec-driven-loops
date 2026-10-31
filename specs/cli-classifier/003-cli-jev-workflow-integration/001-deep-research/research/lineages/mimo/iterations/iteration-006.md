# Iteration 6 — mimo-06: Validation triage, routing clarify and defer, operator friction

**Lineage:** `mimo` (UX and measurement lens) — wave 2
**Session:** `fanout-mimo-1790438758756-5mso8j`
**Focus Area:** `mimo-06` — Validation triage, routing clarify and defer, operator friction
**Angle question:** At which of these seams does the operator currently answer a question or read a warning that a Jev suggestion could pre-answer, and is there enough gold to prove it?

## Sibling check (wave 2)

Both siblings reached their cap (deepseek at 10, read in iteration 5; grok at 10, read in iteration 4) so no newer files can appear. Deepseek-09's failure table already covers the completion sentinel's wiring ("offline only", its citation), so I take that as settled and answer the UX and gold questions it did not.

## Grounding opened this iteration

- All seven `canary-cases.v1.json` files under `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/fixtures/`: schema (`expectedAction`, `expectedModes`, `gold.expectedIntents`) and an expectation census by my own grep.
- `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:55-115` — claim pattern, budget, kill switch, advisory statuses.
- `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:505-520` — the below-threshold warning and alternatives path.
- Digest claims used with attribution: H3 (Gate 3 F1 0.9843 and its corpus), H7 (admission semantics), H8 (playbook runs), S06/S07 contract descriptions, S24/S25 seam descriptions.

## The gold census, by my own counts

Clarify and defer gold is as thin as H7 claimed, now confirmed by this iteration's grep over the canary fixtures: `expectedAction` counts are 62 `route`, 10 `defer`, 9 `reject`, and `clarify` appears in exactly three hub fixture files (002-system-deep-loop, 004-cli-external-orchestration, 007-sk-doc). So the total clarify-plus-defer gold is 13 rows across seven hubs. The cli-jev fixture has 7 cases, all `route` or zero-signal `defer` per H7. Any "Jev pre-answers the clarify" claim measured on 3 rows is noise.

The one seam with real gold is Gate 3: H3's corpus carries 195 prompts labeled for write intent, F1 already 0.9843 with at most 4 errors on it (measurement digest H3). That is a measurement bed and a negative control, not a product: the Gate 3 question the operator answers is a documentation-placement policy decision whose answer holds the whole session (root framework Gate 3), and pre-answering it would hand a model an operator decision.

The completion sentinel's own log is partial gold: advisories are recorded to `.skilled/logs/completion-sentinel-advisories.log` with dedup and 30-day retention (`completion-evidence-sentinel.cjs:78-79,97`), so fired advisories are labeled history but non-fires are not. And the claim regex includes `occurred` and `happened` (`:64`), the exact generic words S09's Jev fit targets.

One budget fact that settles shapes: the sentinel's check timeout is 1200 ms, "kept well under the NFR-P01 bound (<1.5s)" (`:90-94`, opened). No Jev call fits live in this hook at any confidence; every completion-sentinel arm is offline or async, matching deepseek-09's failure-table row.

## Per-idea records

### Idea 1: Done gate as an offline Jev arm over completion claims (picking up iteration 1's Idea 4)

| Field | Record |
|---|---|
| **Idea** | `jev noul` "does this turn claim the task is complete and back it with evidence" run offline over logged advisory turns plus labeled turns, measuring the regex's false-fire rate on words like `occurred` and `happened` (`completion-evidence-sentinel.cjs:64`). |
| **Value** | The friction this seam creates is real and named: the operator reads an advisory (advise statuses `EVIDENCE_MISSING`, `AC_UNMET` and three more, `:101-107`) on a turn that was not actually claiming completion. Pre-answering "is this even a claim" would suppress noise advisories, which removes a warning to read rather than adding one. |
| **Seam** | `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:64,70` (claim pattern and 400-char anchor tail; the pattern is duplicated byte-identically into the runtime hook per `:60-63`). Opened this iteration. |
| **Metric, baseline, harness** | Metric: false-fire rate and missed-claim rate of the regex versus a Jev `noul` on the same labeled turns. Baseline: UNKNOWN, the sentinel records no accuracy numbers; its log gives the fired set only. Gold: a labeled turn set, and this iteration answers the carried question from iteration 3: one 30 to 50 excerpt set can label both the goal verifier (met, not-met, unclear) and this seam (claims completion with evidence, claims without, does not claim), because the classes are the same turns read two ways. That halves the labeling cost named in mimo-03. |
| **Cost, latency, privacy** | Offline replay: one billed call per labeled turn. A live shape is impossible in the 1200 ms check (`:94`), so no product build can add per-turn cost here. |
| **Opt-in and no key** | The replay is a script. A future product shape would sit behind `SYSTEM_COMPLETION_SENTINEL_DISABLED`-style kill switches (`:84`) and stay advisory exactly like the sentinel ("Advisory only, never blocks", seam-map S09). No key: the regex, today's behavior. |
| **Complexity** | The replay is roughly 100 lines over the log plus the labeled set. A product shape is deferred by the budget, not by cost. |
| **Verdict** | **next,** and its first slice is the shared labeled set from mimo-03, not code. |
| **Confidence** | Confirmed from code: the pattern's generic words, the 1200 ms budget, the advisory statuses. Inferred: false-fire frequency; the advisory log's own contents would confirm it without any Jev call. |

### Idea 2: Suggested default on compiled-routing `clarify`

| Field | Record |
|---|---|
| **Idea** | When the front door returns `clarify` with 2 to 4 alternatives (decision-contract shape, S06 claim), a `jev choice` suggests one as a default the operator can accept. |
| **Value** | This is the purest "removes a decision" surface in this wave: the operator is literally asked a question at the front door. But it is asked how often? UNKNOWN: no clarify-rate telemetry was found in this iteration's reads, and the gold for correctness is 3 rows. |
| **Seam** | S06 `.../004-cli-external-orchestration/lib/router.cjs:198-216` (seam-map claim, not opened this iteration). |
| **Metric, baseline, harness** | Metric: top-1 accuracy of the Jev suggestion against gold `expectedModes`. Baseline: the clarify rows exist to test the engine's clarify trigger, not to rank alternatives, so even the baseline is unmeasured. Gold: 3 rows (this iteration's count). H7's own conclusion stands: too few to show a gain. |
| **Cost, latency, privacy** | One call per clarify event in the interactive path; the front door is synchronous but has no hook deadline (seam-map S06), though the operator is waiting on the answer, so latency is felt directly. Prompts leave the machine at the moment the operator is mid-decision. |
| **Opt-in and no key** | No key: `clarify` as today. |
| **Complexity** | Small on the surface, but it touches the compiled-routing decision contract, one of the most frozen seams in the repo (Q8's named-owner check applies). |
| **Verdict** | **later,** and its first slice is a gold build: extend the clarify canaries to 30+ rows across hubs before any arm is scored. A suggestion served before that measurement is exactly the pre-measure serving this research forbids. |
| **Confidence** | Confirmed: gold counts. Inferred: clarify reach frequency; what would confirm: one week of `SPECKIT_COMPILED_ROUTING_DEBUG` breadcrumb counts. |

### Idea 3: `defer` shadow recording

| Field | Record |
|---|---|
| **Idea** | Record a `jev choice` over registered modes plus an `other` key beside each `defer`, never served (S07 shape). |
| **Value** | Data for a future routing decision; the operator sees nothing today and nothing after. A defer already falls back to legacy prose routing, which is the current experience, so the recording changes no decision anyone makes. |
| **Seam** | S07 `.../004-cli-external-orchestration/lib/router.cjs:164-169` (seam-map claim). |
| **Metric, baseline, harness** | Disagreement rate with the legacy fallback's eventual route; gold 10 rows. |
| **Cost, latency, privacy** | One billed call per defer; real prompt text leaves the machine. |
| **Opt-in and no key** | Same opt-in shape as the advisor shadow sink (mimo-02). |
| **Complexity** | Moderate; touches the routing path's logging only. |
| **Verdict** | **later.** It is a collection surface with a thin corpus and no decision attached; both Idea 2's gold build and the advisor arm come first. |
| **Confidence** | Confirmed gold count; inferred value. |

### Idea 4: Jev write-intent arm on Gate 3 (as a product)

| Field | Record |
|---|---|
| **Idea** | `jev noul` "will this request write a file" replacing or augmenting the Gate 3 classifier. |
| **Value** | The Gate 3 question reaches the operator at the start of every write task, so the seam has the highest reach of any in this iteration. But the classifier already scores F1 0.9843 (H3), meaning at most 4 errors in 195, and the question it guards is a policy decision the operator owns for the session. A Jev arm has almost nothing to fix and would make an operator decision model-shaped. |
| **Seam** | S10 `gate-3-classifier.ts:799-859` (seam-map claim). |
| **Metric, baseline, harness** | F1 against the 195-row corpus (H3). Baseline 0.9843. |
| **Cost, latency, privacy** | Per-prompt calls on the hot path; the 3 s hook cannot take a Jev call anyway (seam-map S10 deadline 3 s). |
| **Opt-in and no key** | N/A. |
| **Complexity** | N/A. |
| **Verdict** | **drop as product.** Little headroom, wrong layer, and the corpus's real use is as a negative control: if a Jev arm cannot even tie a regex on 195 labeled rows, that is evidence about the judge on classification questions generally (H3's own reading). |
| **Confidence** | Confirmed baseline from H3's recorded numbers (digest attribution). |

### Idea 5: `jev choice` over spec-folder alignment alternatives (S23)

| Field | Record |
|---|---|
| **Idea** | When the save's topic-overlap score falls under 50 and the validator lists alternatives (`alignment-validator.ts:513-520`, opened), suggest one. |
| **Value** | Removes a pick, rarely: the operator only meets this seam on a misaligned save. |
| **Seam** | `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:505-520`. Opened this iteration. |
| **Metric, baseline, harness** | Accuracy of the suggestion against the folder the operator actually picked; gold: zero recorded rows (the validator records no outcome history in this iteration's reads). |
| **Cost, latency, privacy** | One call per misaligned save; conversation topic summary leaves the machine. |
| **Opt-in and no key** | No key: the alternatives list as today. |
| **Complexity** | Small; the save CLI is a named-contract surface. |
| **Verdict** | **later,** behind the same gold-build class as Idea 2. |
| **Confidence** | Inferred frequency; UNKNOWN live rate. |

### Idea 6: Save-flow signals (S24 level flags, S25 retrievability score)

| Field | Record |
|---|---|
| **Idea** | `jev noul` per risk flag at level recommendation (S24), and a `jev score` on title retrievability beside the save-quality density gate (S25). |
| **Value** | Both add a signal to surfaces the operator already resolves fine: `recommend-level.sh` takes four explicit flags whose answers the caller knows, and S25's HIGH issues are already patched by hand. Neither removes a decision; both add a number to check. |
| **Seam** | S24 `recommend-level.sh:19-22` and S25 `save-workflow.md:577-598` (seam-map claims). |
| **Metric, baseline, harness** | No gold rows for either; S25's gate is calibrated at 0.4 signal density (seam-map S25) and changing its calibration needs the save-quality history first. |
| **Cost, latency, privacy** | Small but per-save; title and metadata leave the machine. |
| **Opt-in and no key** | Trivially gated. |
| **Complexity** | Small and not worth it. |
| **Verdict** | **drop,** on the repo's own hardcode-by-default rule (repo-rules-digest §2 item 11): the four flags are a working explicit contract, and a second signal on S25 is a knob nobody asked for. |
| **Confidence** | Judgment from the UX doctrine; would change if a recorded incident showed a wrong level choice or an unretrievable save costing real rework. |

## Ruled out this iteration

- Using playbook run reports (H8) as gold for any of these seams: they record PASS/FAIL/SKIP per scenario with no quality score (measurement digest "Playbooks in general"), so they cannot score a suggestion's accuracy.
- A live Jev arm on any hook in this wave: the fastest one here, the sentinel check, budgets 1200 ms (opened); the others are 3 to 5 s hooks (seam-map). Offline or nothing.

## Hand-off

- Friction ranked by reach, with honest reach confidence: (1) the Gate 3 question, every write task, but policy-owned and already 0.9843 F1 so drop as product; (2) completion advisories, every claimed completion with missing evidence, false-fire words confirmed in code; (3) clarify, frequency UNKNOWN, needs a breadcrumb count before it is ranked further; (4) defer, silent fallback, collection only; (5) S23 misaligned saves, rare; (6) save-flow flags, drop.
- Too few gold rows to measure today: clarify (3 rows), defer (10 rows), S23 (0), S24 (0), S26 (0 scored). The 195-row Gate 3 corpus is the only real gold among these seams and belongs in the measurement program as a negative control.
- The carried question from iteration 3 is answered: one 30 to 50 excerpt labeled set serves both the goal verifier and the done gate, because met/not-met/unclear and claims-completion/does-not-claim are the same turns read two ways. mimo-08 should build the proof plan around that single set.
- For mimo-07 and mimo-08: the only wave-2 seam with a real operator decision and a plausible path to gold is the done gate (Idea 1); clarify is the biggest UX prize but sits behind a gold build and a reach measurement.
