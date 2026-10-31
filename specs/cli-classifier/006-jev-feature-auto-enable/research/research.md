---
title: "Research: proving or retiring the three unproven Jev features"
description: "Merged synthesis of two five-iteration lineages, GPT-6 Luna max on cli-pi and DeepSeek V4.1 Flash max on cli-devin, on spec-track narrowing, routing clarify default and alignment folder suggestion. None earns a live path today, none is cleanly killed, and each gets one ranked next step."
importance_tier: important
contextType: research
---

# Research: proving or retiring the three unproven Jev features

## 1. Executive Summary

None of the three features earns a live, auto-on path today, and none is retired by a clean kill. Both lineages reached that verdict on their own, from the same recorded runs, and their numbers agree.

- **Spec-track narrowing (017) is inconclusive.** The first run kept, the repeat stopped on margin and its interval spans zero. The next step is a pre-registered, powered holdout of real Gate 1 requests.
- **Routing clarify default (020) has more kill evidence than win evidence.** The router now clarifies 3 of 365 committed prompts, and always-none beats Jev on the old fixture. The next step is measuring the real clarify rate and logging user picks in shadow.
- **Alignment folder suggestion (022) is anchored on session state.** A control that swaps in the next row's state flips the keep to a kill. The next step is one masked-state ablation that either retires the question or earns a real corpus.

The orchestrator reran two load-bearing numbers from the final tree: the clarify census prints `total prompts=365 clarify=3 clarify_mode=2 clarify_checklist=1`, and the recorded 022 run prints `negative control distractor-state: W+L=30 interval95=[0.000,0.114]`.

## 2. Methodology

The deep-research fan-out ran two independent lineages of five iterations each under a max-iterations stop policy:

- **Luna:** `gpt-6-luna` at max effort on cli-pi with the `openai` provider. Its first attempt asked for approval to run inline and wrote nothing, so the orchestrator stopped it and reran it alone with the inline authority stated in the topic. The second run completed all five iterations. Its closing turn hit the ChatGPT subscription usage limit after `research.md` was written.
- **DeepSeek:** `deepseek-v4-1-flash-max` on cli-devin, five iterations on the first attempt.

Both lineages read repository sources and pinned run outputs only. Neither made a Jev call or changed code. `fanout-merge.cjs` merged 58 key findings into `findings-registry.json`, and `reduce-state.cjs --emit-resource-map --fanout-resource-map-only` wrote `resource-map.md` from 10 delta files. Per-lineage syntheses stay in `lineages/*/research.md`.

## 3. Ranked Findings

1. **P0. Keep all three out of the shared gate and unserved.** `jev-features.mjs` registers only the four proven features. A scorer keep is not deployment authorization (`.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:38-55`).
2. **P0. The 017 keep did not repeat.** The 270-row repeat printed `stop (margin) A=106 B=82` with an accuracy-delta interval of [-0.1185, 0.2760]. That is inconclusive, not a kill (`lineages/deepseek-v4-1-flash-max/iterations/iteration-002.md`).
3. **P0. 017 is underpowered.** At the observed 0.588 decided-pair win rate, 80% power needs about 217 decided pairs, near 431 rows. The repeat had 0.399 power at its own effect. These are the lineages' exact-binomial computations.
4. **P0. The 020 fixture keep is historical.** Replay against the current router refuses 42 of 54 rows, leaving 12 labeled rows under the 30-row gate. Always-none scores 34 of 54 against Jev's 28 (`.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:637-695`).
5. **P0. 020's base rate caps its value.** The committed census holds 2 mode clarifications in 365 prompts, so a powered run needs shadow-collected real clarifications, not more fixture calls.
6. **P0. 022's keep is state-anchored.** With each row's state rotated to the next row's, all 30 discordant picks follow the folder named in the rotated state (`~/.skilled/.labels/runs/049-008-jev.stdout.txt:52-56`).
7. **P0. One proof-or-retire standard covers all three.** It needs a real eligible population, independent labels, pre-registration, adequate power, feature-specific controls with fail-open consumer tests, and staged shadow-then-canary authorization. None meets it today.
8. **P1. The three keep rules diverge.** Track narrowing lacks the kill branch the other two carry, and no rule has absolute or per-class floors or requires beating the strongest simple policy. All three scorers share `scorer-report.mjs`, so one kit change plus three rule lines aligns them.
9. **P1. 020 cannot serve a suggestion on the current contract.** The routing engine computes `decision.clarify.alternatives`, but the normalized route drops them. A suggestion needs a routing-owner contract extension.
10. **P1. Any future consumer goes through `featureReady` with consumer-level tests.** Off, missing auth, error, timeout and malformed answers must leave the pre-Jev output unchanged (`.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:171-185`).

## 4. Per-Feature Detail

### Spec-track narrowing (017)

