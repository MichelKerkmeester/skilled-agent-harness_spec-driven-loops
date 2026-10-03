---
title: "Deep Research: Improving the Jev Routing Clarify Default (feature 020)"
description: "Merged two-lineage research on why the Jev routing clarify default measured keep, how to raise its accuracy and lower its cost, how to make the measurement trustworthy, where else the judgment pays off, and what default-on would need."
trigger_phrases:
  - "jev clarify default improvement"
  - "score-clarify-default research"
  - "routing clarify none_of_these"
importance_tier: "important"
contextType: "research"
---
# Deep Research: Improving the Jev Routing Clarify Default (feature 020)

Two lineages researched the same five questions independently: DeepSeek V4.1 Flash at max thinking through cli-pi (5 iterations) and GPT-6 Luna at max reasoning on the fast tier through cli-codex (3 iterations). This report merges them. Figures marked **[session-verified]** were recomputed by the orchestrating session from the recorded call log, the labeled rows and a replay through the shipped compiled routers. Everything else is a lineage claim with its cited source.

## Table of Contents

1. Research Metadata
2. Request Summary
3. What Drove the Result
4. Raising Accuracy and Lowering Cost
5. Making the Measurement More Trustworthy
6. Other .skilled Judgment Opportunities
7. Default-On Integration: Requirements, Cost, and Risk
8. Ranked Recommendations
9. Confirmed, Inferred, and Unknown
10. Eliminated Alternatives
11. Divergence Map
12. Open Questions
13. Lineage Agreement and Disagreement
14. Evidence Ledger
15. Method and Evidence Limits
16. References
17. Convergence Report

---

## 1. Research Metadata

- **Feature**: 020 routing clarify default, measured `keep`
- **Measured row**: `verdict jev: keep K=54 M=54 A=28 B=15 W=17 L=4 F=10 p=0.003599`, run `~/.skilled/.labels/runs/047-020-jev-20261002`
- **Corpus**: 54 authored tie prompts across five hubs (sk-doc 13, mcp-tooling 12, cli-external-orchestration 11, sk-design 11, sk-code 7) **[session-verified]**, 34 labeled `none_of_these` and 20 labeled with a mode
- **Lineages**: `deepseek` 5 of 5 iterations, `luna` 3 of 3, both `maxIterationsReached`
- **Date**: 2026-10-03

## 2. Request Summary

Answer five questions with `file:line` evidence: what drove the result, how to raise accuracy or lower cost, how to make the measurement more trustworthy, where else in `.skilled` the same judgment would pay off, and what a default-on integration would need, cost and risk. The feature suggests which mode to take when a compiled hub router answers `clarify` between mode alternatives, or says none of them fits. Research only.

## 3. What Drove the Result

**The keep is mostly abstention, not mode choice.** Jev's modal pick matched 12 of the 34 `none_of_these` rows, where the first-alternative baseline can never score. On the 20 named-mode rows Jev matched 16 and the baseline 15 **[session-verified]**. So 12 of the 17 wins are abstention wins, and the net lift in naming a mode is one row. All four losses (f020-008, 010, 029, 050) are named-mode rows. DeepSeek reads them as one shape: a surface named in the prompt (OpenCode, Webflow, README) draws the surface mode while the label follows the requested action, at 0.81 to 0.90 confidence.

**The baseline is a declaration order, and a do-nothing policy beats Jev.** Always answering `none_of_these` scores 34 of 54 against Jev's 28 **[session-verified]**. The margin gate only needs `10*(A-B) >= M`, which 130 >= 54 clears easily. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:621-672]

**Errors are one-sided and stable.** DeepSeek finds 22 of the 34 none-rows still got a mode suggestion (sk-design 9 of 9 missed), and 19 of the 26 wrong picks were unanimous across rotations. `none_of_these` picks are precise (12 of 12) but recall only 35 percent. Pick probability carries no signal (0.678 on none wins against 0.688 on misses), so no confidence gate exists.

**Most rows are no longer clarifications.** Replaying all 54 prompts through `runCensus` and the shipped engines at `1f7746def8` gives 12 `clarify` rows, all sk-doc, and 42 `route` **[session-verified]**. The score path never replays a row, so it scored 42 rows that the routers no longer ask about. Luna adds that mcp-tooling turns near ties into bundles and sk-code's clarify helper needs a `clarify` constraint. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:106-155,1156-1205] [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/lib/router.cjs:107-116,130-157] [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:165-180,221-263]

