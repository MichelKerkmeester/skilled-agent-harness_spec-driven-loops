---
title: "Jev fan-out merge — detached research synthesis (deepseek lineage)"
trigger_phrases: []
---
# Jev fan-out merge — detached research synthesis (deepseek lineage)

**Lineage:** `deepseek`  
**Session:** `fanout-deepseek-1790978645433-doul78`  
**Loop:** `research`, 5 iterations, `max-iterations`  
**Artifact root:** `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/001-fanout-merge-research/research/lineages/deepseek`  
**Measured baseline under study:** `verdict jev: keep K=60 M=60 A=53 B=12 W=44 L=3 F=3 p=1.232e-10 baseline=dedup-off reader=none named` (2026-10-02)

## 1. Executive Summary

The recorded `keep` is real against the oracle the scorer actually used — the merge's own rule — but that oracle is structurally blind to the labeled class. All 60 labeled pairs are `cross-body`; the merge's collapse gate requires equal body keys, so it decides `different` on every one of the 124 classed pairs under both dedup settings, and `B=12` is exactly what a constant-`different` guess would score. Jev's per-pair record is solid: 44/48 `same` pairs found, 9/12 `different` pairs cleared, 3 false-merges and 4 misses, 3 order flips in 180 calls, 53/60 overall. But two recorded facts reframe the result: the same judgment reaches `stop (margin)` against any zero-cost baseline that is not blind (constant-`same` scores 48/60; a lexical Jaccard rule ties Jev at 53/60), and 3 of the 12 `different` labels are near-verbatim restatements that Jev confidently called `same` — a single arbiter with no second reading cannot adjudicate them. The cheapest concrete wins are mechanical: stopping after two agreeing orders removes 58 of 181 calls with an identical verdict, and replacing the AB-repeat tiebreak (which caused 2 of the 4 misses) with a symmetric rule lifts the answer to 55/60. The most valuable expansion is not in the merge at all: the merge's question and ruled-out streams still match by exact id and lose restatements before synthesis, and `claim-continuity` already accepts semantic candidate evidence with no producer. Default-on should start at a zero-call census tier and a shadow pass with a named reader; a model as the collapse decision stays dropped.

## 2. Answers to the Five Questions

### Q1 — What drove the measured result

1. **Corpus geometry.** The census classed 124 pairs across 104 tracked runs; every one is `cross-body` and the `near-line` class is empty (`class near-line: research=0 review=0`). The class where the merge's 0.15 collapse threshold can act contributes nothing. [SOURCE: ~/.skilled/.labels/runs/047-030-jev.stdout.txt] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:370-376]
2. **A structurally constant baseline.** Cross-body pairs differ in body key by construction, and the merge collapses only on body-key equality plus title overlap; both dedup settings decide `different` on all 124 pairs, so the fight was Jev versus a constant-`different` oracle. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-354] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:399-402]
3. **Label composition.** 48 `same` / 12 `different`; W=44 is exactly the `same` pairs the column won and L=3 the `different` pairs it lost — arithmetic over composition, not per-pair superiority over a working rule. [SOURCE: ~/.skilled/.labels/030-labels.jsonl]
4. **Per-pair behavior.** Sensitivity 44/48, specificity 9/12, precision 44/47; the misses are threshold-band pairs (0.37–0.48) and misses caused by the tiebreak, while the false-merges are confident (0.59–0.93). [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl]
5. **Verdict arithmetic.** p=1.232e-10 is the exact tail P(X≥44 | 47) = 17344/2^47; the p-value is real and the comparison frame is the limiting factor, not the arithmetic. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1099-1129]

### Q2 — How to raise accuracy or lower cost

1. **Decision-equivalent early stop.** On 58 of 60 pairs the first AB and BA agree, and under the modal rule a third call cannot change a 2–0 answer; stopping halves to 122 judgment calls plus one auth (123 vs 181, −32%) with A/B/W/L and the verdict unchanged. [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1155-1188]
2. **Fix the tiebreak.** `AB, BA, AB` breaks 1–1 splits toward AB; both recorded splits were labeled `same` with BA holding that side, and a symmetric rule or BA-decides would score 55/60. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:86-87]
3. **Calibrate the cut on held-out data.** `SAME_AT=0.4` scores 57/60 (sensitivity 48/48) with specificity flat from 0.35 to 0.5; the three residual false-merges cannot be removed by any cut. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1086]
4. **Know the cheap ceiling.** A zero-call Jaccard or containment rule over the same text ties 53/60, so model value only exists above that line. [SOURCE: ~/.skilled/.labels/030-labels.jsonl]
5. **Right-size the machinery.** 323 ms and ~65 tokens per call against a 90 s timeout; the early stop also cuts payload a third. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:93]

### Q3 — How to make the measurement more trustworthy

1. **The verdict is frame-dependent.** Against constant-`same` (48/60) the margin gate fails at 50<60; against the lexical tie it fails at 0. `keep` survives only because the baseline is blind. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1120-1129]
2. **Oracle dropouts are counted as baseline errors.** 4 of 60 labeled pairs are `undecidable` for the merge (inactive review findings), all `same`-labeled, all near-verbatim, all won by Jev at 0.73–0.94; the report does not disclose them. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:488-508]
3. **The `different` class is thin and lopsided.** 8 of 12 are bare dimension-name pairs from one run; only 4 carry hard discrimination. [SOURCE: ~/.skilled/.labels/030-labels.jsonl]
4. **Three labels are contested.** Near-verbatim pairs labeled `different` with confident `same` reads; relabeling them moves the column to 56/60. The question ("describe the same problem?") and the labeler's identity notion may diverge. [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl]
5. **Gold identity is unrecorded.** No label digest, labeler, date or per-pair oracle decision in `report.json`; requalify pins the model but not the labels. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1475-1486]
6. **Reproducibility is split.** The census reproduces in-tree byte-for-byte; the verdict cannot be recomputed from the repository by design. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:560-565]

