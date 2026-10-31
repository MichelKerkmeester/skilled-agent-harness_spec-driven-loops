---
title: "Deep Research: Improving the Jev Spec-Folder Suggestion (feature 022)"
description: "Merged two-lineage research on why the Jev spec-folder suggestion measured keep, how to raise its accuracy and lower its cost, how to make the measurement trustworthy, where else the judgment pays off, and what default-on would need."
trigger_phrases:
  - "jev folder suggestion improvement"
  - "score-alignment-suggestion research"
  - "spec folder alignment jev"
importance_tier: "important"
contextType: "research"
---
# Deep Research: Improving the Jev Spec-Folder Suggestion (feature 022)

Two lineages researched the same five questions independently: DeepSeek V4.1 Flash at max thinking through cli-pi (5 iterations) and GPT-6 Luna at max reasoning on the fast tier through cli-codex (3 iterations). This report merges them. Figures marked **[session-verified]** were recomputed by the orchestrating session from the scored rows, the recorded call log, the specs tree and the shipped scorer. Everything else is a lineage claim with its cited source.

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

- **Feature**: 022 spec-folder alignment suggestion, measured `keep`
- **Measured row**: `verdict jev: keep K=40 M=40 A=39 B=30 W=10 L=1 F=0 p=0.0059 baseline=top`, run `~/.skilled/.labels/runs/047-022-jev-20261002`
- **Corpus**: 40 fixture rows built from real spec folders; the target is wrong on all 40 by construction
- **Lineages**: `deepseek` 5 of 5 iterations, `luna` 3 of 3, both `maxIterationsReached`
- **Date**: 2026-10-03

## 2. Request Summary

Answer five questions with `file:line` evidence: what drove the result, how to raise accuracy or lower cost, how to make the measurement more trustworthy, where else in `.skilled` the same judgment would pay off, and what a default-on integration would need, cost and risk. The feature asks Jev to pick the right folder when the save-time alignment check flags a low match and lists other folders. Research only.

## 3. What Drove the Result

**The comparator is the top alternative, not the target.** The target is right on 0 of 40 rows **[session-verified]**, so `chooseBaseline` fell back to the top-listed alternative, right on 30. The run says nothing about Jev against the save flow's real default, which is to keep the target. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:579-593]

**The baseline is picked on the same labels it is scored against (Luna).** `chooseBaseline` takes the better of target and top over the labeled rows before any model call. That is fair to Jev here, since it picks the stronger free answer, but the p-value describes this corpus and comparator only. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:579-593,650-690]

**The signal is ten clean recoveries.** The label sits at `alternatives[0]` on 30 rows **[session-verified]**. Jev was right on all 10 rows where the top alternative was wrong and lost 1 of the 30 where it was right. No row changed pick across the three rotations: 81 of 120 measured calls returned pick probability 1.0 **[session-verified]**.

**The one loss is a description collision (DeepSeek, inferred).** On f022-001 (label `001-deep-research`) Jev picked `007-classifier-deep-research` all three times at 0.52, 0.58 and 0.48, the lowest confidence in the run **[session-verified]**. `buildDescriber` resolves bare folder names through a global basename index and falls back to the bare name when the basename is not unique. `001-deep-research` has a `description.json` in 9 places **[session-verified]**, so the correct option was the only one shown without a description. A rerun with path-resolved descriptions would confirm it. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:831-877]

**Jev sees more than the baseline (Luna, inferred).** The validator scores folder-name overlap with topic words plus a fixed domain bonus, while Jev gets the row state and a description per folder. That richer context plausibly explains the gain, but no ablation isolates it. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:299-350,412-470]

## 4. Raising Accuracy and Lowering Cost

1. **Fix description resolution (DeepSeek).** Resolve `description.json` by path before any basename index, and skip archive folders in the index. This targets the one loss.
2. **Measure candidate recall first (Luna).** Jev can only pick the target, a listed alternative or none. The content path keeps at most three non-archive sibling folders that score above the target **[session-verified]**. If the real destination is not listed, no chooser can recover it. Report recall separately from accuracy when the answer is present. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:522-537]
3. **Score content and folder saves separately (Luna).** `validateContentAlignment` uses topics plus observation keywords, `validateFolderAlignment` uses topics alone, and only the data path can switch folders. One aggregate hides different recall and error rates. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts:1032-1049,1148-1168]
4. **Gate the extra passes on confidence (DeepSeek).** Running passes 2 and 3 only when pass 1 is below 1.0 would have used 70 calls instead of 120 **[session-verified]**, a 42 percent cut. It loses per-row flip evidence on gated rows and needs a keep-rule amendment.
5. **One call per live save (Luna).** Keep three passes for offline measurement and test a single confirmed choice live: 40 calls instead of 120 on a 40-row equivalent, a projection, not a measurement.
6. **Cost is latency.** About 1 s of model time per save at three calls (p50 324 ms per call). There is no token or price receipt, and the `description.json` `keywords` field is unused (DeepSeek).