The first live run kept at 97 of 256 against ripgrep's 68. The repeat on 270 rows stopped on margin at 106 against 82 (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:816-894`). Paraphrase probes favor ripgrep 9 of 14 against Jev's 2 of 14, and 55 rows abstained. A win needs real, consented, time-separated Gate 1 requests with independent labels, plus absolute and per-track floors declared before the holdout opens. A kill would be a powered run whose upper bound stays under the margin.

### Routing clarify default (020)

Twelve of the fixture's 17 wins are abstentions on none rows, so the keep measured abstention, not mode choice. A win needs real clarifications with the user's pick as the label, a bar against the strongest simple policy, separate named-mode and abstention metrics, and the alternatives contract. At the committed rate, 69 discordant pairs at a 0.65 win rate would take about 32,000 prompts, which is a corpus-bound planning estimate.

### Alignment folder suggestion (022)

The primary arm keeps at 39 of 40 against 30. The confidence-gated arm keeps the same counts with 70 calls instead of 120, which is a cost result, not a validity fix. The scorer picks its comparator from the labeled rows, so any holdout must freeze the comparator first (`.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:1631-1638`). A masked-state run that still kills retires this question shape.

## 5. Where the Lineages Differed

They differed on emphasis, never on a verdict. DeepSeek ranked the 022 ablation P1 and the 017 holdout P0. Luna ranked the 022 ablation P0 because it is the cheapest experiment that can settle a feature. This synthesis follows Luna: the ablation reuses frozen rows and decides 022 either way, while the 017 holdout needs labels nobody has collected. Luna also kept the 2-in-359 and 3-in-365 census figures apart as a changed denominator, which the orchestrator's rerun confirms.

## 6. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Wire any of the three now | No feature meets the proof standard | Both syntheses | 1, 5 |
| Read the 017 repeat as a kill | Interval spans zero, power 0.399 at its own effect | 049 repeat record | 2 |
| Adopt probability-aware aggregation for 017 | Lost 4 rows on the repeat corpus | 049 repeat record | 2 |
| Soften 017's `none` rule | No abstained row chose the gold track in any order | Luna iteration 2 dead end | 2 |
| Score the 020 fixture as it stands | 42 of 54 rows no longer clarify | Replay refusal | 3 |
| Serve a 020 suggestion on the current contract | The normalized route drops the alternatives | Routing engine read | 3 |
| Read the 022 keep as production superiority | The distractor control flips it to a kill | `049-008-jev.stdout.txt:52-56` | 4 |
| Chase row f022-001 with description edits | It loses with both options described | DeepSeek iteration 4 | 4 |

## Divergence Map

- **Saturated directions:** the gate contract and the four proven call shapes, the fixture-bound nature of all three keeps and the base-rate economics.
- **Pivots taken:** neither lineage ran a divergent pivot. Zero completed, zero failed, zero overrides.
- **Remaining frontier:** real-request labels for 017, the real clarify rate and shadow picks for 020, the masked-state ablation for 022.

## 7. Open Questions

1. Which absolute and per-track floors would the operator accept for 017?
2. Can shadow logging collect enough real mode clarifications per hub to measure 020 at all?
3. Which routing owner would approve an additive alternatives contract for 020?
4. Does a masked-state 022 run survive the distractor control?
5. How often does a real save's final folder sit inside 022's candidate set?

## 8. Recommended Follow-Up

1. **P0. 022 masked-state ablation.** Same frozen rows, options, labels and scorer, with folder names masked from the session state. A kill retires the question shape. A pass only earns real-save corpus design.
2. **P0. Align the keep-rule family in `scorer-report.mjs`.** Add the kill branch to 017, absolute and per-class floors to all three, the strongest-simple-policy bar and a pre-registered power line. These are rule amendments, decided before any new run.
3. **P1. 020 real-rate census and shadow picks.** Run the census over real transcripts and log accepted or overridden choices before any model call or contract change.
4. **P1. 017 powered holdout.** Pre-register floors and power, then collect about 431 real Gate 1 rows at the current decided rate.
5. **P1. Shadow first for any candidate that clears its gate.** Add it through `featureReady` with consumer-level fail-open tests before any canary.

## 9. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10 (5 per lineage, all complete)
- Questions answered: 5 / 5 per lineage
- Remaining questions: none of the configured five. Five bounded follow-ups are listed in section 7
- Last 3 iteration summaries: Luna 3 clarify default (0.5), Luna 4 alignment suggestion (0.5), Luna 5 cross-feature standard (0.5)
- Average newInfoRatio: Luna 0.525, DeepSeek 0.84
- Divergence summary: no divergent pivots recorded

## 10. References

- Lineage syntheses: `lineages/luna-6-max-fast-pi/research.md`, `lineages/deepseek-v4-1-flash-max/research.md`
- Merged registry and attribution: `findings-registry.json`, `fanout-attribution.md`
- Resource map: `specs/cli-jev/006-jev-feature-auto-enable/research/resource-map.md`
- Scorers: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`
- Shared gate and kit: `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs`, `.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs`
- Prior packets: `specs/cli-jev/003-cli-jev-workflow-integration/` children 017, 020, 022, 047, 048 and 049
