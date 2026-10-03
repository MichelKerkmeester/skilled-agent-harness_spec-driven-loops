---
title: "Deep Research: Improving the Jev Pi Native Classifier Transport (feature 037)"
description: "Merged two-lineage research on why the Pi native classifier transport measured adopt, how to raise its agreement and lower its cost, how to make the measurement trustworthy, where else the transport pays off, and what default-on would need."
trigger_phrases:
  - "jev pi transport improvement"
  - "score-pi-transport research"
  - "jev-transport default on"
importance_tier: "important"
contextType: "research"
---
# Deep Research: Improving the Jev Pi Native Classifier Transport (feature 037)

Two lineages researched the same five questions independently: DeepSeek V4.1 Flash at max thinking through cli-pi (5 iterations) and GPT-6 Luna at max reasoning on the fast tier through cli-codex (3 iterations). This report merges them. Figures marked **[session-verified]** were recomputed by the orchestrating session from the two recorded call logs and the shipped transport. Everything else is a lineage claim with its cited source.

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

- **Feature**: 037 Pi native classifier transport, measured `adopt`, shipped opt-in in phase 038
- **Measured row**: `verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022`, run `037-pi-native-classifier-transport/scratch/live-run/`
- **Corpus**: the 111-row advisor choice replay, Pi arm fresh on 2026-09-30, CLI arm the recorded 019 run of 2026-09-29
- **Lineages**: `deepseek` 5 of 5 iterations, `luna` 3 of 3, both `maxIterationsReached`
- **Date**: 2026-10-03

## 2. Request Summary

Answer five questions with `file:line` evidence: what drove the result, how to raise accuracy or lower cost, how to make the measurement more trustworthy, where else in `.skilled` the same transport would pay off, and what a default-on integration would need, cost and risk. The transport sends Jev `choice` questions to Pi's native `classify()` instead of spawning the `jev` CLI, behind `JEV_TRANSPORT`. Research only.

The dispatched topic named `jev-transport.mjs` as the scorer and phase 047 as the measuring phase. Luna flagged both. The scorer is `benchmark/pi-transport/score-pi-transport.mjs`, `jev-transport.mjs` is the adapter, and the result comes from phase 037. The session corrected the child spec and cites the right paths here.

## 3. What Drove the Result

**The verdict is one row from failing.** The rule needs coverage of at least 90, agreement of at least 95, and Pi p95 within 1.5 times CLI p95, judged in that order. Cost is printed but never decides. Agreement on the three-order mean is 106 of 111 **[session-verified]**. One more disagreement gives 94.6 and `keep-cli`. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:69-80,1060-1087]

**Agreement is parity, not correctness (both).** The scorer compares each arm's mean-ranked top key. There is no gold label, so the result says Pi answers like the CLI, not that either is right. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1031-1057]

**All five disagreements are near-ties (DeepSeek).** Every one sits in the 12 rows where either side's top-two margin is under 0.10, and the other 99 rows agree on every one. Two are metric artifacts. `rr-iter3-127` has identical per-order picks on both sides and flips only because the averaged means cross. `rr-iter3-125` is an exact CLI tie settled by option order.

**The comparison is confounded (both).** The Pi arm used OpenRouter `typesafe/jev-1.13`, and the CLI arm used the official `jev-1.13.0` a day earlier. The 95.5 is cross-provider, cross-day agreement within one model family, not a transport-only effect. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:41-50]

**The cost figure is Pi-only.** `cost_per_100` is the mean in-process `usage.cost.total`. The CLI cost is null, and no usage field is stored in the call log, so 0.0022 survives only in `report.json`.

## 4. Raising Accuracy and Lowering Cost

1. **Rotations hold the verdict up.** Against the CLI three-order mean, Pi agrees on 104 rows with one call, 105 with two and 106 with three **[session-verified]**. DeepSeek reports 103 for one call; tie handling differs, and both counts fall below the 95 bound. An early stop when orders 0 and 1 agree lands at 94.6 (DeepSeek). Neither cut keeps the verdict.
2. **Margin-gated escalation is the one agreement lever on record (DeepSeek).** Serving Pi only where its top-two mean margin is at least 0.10, and deferring the rest to the CLI, gives 110 of 111 while Pi still answers 104 **[session-verified]**. It is a hybrid response to ambiguity, not a better model, and it needs a rerun to confirm.
3. **Measure correctness with labels (Luna).** Label a representative choice set blind to backend and report each arm's accuracy and calibration beside agreement. Keep a holdout.
4. **Fix the tie and averaging artifacts (DeepSeek).** A tie-aware agreement metric removes the two artifact flips. That is metric repair, not accuracy.
5. **Cost is small, and wall time is the lever.** About $0.0075 per 333-call replay (DeepSeek), or about $22 per million Pi calls at the same mix (Luna). Codemode runs up to four classifier calls at a time, roughly a 4x wall-time lever for batch harnesses. Screen candidate models with one random order, then confirm with three (Luna).

