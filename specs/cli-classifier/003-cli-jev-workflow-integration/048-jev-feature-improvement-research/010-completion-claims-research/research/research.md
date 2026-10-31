---
title: "Deep Research: Improving the Jev Completion-Claim Audit (feature 026)"
description: "Merged two-lineage research on why the Jev completion-claim audit stopped on margin, how to raise its accuracy and lower its cost, how to make the measurement trustworthy, where else the judgment pays off, and what default-on would need."
trigger_phrases:
  - "jev completion claim audit improvement"
  - "score-completion-claims research"
  - "completion evidence sentinel regex recall"
importance_tier: "important"
contextType: "research"
---
# Deep Research: Improving the Jev Completion-Claim Audit (feature 026)

Two lineages researched the same five questions independently: DeepSeek V4.1 Flash at max thinking through cli-pi (5 iterations) and GPT-6 Luna at max reasoning on the fast tier through cli-codex (3 iterations). This report merges them. Figures marked **[session-verified]** were recomputed by the orchestrating session from the labeled rows, the recorded call log and the shipped sentinel. Everything else is a lineage claim with its cited source.

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

- **Feature**: 026 completion-claim audit, measured `stop (margin)`
- **Measured row**: `jev: stop (margin) K=110 M=110 A=102 B=93 W=13 L=4 F=0 p_win=0.02452`, run `~/.skilled/.labels/runs/047-026-jev-20261002`
- **Corpus**: 110 final turns, 50 Pi and 60 Claude; 10 labeled claims, all Claude **[session-verified]**
- **Lineages**: `deepseek` 5 of 5 iterations, `luna` 3 of 3, both `maxIterationsReached`
- **Date**: 2026-10-03

## 2. Request Summary

Answer five questions with `file:line` evidence: what drove the result, how to raise accuracy or lower cost, how to make the measurement more trustworthy, where else in `.skilled` the same judgment would pay off, and what a default-on integration would need, cost and risk. The feature asks whether a Jev judgment finds the turns that claim work is done better than the completion-evidence sentinel's regex. Research only.

## 3. What Drove the Result

**The regex has zero recall and zero precision on this corpus.** The shipped pattern fires on 7 rows, all false, and misses all 10 labeled claims **[session-verified]**. The pattern lists ten past-tense words (`completed`, `resolved`, `fixed`, `finished`, `shipped`, `released`, `deployed`, `implemented`, `occurred`, `happened`) over the last 400 characters. The claims say things like "The goal is complete", "everything is committed and pushed" and "Nothing remains to build". DeepSeek finds every false fire is a checklist item, a status table, a variable name or mid-process narration. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:40-45]

**The judge is better but two rows short.** Jev scores 102 against the regex's 93, with 13 wins and 4 losses. The margin needs `10*(A-B) >= M`, so 11 rows at M=110, and 9 fails before the sign test is read. The exact tail is 3214/131072. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:972-986]

**A regex miss switches the whole sentinel off.** DeepSeek notes `evaluateCompletionEvidence` returns early unless the regex fires, so zero recall also skips every evidence check.

**One runtime supplies every positive.** All 10 claims are Claude turns and the 50 Pi turns hold none **[session-verified]**, so claim metrics move in 10-point steps and say nothing about Pi.

## 4. Raising Accuracy and Lowering Cost

1. **Anchor to the closing statement (free).** Scoring only the last 160 characters drops false fires from 7 to 3 with no recall loss, raising regex accuracy from 0.8455 to 0.8818 **[session-verified]**.
2. **Add one word (free).** The pattern has `completed` but not `complete`. Adding it catches 3 of 10 claims with no new false fire, accuracy 0.8727 **[session-verified]**.
3. **Widen the vocabulary only under context filters (DeepSeek).** A broad list (`done`, `committed`, `passed`, `green`, `verified`, `nothing left`, `ready`) reaches 9 of 10 claims but 18 false fires, so it needs the closing anchor and filters for checklists, tables, code and assignments.
4. **The threshold is the cheapest judge lever, and it is post-hoc.** Replaying the recorded calls at a modal cut of 0.7 gives A=104 and A-B=11, which passes the margin exactly at equality. At 0.5 and 0.6, A is 102 and 103 **[session-verified]**. That is tuning on the scored rows, so it needs pre-registration and a holdout before it counts.
5. **One call per row.** F=0 across 110 rows, so one call reproduces the column at a third of the calls. Luna treats that as a new measurement arm to compare against the three-call reference, not a rewrite of this score.
6. **Measured cost.** 331 calls (1 auth check and 330 judgments), mean 329 ms, p95 391 ms, about 75 estimated input tokens per judgment, with Pi and Claude at parity (DeepSeek). Billed tokens and dollars are unrecorded.