**The fixture is not the population the feature planned.** Feature 020 planned a census of committed prompts, which found two mode clarifications in 359 prompts and could not reach its 30-label gate. The scored rows all carry `source: "fixture-047"`, a value the census never emits, and `gold: null`. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:74,88-104] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10]

## 4. Raising Accuracy and Lowering Cost

1. **Early stop, byte-equal (DeepSeek).** Call two orders and call the third only when they disagree. That gives 118 calls against 163 with identical picks and verdict **[session-verified]**. When the first two agree, the third vote can only confirm the same majority.
2. **Two calls with a tie rule (DeepSeek).** Answering `none_of_these` on disagreement gives A=31, W=22, L=6 at 109 calls. It changes what Jev says, so it is a Keep-Rule amendment, not a free saving.
3. **One call is about as accurate as three.** Single-order accuracy is 28, 28 and 29 of 54 **[session-verified]**. The extra calls buy stability, not accuracy. Luna keeps the three-rotation reference until a randomized single call is shown equivalent on a frozen, replay-verified holdout.
4. **The ceiling is the none recognizer (DeepSeek).** Perfect none recall with mode accuracy unchanged gives A=50. All 22 misses are two-mode co-requests, and the frozen `-q` instruction never names the both-and case. Changing it amends REQ-006 and needs a fresh corpus. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:88-104]
5. **The loss rows want one instruction rule (DeepSeek):** answer the mode that performs the requested action, and treat a named tool or surface as context.
6. **Cost is latency, not tokens.** About 119 estimated input tokens and 327.5 ms median per call (p95 380 ms). The call log has no billed tokens, and live clarify volume is unmeasured, so dollar cost is unknown (Luna). [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:47-54,1006-1053]

## 5. Making the Measurement More Trustworthy

Checks that pass today (DeepSeek): all six counts recompute from `calls.jsonl` and the labels, the options digest recomputes, and the labels match the arbiter draft 54 of 54.

Gaps both lineages name:

1. **Replay every row before scoring.** Record the pinned router build, policy hash, generation, action and exact alternatives, and refuse a row that no longer clarifies. On today's tree that would drop 42 of 54 rows **[session-verified]**.
2. **Put the instrument identity in `report.json`.** The report proves K, B and the column block only. DeepSeek recorded rows, fixture, labels and arbiter digests for the first time and proposes writing them into the report.
3. **Print stronger baselines.** Always-none and second-alternative beside B, and the strongest simple policy as the bar for any keep.
4. **Publish by class and by hub.** Named-mode accuracy and lift, abstention precision and recall, false-default rate and per-hub results. The gate has no per-class floor, so a pure-none corpus could keep with no mode evidence.
5. **Record label provenance.** The labels are one delegated arbiter read. Luna notes that `operator=54` counts rows sourced from the `label` field, not who approved them, so approval is unknown rather than disproved. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1175-1178] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-020.md:71-84]
6. **Separate position sensitivity from sampling noise.** `F` conflates them; DeepSeek finds 8 of 10 splits dissent on one rotation and proposes one repeated order per row.
7. **Measure the real clarify rate.** `--transcripts` exists but only counts.

## 6. Other .skilled Judgment Opportunities

1. **Expansion must be per hub.** Accuracy ranges from sk-doc 9 of 13 to sk-design 2 of 11, and sk-doc is the only hub whose rows still clarify on replay. sk-design is contraindicated on this corpus (DeepSeek).
2. **The advisor already rejected this judgment twice.** Phase 002 pick-first (W=11 L=27) and phase 019 whole-cluster (W=13 L=25) both lost. The keep does not carry across surfaces (DeepSeek).
3. **021 leaf-route replay is the closest analogue** but had 2 tied rows in 58 and made no Jev calls (Luna). [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:32-46]
4. **022 alignment suggestion** is a related destination choice whose fixture target is wrong on every row; repair its labels first. **031 debug-next-check** lost to its deterministic baseline (27 against 29 of 36) and stays off (Luna).
5. **The reusable asset is the measurement kit.** The census, digests, exact tail, modal pick and verdict are already exported, while 002, 019 and 021 rebuilt their own (DeepSeek).
6. **The surface is rare.** Two mode-alternative clarify rows in 361 committed prompts. The base rate caps the value of everything above.