## 5. Making the Measurement More Trustworthy

1. **Run both arms fresh, the same day.** The `--pi --cli` path records `replay: 'fresh'` and has never run. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1112-1155,1330-1351]
2. **State the power.** The exact 95 percent interval is [89.8, 98.5] for 106/111 and [88.6, 98.0] for 105/111 (DeepSeek), so adopt and keep-cli are indistinguishable at this sample. Add a stated stability margin, repeated runs, or a "within noise" outcome.
3. **Record what is claimed.** Store per-call usage and cost, excluded IDs, per-row margins and order picks. Judge on raw counts, not rounded percentages.
4. **Prove the inputs (DeepSeek).** The replay checks only the option key set and then sends the current census prompt, and neither side stores a prompt digest, so prompt drift is invisible.
5. **Pin identities.** The CLI gate pins `jev 0.6.2`, while the Pi gate accepts any version. The verdict is scoped to Pi 0.99.1 and `jev-1.13`.
6. **Add labels and repeats.** A labeled subset on the 12 ambiguous rows turns "the sides differ" into "which side is right", and two more replays bound run-to-run drift.

## 6. Other .skilled Judgment Opportunities

1. **Six more `choice` call sites, verified by both lineages:** `score-suggested-order.mjs:454-467` and `score-jev-tiebreak.mjs:1002-1011` in the skill advisor, `score-track-narrowing.mjs:1324-1333`, `score-debug-next-check.mjs:730-739`, `score-verdict-fallback.cjs:775-785` and `score-severity-replay.cjs:1067-1074`. The only confirmed imports today are `score-clarify-default.cjs:24` and `leaf-route-replay.cjs:26`.
2. **Volume sits in the routing-accuracy harnesses,** at 333 calls per replay. Start with `score-suggested-order`, the source family of the recorded replay.
3. **`noul` and `score` callers are blocked by type (DeepSeek).** About eight `noul` and one `score` caller exist, among them the deep-loop runtime scorers, but the transport carries `choice` only. Each would need its own measured arm.
4. **The payoff is operational, not epistemic.** About 22 percent lower mean latency, one fewer child process, and a route that works without the `jev` binary where a Pi credential exists. No surface gains accuracy.
5. **Audit blind spot (DeepSeek).** `dispatch-audit.mjs:236-241` counts `jev` spawns as classifier dispatches, so Pi-native calls disappear from that audit.
6. **Inventory gap (Luna).** Phase 038 reports 21 direct-spawn files but its owner breakdown names 20. Re-run a reproducible census before using it as a rollout denominator.

## 7. Default-On Integration: Requirements, Cost, and Risk

**Provider intent is dropped today.** `choiceRequestFrom` consumes `--provider` and discards it. The Pi route is pinned to `openrouter` and `typesafe/jev-1.13` **[session-verified]**. A caller asking for the official provider would silently get OpenRouter. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:32-36,85-93]

**The kill switch cannot override a per-call choice.** `resolveTransport` lets the per-call option win over `JEV_TRANSPORT` **[session-verified]**, so an emergency environment switch cannot force the CLI on a caller that passes `pi`. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:49-64]

**Requirements (both lineages).**

1. The R1 measurement repairs come first.
2. Preserve or reject the provider request, and pin the Pi version with a rerun trigger.
3. Fallback must be quiet, or preflighted once per process. Without that, a default path prints a skip line on every call on machines without Pi credentials.
4. Bound the combined latency of the Pi attempt plus the CLI fallback. A failed Pi attempt followed by the full CLI call doubles the worst case, and there is no circuit breaker.
5. Cache the runtime per process. It is rebuilt on every call (`jev-transport.mjs:349-366`), and the benchmark's 260 ms used one runtime per run.
6. Make backend and usage observable, and decide the data path, since every prompt would go to OpenRouter.
7. Ship as an `auto` mode with staged rollout: canary the two existing callers, and keep `noul`, `score` and `auth` on the CLI.

**Cost.** Dollars are trivial. What matters is the worst-case latency on failure, the operator time for identity reruns, and spend moving from an unrecorded CLI cost to a metered OpenRouter one.

**Risk.** A one-row margin with overlapping intervals, an unpinned Pi identity, and a transport that has never made a live call outside the benchmark.

## 8. Ranked Recommendations