### Q4 — Where else in `.skilled` the same judgment pays off

1. **The merge's own question and ruled-out streams** — exact-id matching only; `ruledOutDirections` even drops a second lineage's attribution, and restatements reach synthesis as duplicate questions/directions. Highest payoff, lowest risk. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:759-787]
2. **`claim-continuity`** — the matcher already accepts `equivalent | distinct | topical_only` semantic candidates with a similarity score; the missing piece is a producer, exactly the measured judgment. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/claim-continuity/claim-matching.ts:109-123]
3. **`conditional-fanin`** — branch agreement is identical-`agreementKey` equality; substantive agreement under different keys reads as none, and the shadow adapter is the measurement seam. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/conditional-fanin/sufficiency.ts:22-34]
4. **`contradiction-supersession`** — canonical pair identity exists; the judgment that a pair contradicts is caller-supplied, so a model candidate generator would slot in behind the ledger's replay guarantees. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/contradiction-supersession/event-registry.ts:157-181]
5. **The scorer itself is the reusable kit** — classifier, oracle, label gate, Keep Rule and report builder are exported for any future surface. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1495-1529]

### Q5 — What a default-on integration would need, cost and risk

- **Requirements.** A named reader and a phase amendment (the record leaves the reader unnamed and drops a model as the merge decision); a failure mode that degrades byte-identically to today's hermetic merge; a cache with a pair-keyed identity because there is no answer cache by design; a guard decision, because the current `origin/main` publication guard withholds live pre-commit pairs as `unmeasured_unpublished`; and a per-class pair cap because nothing in the merge bounds pair spend. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:141] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1945-1953] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:886-911]
- **Cost.** ~323 ms and ~65 input tokens per call; 2–3 calls per pair; 124 pairs across 104 runs (~1.2/run) with a labeled maximum of 10 in one run, so seconds per typical run and low tens of minutes only with an uncapped busy workspace. [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl]
- **Risk.** 3 of 47 declared-`same` calls were false merges (6.4%) and 4 of 48 true pairs were missed (8.3%), with the tiebreak causing 2 of the misses; a review collapse preserves the strongest severity and FAIL class but changes the `p0/p1/p2` counts bound into synthesis; nondeterminism, egress and credentials are new to a hermetic step. [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:2129-2132] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:902-914]
- **Tiers.** T0 zero-call census default-on now; T1 shadow judgment with a named reader; T2 non-collapsing annotation; T3 model-as-collapse stays dropped. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:967-995]

## 3. Ranked Recommendations

| # | Recommendation | Why (evidence) | Effort | Cost |
|---|----------------|----------------|--------|------|
| R1 | Re-frame the verdict: report Jev against constant-`same` and a lexical rule alongside the merge oracle; expect `stop (margin)` on both for this corpus | 10*(53−48)=50<60; lexical ties 53/60 [S: 030-labels.jsonl] | Low | Zero |
| R2 | Fix the gold: second rater on the `different` class, pre-registered question contract, label digest in the report | 3/12 contested labels; relabel → 56/60; no gold identity recorded [S: calls.jsonl; scorer:1475-1486] | Medium | One labeling session |
| R3 | Adopt decision-equivalent early stop and a symmetric tiebreak | 58/60 unanimous after two calls; 123 vs 181 calls; AB repeat caused 2 of 4 misses [S: scorer:86-87,1155-1188] | Low | Negative (−32% calls) |
| R4 | Calibrate `SAME_AT` on a held-out set; expect 0.4–0.45 | 0.4 → 57/60 with flat specificity 0.35–0.5 [S: calls.jsonl] | Low | One held-out batch |
| R5 | Manufacture near-line coverage or declare the class unmeasured | 0 near-line pairs in 124 candidates; the 0.15 threshold is untested [S: census stdout; scorer:50-56] | Medium | Fixture construction |
| R6 | Integrate at T0 now (census line in attribution), T1 next with a named reader; keep T3 dropped | reader=none named; hermetic step; publication guard; 6.4% false-merge [S: 030 spec:93,141; scorer:886-911] | Low/Med | Zero at T0 |
| R7 | Extend the judgment to the merge's exact-id streams (questions, ruled-out, resolved) as candidate evidence | restatements survive to synthesis; claim-continuity contract already exists [S: fanout-merge.cjs:759-787; claim-matching.ts:109-123] | Medium | Per R6 tiers |
| R8 | Make verdict artifacts self-describing: label digest, per-pair oracle decisions and order answers in `report.json` | census reproduces, verdict does not; undecidable pairs undisclosed [S: scorer:1475-1486; 488-508] | Low | Zero |

## 4. Convergence Report

- **Stop reason:** `maxIterationsReached` (stop policy `max-iterations`; convergence was telemetry only).
- **Iterations completed:** 5 of 5.
- **Questions answered:** 5 of 5.
- **newInfoRatio trend:** 0.90, 0.85, 0.80, 0.75, 0.70 (rolling average 0.80).
- **Ruled out across the loop:** the near-line threshold claim, dedup-on superiority, more calls per pair, threshold-removable false-merges, repository-reproducible verdicts, clean oracle scoring of all 60 labels, model-as-collapse, and default-on under the unchanged publication guard.