## 7. Default-On Integration: Requirements, Cost, and Risk

**Requirements (both lineages).**

- A seam. `compiledRoute` drops the clarify alternatives and the front door prints only the normalized decision, so a suggestion has nowhere to live until the routing owner extends the contract. [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:96-108] [SOURCE: .skilled/bin/compiled-route.cjs:26-51]
- A named reader and a scope amendment. Feature 020 says the keep serves nothing. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:97-104,150-166]
- A suggestion beside `action: clarify`, never in place of it. It must be bound to the same hub, policy hash and generation, accepted only if it is one of the alternatives, and confirmed by the user.
- Fail-open to the plain clarification on `none_of_these`, timeout, provider error, missing credentials or a generation mismatch.
- A versioned output contract with consumer checks, a short deadline and an owner-controlled switch.
- A payload decision. Live calls send the user's prompt text off the machine. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:198-204]

**Cost.** About 1 s per clarify at three calls, about 0.72 s with the early stop, and negligible per session at today's base rate. The real cost is synchronous latency and a network dependency in a local, fail-safe path.

**Risk.** Served suggestions are right 16 of 42 times **[session-verified]**, and 19 of the 26 wrong ones are unanimous, so a wrong suggestion would anchor the user with apparent confidence. The suggestion set loses to always-none 34 to 28.