| # | Recommendation | Evidence | Cost |
|---|---|---|---|
| R1 | Repair the measurement: same-day `--pi --cli` paired run, per-call usage and backend, prompt digest, raw counts, excluded IDs, a second replay | one-row margin; CLI arm recorded a day earlier | Small |
| R2 | Preserve provider intent, or refuse Pi when another provider is asked for | `--provider` dropped; route pinned [session-verified] | Small |
| R3 | Let an environment kill switch override the per-call option, or document the precedence | option wins over env [session-verified] | Small contract change |
| R4 | Harden the transport: cache the runtime per process, pin the Pi version, quiet or preflighted fallback, combined latency budget | runtime rebuilt per call; unpinned gate | Small to medium |
| R5 | Add margin-gated escalation (Pi at margin of 0.10 or more, CLI below) and confirm by rerun | 110/111 simulated, Pi serving 104 [session-verified] | Medium |
| R6 | Label the 12 ambiguous rows and a holdout; report per-arm correctness | no gold label | Medium |
| R7 | Adopt in `choice` harnesses one owner at a time, `score-suggested-order` first, opt-in | six verified call sites | Small per caller |
| R8 | Keep three rotations for verdict-bearing runs | one call 104, two calls 105, three calls 106 [session-verified] | None |
| R9 | Measure `noul` and `score` arms before extending the transport past `choice` | type boundary | Medium |
| R10 | Default-on only as a monitored `auto` mode after R1 to R4 | one-row margin; data path | Decision |

## 9. Confirmed, Inferred, and Unknown

**Confirmed by the session.** Agreement of 106, 105 and 104 for three, two and one calls, margin-gated escalation at 110 with Pi serving 104, the dropped `--provider`, the pinned provider and model, and the option-over-environment precedence.

**Lineage claims, not re-run.** The near-tie anatomy and the two artifact flips, the exact intervals, the price catalog, the per-call runtime rebuild, the audit blind spot and the 21-against-20 inventory gap.

**Unknown.** Correctness of either arm, CLI cost, production volume, live latency through the adapter, and provider compatibility at the candidate callers.

## 10. Eliminated Alternatives

| Approach | Reason eliminated | Lineage |
|---|---|---|
| Treat 95.5 agreement as correctness | no gold labels; providers differ | both |
| One- or two-call policy for verdict-bearing runs | falls below the 95 bound | deepseek |
| Claim Pi is cheaper than the CLI | CLI cost is null; cost is not a gate | both |
| Route every question type to Pi | adapter is choice-only; `noul` and `score` unmeasured | both |
| Free or cheaper model arms as a free win | no keep-rule run for any alternate identity | deepseek |
| A hard default flip now | one-row margin, never-live adapter, unpinned identity | both |

## 11. Divergence Map

- **Saturated.** The one-row margin, parity over correctness, and the confounded comparison, found by both.
- **Pivots.** DeepSeek recomputed the call-count and escalation counterfactuals, the intervals and the caller inventory. Luna audited the adapter contract (provider, precedence, fallback) and the packet's provenance labels.
- **Remaining frontier.** A same-day paired, labeled run.

## 12. Open Questions

1. Does the agreement hold on a same-day paired run with the same provider?
2. Which arm is right on the 12 ambiguous rows?
3. Should the escalation gate be 0.10 (7 rows deferred) or 0.05 (2 rows)?
4. Is the OpenRouter data path acceptable for every caller, and who decides?
5. Which file explains the 21-against-20 inventory gap?

## 13. Lineage Agreement and Disagreement

Both lineages agree the adopt is real but one row thin, that it measures parity, that the transport stays opt-in until a paired, labeled run passes, and that adoption should go one owner at a time.

They disagree slightly on one figure. DeepSeek reports 103 rows for a single call, and the session recount gives 104. The difference is in tie handling, and both sit below the bound. Luna found the provider and precedence defects in the adapter and the packet's provenance errors. DeepSeek found the escalation lever and the audit blind spot. No recommendation conflicts.

## 14. Evidence Ledger

| Claim area | Evidence |
|---|---|
| Measured row and calls | `037.../scratch/live-run/{report.json,calls.jsonl,live-run.stdout.txt}`; `019.../scratch/w4-session/jev-run/calls.jsonl` |
| Scorer | `score-pi-transport.mjs:69-80, 575-601, 1031-1087, 1112-1155, 1330-1351` |
| Adapter | `jev-transport.mjs:32-64, 71-173, 325-395` |
| Callers | `score-clarify-default.cjs:24`; `leaf-route-replay.cjs:26`; six choice sites in section 6 |
| Integration scope | `038-pi-classifier-transport-integration/spec.md:41-50, 89-124` |

## 15. Method and Evidence Limits

Each lineage ran in its own detached directory under `research/lineages/`. Luna's lineage needed four starts because of the runtime's config-row defect; the final one ran with a topic line telling it not to write a config row. The corpus is one 111-row replay with no labels. No live transport call was made.

## 16. References

- `research/lineages/deepseek/research.md`
- `research/lineages/luna/research.md`
- `research/fanout-attribution.md`
- `research/resource-map.md`
- `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs`
- `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/`
- `specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md`

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 8 (deepseek 5, luna 3)
- Questions answered: 5 / 5
- Remaining questions: 0 of the five; open follow-ups in section 12
- Convergence threshold: 0.05, telemetry only under the max-iterations stop policy
- Divergence summary: see section 11