## 5. Making the Measurement More Trustworthy

Strong already (DeepSeek): byte-for-byte replay with rows and labels digests, all 331 calls, exact BigInt tails and a pre-registered keep rule.

Gaps:

1. **Stratify the corpus.** Collect 30 or more positives across both runtimes. Today Pi contributes none.
2. **Fix the synthetic fixture (Luna).** `labels-happy` marks "The failure occurred." and "The outage happened." as claims, while the scorer's question defines a claim as a turn saying its work is complete. Those rows test the regex words, not the construct. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-happy-rows.jsonl:9-10] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:68-69]
3. **Reject duplicate row IDs (Luna).** Rows and labels are indexed into maps with no uniqueness check, so a duplicate overwrites silently and skews the join. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:103-125,172-194,910]
4. **Fix word attribution (Luna).** `firstClaimWord` uses substring `indexOf` while the detector matches whole words, so "unfixed" is attributed to `fixed` in the breakdown. Diagnostics only. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:223-235]
5. **Record label provenance.** The labels are an arbiter read under 042 ADR-001, and the file holds only `{id, claim}`, with no labeler, rubric or timestamp. Add a second independent labeler and an agreement statistic.
6. **Pin the input.** The scorer reads `raw_text`, while the hooks read the last assistant message, and no extractor in the repo ties the two (DeepSeek).
7. **Pre-register the threshold and vocabulary, and hold out a split** before reading any tuned number. Put cost inside the keep rule.

## 6. Other .skilled Judgment Opportunities

1. **One core, five wired surfaces.** Claude Stop, Codex Stop, Devin Stop, Pi `turn_end` and OpenCode `session.idle` share the sentinel, so one fix lands five times (DeepSeek).
2. **The Cursor adapter is unwired.** `.cursor/hooks.json` has no completion entry **[session-verified]**. This is the cheapest coverage gain.
3. **A second unscored regex sits in the same core.** `resolveSpecFolderFromText` picks the packet, and a wrong pick produces a false advisory. The same 110 rows can score it (DeepSeek).
4. **Spec-gate classification** is the next high-volume decision surface (DeepSeek).
5. **Prefer authoritative evidence where it exists (Luna).** Acceptance criteria, validator output and command exit status should decide closure. A claim detector should prompt a review, not replace them.

## 7. Default-On Integration: Requirements, Cost, and Risk

**The existing sentinel is already default-on and advisory.** A live model judge is a separate integration. Feature 026 keeps live judgment out of scope until a keep and a named reader exist. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:91-96,157-161]

**Pick the role first (DeepSeek).** Three are possible:

- A replacement gate: three calls and about 1 s serial per turn.
- An adjudicator behind the gate: three calls per firing turn, at a 6.4 percent fire rate here.
- Shadow: offline, with no user effect.

The 047 run measured only the replacement role.

**Requirements.**

- Budgets: Claude, Codex and Devin Stop hooks have 10 s. The sentinel's own check budget is 1.2 s. Do not carry the scorer's 90 s timeout.
- Pinned jev and model identity, with a requalify on change. An `auth status` gate. Regex-only when Jev is unavailable.
- Consent and stripping, since the tail goes out verbatim.
- Fail-open, a kill switch, a per-call timeout and a circuit breaker.
- A text-hash cache.
- A named reader and action policy.

**Pi visibility is unresolved (Luna).** The completion README says Pi's advisory reaches the model. The adapter sends it with `display: false, deliverAs: "nextTurn"`, and the injection contract says advisory data stays out of model context. Settle this before any privacy claim. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts:72-86]

**Cost.** About 3,000 calls per 1,000 turns in replacement mode, and far fewer as an adjudicator. Per-day cost is a model, not a measurement, because turn frequency was not collected.

## 8. Ranked Recommendations

| # | Recommendation | Evidence | Cost |
|---|---|---|---|
| R1 | Anchor the regex to the closing ~160 characters and filter checklists, tables, code and assignments | false fires 7 to 3, no recall loss [session-verified] | Free, plus canary tests |
| R2 | Add `complete`, then widen the vocabulary only under R1's filters | 0 to 3 claims, no new false fire [session-verified] | Free |
| R3 | Rebuild the corpus: 30+ positives across Pi and Claude, pinned extraction, two independent labelers | all 10 positives are Claude [session-verified] | Offline effort; main trust upgrade |
| R4 | Repair the scorer: reject duplicate IDs, fix whole-word attribution, correct the `labels-happy` fixture | Luna's code findings, verified | Small |
| R5 | Pre-register the judge threshold and test 0.7 on a holdout | 0.7 passes margin at equality, post-hoc [session-verified] | Free, needs a split |
| R6 | Put cost inside the keep rule and test one call per row as a new arm | F=0; 331 calls | Rule change |
| R7 | Wire the existing Cursor adapter | no completion entry in `.cursor/hooks.json` [session-verified] | One wiring change |
| R8 | Score the sibling regexes with the same kit: spec-folder resolution, then spec-gate classify | both unscored | Offline |
| R9 | Resolve Pi advisory visibility across README, adapter and injection contract | three sources disagree | Small |
| R10 | Keep the judge offline or in shadow until a pre-registered holdout keep with cost in the rule passes | stop on margin; spec defers live judgment | New phase |