## 5. Making the Measurement More Trustworthy

1. **Use real saves.** Feature 022 specifies rows from real transcripts with operator labels. The label inventory found none, so the run used a 40-row fixture under a fixture allowance. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:81-92]
2. **Record the final destination and label provenance.** Every label repeats the row's own plan folder, the arbiter draft holds only `{id, label}`, and the row schema has no labeler, source, rationale or final-saved-folder field. The transcript exporter derives `gold` from `event.pick` and leaves `label` blank. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:508-567,1354-1375]
3. **Adjudicate the 11 discordant rows** with a second labeler and record agreement (DeepSeek).
4. **Pre-declare the comparator and hold out rows** grouped by project or folder family, so the baseline is not chosen on the evaluation labels (Luna).
5. **Hash-pin the corpus, report and scorer revision.** The scored corpus and run directory live outside the repository, and the repository fixture copy has `label: null` on all 40 rows (DeepSeek).
6. **Report W+L and an interval beside p, and add negative controls**: swapped labels and distractor states (DeepSeek).

Already right (DeepSeek): a dated keep rule frozen before any model run, gates for labels, callables and foreign labels, an options hash per call, and row text kept out of files.

## 6. Other .skilled Judgment Opportunities

1. **The same judgment appears four times in the save flow (DeepSeek).** The CLI alignment suggestion (built), the data-path suggestion (computed, unusable non-interactively), folder auto-detection and the explicit-CLI argument (computed then bypassed). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts:1043-1049,1160,1187]
2. **Auto-detection near-ties are the best unbuilt target (DeepSeek).** `assessSessionConfidence` already flags quality ties and gaps under 10 points, and the path already falls through on low confidence. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts:300-325,1247-1250,1301-1304]
3. **Adjacent ties (DeepSeek).** Child-folder ambiguity is refused with a "Did you mean" list and predecessor-memory ties resolve to null.
4. **Skill-advisor ranking (Luna).** It already has a semantic shadow lane at weight 0.05 and a rerank for close scores. Measure that pipeline rather than adding a parallel chooser. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:488-499,766-795]
5. **Trigger-index retrieval (Luna).** A measured semantic lane might help paraphrased triggers. Gate 3 classification stays deterministic. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:155-211]

## 7. Default-On Integration: Requirements, Cost, and Risk

**Shape.** Both lineages start with a flag-gated suggestion on interactive, low-match data saves. It shows one folder and a reason, and the existing selection step authorizes any switch. CLI-explicit saves keep their folder and log `ALIGNMENT_BYPASSED`. Non-interactive adoption would be its own policy decision, and a model pick never overrides the below-20 percent hard block. Any shape needs an amendment to 047 D6 ("No Jev arm joins a default path").

**Requirements.**

- Durable, revocable payload consent. The scorer's acceptance is per run.
- A save-time timeout of a few seconds with skip-on-timeout. The scorer's 90 s is batch-scale.
- Options constrained to offered IDs or abstention, and the chosen path revalidated against approved spec roots.
- Request text and observations treated as untrusted data.
- A kill switch whose off state equals today's behavior.
- A save-flow call log covering eligibility, suggestion, acceptance, correction, fallback, tokens and latency.
- An evidence gate on a non-fixture corpus.

**Cost.** About 0.3 to 1.0 s of model time per fire. Price and fire frequency are unknown: the committed-tree census found 2 low-match events with no alternatives.

**Risk.** A wrong redirect misfiles work, because writes follow the selected folder. Other risks are generalizing from a fixture, session text leaving the machine, save latency and injection through session text.

## 8. Ranked Recommendations

| # | Recommendation | Evidence | Cost |
|---|---|---|---|
| R1 | Rebuild the corpus from real low-match saves with the final destination, save path and label provenance recorded, then rerun the frozen keep rule | target wrong 0/40 by construction [session-verified] | Data only |
| R2 | Path-resolve `description.json` before the basename index; skip archives | the one loss is the only undescribed option; 9 copies [session-verified] | Small, plus tests |
| R3 | Report candidate recall and split content from folder saves | at most three non-archive candidates [session-verified] | Small |
| R4 | Pre-declare the comparator, hold out rows, adjudicate the 11 discordant rows | baseline chosen on the scored labels [session-verified] | Small |
| R5 | Hash-pin corpus, report and scorer; add W+L, an interval and negative controls | artifacts outside the repo | Small |
| R6 | Gate passes 2 and 3 on pass-1 confidence offline; test one confirmed call live | 70 against 120 calls [session-verified] | Keep-Rule amendment |
| R7 | Measure the same judgment at auto-detection near-ties next | confidence bands already exist | Medium |
| R8 | Prototype the flag-gated interactive suggestion only after R1 to R5, in shadow first | 047 D6; missing consent, timeout and kill switch | New phase |