**Tiers (DeepSeek, matched by Luna's shadow-first plan).** T0: trust fixes and the transcript rate, no model. T1: shadow logging, where the user's real pick becomes a free label. T2: gated annotation, unanimous pick and per-hub allowlist, sk-design excluded. T3, the model deciding the clarify, stays excluded.

## 8. Ranked Recommendations

| # | Recommendation | Evidence | Cost |
|---|---|---|---|
| R1 | Replay each row against a pinned router build before scoring and refuse non-clarify rows | 42 of 54 rows route on replay [session-verified] | Small scorer change |
| R2 | Write rows, labels, options and scorer digests plus the build identity into `report.json` | report proves K and B only | Small |
| R3 | Report by class and hub, and print always-none and second-alternative baselines as the bar | always-none 34 beats Jev 28 [session-verified] | Small |
| R4 | Shadow-log real clarifies and treat the user's pick as gold | base rate 2 in 361; labels are one arbiter read | Policy plus a small writer |
| R5 | Record label approver and decision reference; add a second arbiter pass on the none class | `operator=54` is a field count | Small |
| R6 | Adopt the early stop: two agreeing orders, a third only on disagreement | 118 against 163 calls, byte-equal [session-verified] | Keep-Rule amendment, small |
| R7 | Target the none recognizer and the action-over-surface rule in the frozen instruction, measured on a fresh corpus | ceiling A=50; four losses share one shape | REQ-006 amendment plus labels |
| R8 | Expand per hub only, sk-doc first, sk-design excluded until it has its own rows | sk-doc 9/13, sk-design 2/11; only sk-doc clarifies on replay | Per-hub fixture |
| R9 | Reuse the exported measurement kit for 021, 022 and 031 before another score | three phases rebuilt their own | Refactor |
| R10 | Keep default-on at T0 and T1; any visible suggestion is a separate phase with seam, reader, fail-open and payload approval | served suggestions right 16/42 [session-verified] | New phase |

## 9. Confirmed, Inferred, and Unknown

**Confirmed by the session.** The class split (none 12/34 against 0/34, named mode 16/20 against 15/20), always-none 34/54, the early stop at 118 calls against 163, single-order accuracy 28, 28 and 29, served suggestions right 16 of 42, the hub counts, and the replay at `1f7746def8` giving 12 sk-doc clarifies and 42 routes.

**Lineage claims, not re-run.** The loss shape, the pick-probability overlap, the two-call tie-rule result, the ceiling arithmetic, the per-hub accuracy spread, the advisor history, the digests and the router seam details.

**Unknown.** The production clarify rate, billed usage and dollar cost, end-to-end latency, who approved the labels, and accuracy on real clarifications.

## 10. Eliminated Alternatives

| Approach | Reason eliminated | Lineage |
|---|---|---|
| Read the keep as mode-selection skill | 12 of 17 wins are abstentions; named-mode lift is one row | both |
| Score supplied rows without replay | 42 of 54 no longer clarify | both |
| Treat the fixture as the committed or live population | `fixture-047` rows; the planned census could not reach its gate | both |
| Gate the suggestion on pick probability | right and wrong probabilities overlap | deepseek |
| Buy accuracy with more calls | single-call accuracy equals the majority's | deepseek |
| Serve a mode automatically after keep | keep serves nothing; no seam and no reader | both |
| Read `none_of_these` as "no mode fits" | here it marks both-and requests | deepseek |
| Enable 022 or 031 on current comparisons | 022 targets wrong; 031 loses to its baseline | luna |

## 11. Divergence Map

- **Saturated.** The abstention-driven keep, the population mismatch and the missing seam, found by both.
- **Pivots.** DeepSeek recomputed counterfactuals (early stop, tie rule, ceiling, per hub) and the census replay. Luna focused on the data contract, label provenance, contradictions between spec and code, and the integration contract.
- **Remaining frontier.** A replay-verified held-out corpus and real user picks.

## 12. Open Questions

1. Can shadow logging collect enough real mode clarifications to measure lift per hub?
2. Were all 54 labels operator-confirmed, and can the receipt be recovered per row?
3. What are the eligible clarify volume, billed usage and end-to-end latency?
4. Which compiled-router owner would approve and maintain an additive suggestion contract?
5. Does the both-and instruction raise none recall without hurting named-mode accuracy on a fresh corpus?

## 13. Lineage Agreement and Disagreement

Both lineages agree that the arithmetic is faithful, that the keep is abstention-driven on a constructed fixture, that the rows need replay proof, and that default-on needs a separate phase behind shadow evidence.

They differ on cost. DeepSeek recommends the byte-equal early stop now and offers one call as a latency fallback. Luna keeps the three-rotation reference until a cheaper strategy proves equivalent. The early stop changes no output, so it satisfies both. The one-call change waits for Luna's holdout test.

Luna also flags spec text the code contradicts: feature 020 says sk-code has no clarify branch and mcp-tooling never clarifies, and the 047 results describe committed prompts while the rows say `fixture-047`. These limit the claims above and do not change the ranking.

## 14. Evidence Ledger

| Claim area | Evidence |
|---|---|
| Measured row and calls | `~/.skilled/.labels/runs/047-020-jev-20261002/{report.json,calls.jsonl}`; `047.../results.md:10` |
| Rows and labels | `~/.skilled/.labels/020-rows.jsonl`; `~/.skilled/.labels/drafts/020-arbiter.jsonl` |
| Scorer | `score-clarify-default.cjs:44-54, 106-155, 445-485, 597-672, 1006-1053, 1156-1205` |
| Routers and seam | `compiled-route.cjs:96-108`; `.skilled/bin/compiled-route.cjs:26-51`; mcp-tooling `router.cjs:107-157`; sk-code `canary-router.cjs:165-263` |
| Feature scope | `020-routing-clarify-default/spec.md:70-104, 150-166, 198-214` |
| Label policy | `042.../card-020.md:71-84` |
| Replay outputs | `research/lineages/deepseek/verification/census/` |

## 15. Method and Evidence Limits

Each lineage ran in its own detached directory under `research/lineages/`. The fixture is the only quantified corpus, and it is constructed (54 prompts written to tie, 63 percent none). Labels are one delegated arbiter read. Census numbers depend on the tree, so each carries its commit. No live Jev call was made.

Luna noted that the YAML closeout describes a legacy `synthesis_complete` event while the ledger schema registers a typed stem. It recorded the typed event itself and skipped the closeout script. The session ran the command's closeout for the merged packet.

## 16. References

- `research/lineages/deepseek/research.md`
- `research/lineages/luna/research.md`
- `research/fanout-attribution.md`
- `research/resource-map.md`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md`

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 8 (deepseek 5, luna 3)
- Questions answered: 5 / 5
- Remaining questions: 0 of the five; open follow-ups in section 12
- Convergence threshold: 0.05, telemetry only under the max-iterations stop policy
- Divergence summary: see section 11