## 9. Confirmed, Inferred, and Unknown

**Confirmed by the session.** The 0/7 and 0/10 regex counts, `+complete` at 3 claims with no new false fire, the 160-character anchor at 3 false fires, all positives from Claude, A at 102, 103 and 104 for cuts 0.5, 0.6 and 0.7, the `labels-happy` rows, the `indexOf` attribution, the unchecked maps, the Pi adapter flags and the unwired Cursor hook.

**Lineage claims, not re-run.** The broad-vocabulary trade-off, the early-return in `evaluateCompletionEvidence`, the call latency figures, the hook budgets and the role costs.

**Unknown.** Claim prevalence on live turns, Pi claim phrasing, billed cost, turn frequency and whether Pi advisories reach the model.

## 10. Eliminated Alternatives

| Approach | Reason eliminated | Lineage |
|---|---|---|
| Read p_win=0.02452 as enough to ship | margin is checked first and fails by 2 rows | both |
| Use the current regex as a pre-filter for the judge | it misses every claim the judge should recover | luna |
| Flip to keep at threshold 0.7 now | tuned on the scored rows; equality only | deepseek |
| Broad vocabulary without context filters | 18 false fires | deepseek |
| Enable the model judge by default across hooks | stop on margin; no named reader | both |
| Convert 331 offline calls into a live dollar cost | no frequency or tariff | luna |

## 11. Divergence Map

- **Saturated.** The margin arithmetic, the zero-recall regex and the need for a holdout, found by both.
- **Pivots.** DeepSeek replayed the recorded rows and calls to cost each fix and threshold. Luna, without row access, audited the scorer code, fixtures and hook contracts.
- **Remaining frontier.** A stratified, double-labeled holdout and live claim prevalence.

## 12. Open Questions

1. How do Pi turns phrase completion, and how often?
2. Does the 0.7 cut hold on a held-out split?
3. Is the `labels-happy` fixture meant to test regex words or the claim construct?
4. Does Pi's next-turn advisory reach model context?
5. Who reads a live judgment, and what do they do with yes, no or unavailable?

## 13. Lineage Agreement and Disagreement

Both lineages agree the stop is a margin miss, the regex cannot gate claims, the corpus needs stratified positives and independent labels, and the judge stays out of default-on until a pre-registered holdout passes.

They differ in reach. DeepSeek read the rows and calls and so could cost every fix. Luna reported the row-level data as unavailable and limited causal claims to aggregates, which the session's recount now settles. Luna added four code and contract defects DeepSeek did not report. No finding conflicts.

## 14. Evidence Ledger

| Claim area | Evidence |
|---|---|
| Measured row and calls | `~/.skilled/.labels/runs/047-026-jev-20261002/{report.json,calls.jsonl}`; `047.../results.md:15` |
| Corpus and labels | `~/.skilled/.labels/026-rows.jsonl`; `026-labels-047.jsonl` |
| Detector | `runtime/hooks/lib/completion-evidence-sentinel.cjs` (pattern, tail) |
| Scorer | `score-completion-claims.mjs:40-45, 68-69, 103-125, 172-194, 223-235, 736-807, 842-900, 910, 972-1009` |
| Fixtures | `runtime/tests/completion-claim-audit-fixtures/labels-happy{,-rows}.jsonl:9-10` |
| Adapters and wiring | `runtime/hooks/pi/completion-evidence.ts:72-86`; `.cursor/hooks.json` |
| Feature scope | `026-completion-claim-audit/spec.md:87-96, 128-140, 157-161` |

## 15. Method and Evidence Limits

Each lineage ran in its own detached directory under `research/lineages/`. Luna's lineage did not open the row-level files, so its causal statements stay aggregate; the session recount covers that gap. The threshold and vocabulary figures are measured on the same 110 rows they would be tuned on. No live Jev call was made.

## 16. References

- `research/lineages/deepseek/research.md`
- `research/lineages/luna/research.md`
- `research/fanout-attribution.md`
- `research/resource-map.md`
- `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md`

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 8 (deepseek 5, luna 3)
- Questions answered: 5 / 5
- Remaining questions: 0 of the five; open follow-ups in section 12
- Convergence threshold: 0.05, telemetry only under the max-iterations stop policy
- Divergence summary: see section 11
