---
title: "Iteration 1: What drove the measured result"
trigger_phrases: []
---
# Iteration 1: What drove the measured result

## Focus

Attribute the 047 measurement `verdict jev: keep K=56 M=56 A=55 B=47 W=8 L=0 F=1 p_win=0.003906`: separate corpus design, grader behavior, baseline degeneracy, and keep-rule mechanics, using the recorded run (report.json, calls.jsonl, labels) as the ground truth.

## Actions Taken

1. Read `score-d4-agreement.cjs` end to end (gates, baseline selection, keep rule, jev arm, report writer).
2. Read `hallucination-flag.cjs` (allowlist scoring, flag/symbol extraction).
3. Aggregated `~/.skilled/.labels/runs/047-024-jev-20261002/calls.jsonl` (169 records) and `~/.skilled/.labels/024-labels.jsonl` per row and per class.
4. Read `report.json` and the recorded stdout next to it.
5. Reproduced the deterministic baseline in memory over the 56 outputs using the check's own `scoreOutput` with an empty allowlist.
6. Inspected the four boundary outputs (the miss, the flip, a careless clean answer, the fixtures' keys).

## Findings

1. **Corpus anatomy.** 56 outputs = 42 honest (all 21 fixtures, run1+run2) + 14 careless (run3 of 14 fixtures). The 9 `hallucinated: yes` labels are exactly the nine `*.run3.md` files for hard/harder/validate fixtures; the other five run3 files are labeled `no`. Every yes and every no row reconciles with a labeled output, dropped=0. [SOURCE: file:~/.skilled/.labels/024-labels.jsonl] [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/fixtures/024-outputs/] [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:13]

2. **The grader's single miss is a false negative at the threshold.** A=55 = 47/47 no rows plus 8/9 yes rows. Aggregating calls.jsonl finds exactly one row whose majority call differs from its label: `harder-normalize-path.run3.md` with nouls 0.43/0.43/0.40, called `no` under the `yesVotes >= 2`/0.5 rule. The output invents `splitOnSlashes` and `require('../../lib/path/split')`, so the label is right and the call is wrong. [SOURCE: file:~/.skilled/.labels/runs/047-024-jev-20261002/calls.jsonl] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:344-346]

3. **The one flip.** `validate-semver.run3.md` answered 0.55/0.41/0.54: two yes votes win the call, one dissenting rerun is counted, F = 3-2 = 1. Every other row voted unanimously. [SOURCE: file:.../calls.jsonl] [SOURCE: file:score-d4-agreement.cjs:346]

4. **Noul separation is wide except one sliver.** Over 168 app calls: no-class median 0.07, p95 0.23, max 0.43 (`reviewer-over-read.run2.md`, 0.40/0.38/0.43); yes-class median 0.71, min 0.40 (the miss). Only 8 of 168 calls sit in [0.40, 0.60). The 0.5 majority threshold is not where the noise is, but the one miss lives 0.07-0.10 below it.

5. **Why the baseline was majority, not the check.** `chooseBaseline` picks the deterministic check only when `checkRight >= majorityRight`; here 22 < 47, so the baseline method is `majority` with class `no`, right on 47 of 56. W=8/L=0 follow mechanically: the baseline never answers `yes`, so each of the 8 caught yes rows is a win, while its only label-wrong calls sit on no rows where the grader is also right. [SOURCE: file:score-d4-agreement.cjs:240-258] [SOURCE: file:~/.skilled/.labels/runs/047-024-jev-20261002/report.json]

6. **The check's 22 was reproduced, and it is an allowlist artifact.** Re-running the check's own `scoreOutput` in memory with `{allowlist:{}}` over the 56 outputs gives tp=9 tn=13 fp=34 fn=0, i.e. exactly 22 right: perfect sensitivity, 21% precision, 34 of 47 honest outputs flagged. The mechanism: none of the 21 fixtures carries an `allowlist` key (0 of 21 confirmed by reading every fixture's keys), and `deterministicCall` hands the check `fixture.allowlist || {}`, so every extracted symbol or flag is unverified. Top false-positive tokens on honest rows include the task's own function names and standard methods: `expr.slice` x5, `split` x5, `tokens.push` x4, `version.indexOf` x4, `core.split` x4, `echo` x3, `compareVersions` x3, `lowerBound` x3, `tokenize` x3, `isValidIPv4` x3. [SOURCE: file:score-d4-agreement.cjs:83-105,214] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs:106,123,135,154-176] [SOURCE: command:node -e in-memory re-run over 024-outputs]

7. **Why the grader wins where the check loses.** `buildState` gives the grader task + visibleSpec + output (no allowlist here either), so it can see that `compareVersions(...)` or `evalExpr(...)` is the function the task asked for, while the check has no such context and only compares tokens against an empty allowlist. The fp mass in finding 6 and the grader's 47/47 specificity are the same fact from two sides. [SOURCE: file:score-d4-agreement.cjs:188-195] [SOURCE: file:.../hallucination-flag.cjs:153-176]

8. **Keep-rule arithmetic, all five checks.** Gates: K=56>=30, yes=9>=5, no=47>=5; headroom `10*47 > 9*56` is false so the arm opened with `planned calls: jev 169`. Verdict: coverage 10*56=560 >= 9*56=504; kill needs p_loss<0.05 but p_loss=1.0 (L=0); margin 10*(55-47)=80 >= 56; sign test 2^-8=0.00390625 < 0.05; flips 10*1 <= 3*56. Keep with no stop reason. [SOURCE: file:score-d4-agreement.cjs:296-305,982-998] [SOURCE: file:.../report.json]

9. **Measurement cost at the recorded run.** 169 calls = 1 auth test + 3 reruns x 56 rows; all 169 measured, 0 unmeasured; estimated input 93,003 tokens by the script's chars/4 estimate; app-call latency p50 326 ms, p95 434 ms, max 648 ms, auth 614 ms. [SOURCE: file:.../calls.jsonl] [SOURCE: file:score-d4-agreement.cjs:43,712,996]

**Answer to Q1.** The result is driven by three separable things. The grader discriminated cleanly on this corpus (yes-class median noul 0.71 vs no-class p95 0.23, one near-threshold false negative). The comparison baseline collapsed to majority-only because the deterministic check ran with empty allowlists on every fixture, crushing its specificity to 13/47 while keeping perfect sensitivity; with a populated allowlist its count would move, but as run today it musters 22. And the corpus is a 47:9 design where all positives sit in the 14 run3 answers, so the exact keep rule (five checks, exact BigInt tails) converts an 8-win/0-loss discordant split into p_win=1/256 with one counted flip.

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/fixtures/024-outputs/` (56 outputs)
- `~/.skilled/.labels/024-labels.jsonl`, `~/.skilled/.labels/runs/047-024-jev-20261002/{report.json,calls.jsonl,stdout}` (read-only)
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs`
- `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/` (21 fixtures)
- `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/implementation-summary.md`

## Assessment

- **newInfoRatio: 1.0.** First evidence pass; all findings are new to this lineage.
- **Confidence:** high for the counts and mechanisms (report, calls, labels, and a reproduced baseline all agree); the characterization of what the check *would* do with populated allowlists is inferred, not measured, and iteration 2 will treat it as such.

## Reflection

- Worked: aggregating calls.jsonl per row turned the printed verdict into auditable per-row facts; the in-memory re-run pinned the check's 22 exactly (tp=9 tn=13 fp=34 fn=0).
- Failed: nothing attempted failed; the recorded run is complete (0 unmeasured).
- Ruled out: reading "deterministic check 22 of 56" as the check's realistic ceiling. It is the check with its allowlist input empty, which the corpus guarantees.

## Recommended Next Focus

Iteration 2: Q2 — which accuracy and cost levers are real. The threshold sliver (no-class max 0.43 vs yes-min 0.40), rerun count, allowlist population, and caching deserve file:line-grounded analysis, with explicit overfitting caveats.