## 9. Confirmed, Inferred, and Unknown

**Confirmed by the session.** Target right 0/40, label at `alternatives[0]` on 30, 81 of 120 calls at probability 1.0, the 70-call gating figure, the f022-001 picks at 0.52, 0.58 and 0.48, the nine `001-deep-research` descriptions, `chooseBaseline` counting on the labeled rows, and the three-candidate cap.

**Inferred.** The description collision as the cause of the one loss, and richer context as the cause of the gain. Both need an ablation or rerun.

**Unknown.** Accuracy on real saves, candidate recall, label correctness, price, fire frequency, and operator acceptance.

## 10. Eliminated Alternatives

| Approach | Reason eliminated | Lineage |
|---|---|---|
| Quote the result as beating the target | the target's 0/40 was manufactured by the fixture | both |
| Read p=0.0059 as production superiority | comparator chosen on the same labels; fixture only | both |
| One fixed pass as the scoring protocol | loses the flip signal without an equivalence study | deepseek |
| Order rotation as an accuracy lever | zero flips; it is a stability control | deepseek |
| Route every alignment warning to the model's folder | CLI-explicit saves keep their folder; no safety evidence | both |
| Let a model pick override the non-interactive hard block | policy | deepseek |
| Discard the verdict because the corpus is a fixture | the arithmetic is right; the inference is what overreaches | deepseek |

## 11. Divergence Map

- **Saturated.** The fixture-bound keep, the missing label provenance and the interactive-first rollout, found by both.
- **Pivots.** DeepSeek traced the one loss to the describer and mapped the save-flow call sites. Luna focused on baseline selection, candidate recall, save-path strata and reuse in the skill advisor and trigger index.
- **Remaining frontier.** A real-save corpus with final destinations and recall.

## 12. Open Questions

1. How often is the real final folder inside the offered candidate set?
2. Does path-resolved description text convert f022-001?
3. Are the 10 wins and the 1 loss labeled correctly?
4. Does one live call keep accuracy and abstention on held-out rows from both save paths?
5. What are the price, fire frequency and operator acceptance rate?

## 13. Lineage Agreement and Disagreement

Both lineages agree that the keep is a sound fixture-level result against the top alternative, that it cannot estimate real saves, and that any served form is an interactive, confirmed suggestion behind a flag.

They complement each other. DeepSeek found the likely cause of the one loss and the cost gate. Luna added the same-label baseline caveat, the recall-first protocol and the save-path split. On cost, DeepSeek keeps the three-pass protocol unless an equivalence study passes. Luna keeps three passes offline and tests one call live. These fit together and do not conflict.

## 14. Evidence Ledger

| Claim area | Evidence |
|---|---|
| Measured row and calls | `~/.skilled/.labels/runs/047-022-jev-20261002/{report.json,calls.jsonl}`; `047-022-jev.stdout.txt` |
| Corpus and labels | `~/.skilled/.labels/022-rows.jsonl`; `drafts/022-arbiter.jsonl`; `047.../scratch/fixtures/022-rows.jsonl` |
| Scorer | `score-alignment-suggestion.ts:28-67, 508-593, 618-690, 830-878, 980-989, 1011-1140, 1354-1375` |
| Validator and save flow | `alignment-validator.ts:299-350, 412-491, 522-537, 601-684`; `folder-detector.ts:300-325, 1032-1049, 1148-1168, 1247-1304` |
| Feature scope | `022-alignment-folder-suggestion/spec.md:69-92, 118, 184-208`; `047.../goal.md` D4, D6 |

## 15. Method and Evidence Limits

Each lineage ran in its own detached directory under `research/lineages/`. The corpus is a 40-row fixture labeled by a delegated arbiter. The causes of the gain and the one loss are inferred. No live Jev call was made.

## 16. References

- `research/lineages/deepseek/research.md`
- `research/lineages/luna/research.md`
- `research/fanout-attribution.md`
- `research/resource-map.md`
- `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md`

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 8 (deepseek 5, luna 3)
- Questions answered: 5 / 5
- Remaining questions: 0 of the five; open follow-ups in section 12
- Convergence threshold: 0.05, telemetry only under the max-iterations stop policy
- Divergence summary: see section 11
