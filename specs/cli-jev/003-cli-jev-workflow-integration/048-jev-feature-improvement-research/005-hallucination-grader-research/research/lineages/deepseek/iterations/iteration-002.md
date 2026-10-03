---
title: "Iteration 2: Raising accuracy, lowering cost"
trigger_phrases: []
---
# Iteration 2: Raising accuracy, lowering cost

## Focus

Q2. Which accuracy and cost levers are real for the D4 agreement arm, grounded in the scorer, the deterministic check, the production grader path, and the recorded run; and which are unmeasured hypotheses that would need their own agreement run?

## Actions Taken

1. Re-read the arm's cost mechanics in `score-d4-agreement.cjs` (planned calls, reruns, payload estimate, requalify).
2. Read the production grader path: `scorer/grader/harness.cjs`, `scorer/lib/cache.cjs`, `scorer/grader/dispute.cjs`, the D4 scoring guidance in `grader/prompts/system-grader.md`.
3. Read `run-benchmark.cjs` grader plumbing (defaults, validation, family-collision guard) and `score-model-variant.cjs` grader factory and rubric.
4. Random-start review of the recorded boundary rows from iteration 1 (miss, flip, worst no row) against the threshold and rerun policy.

## Findings

1. **The cost is linear in reruns x rows, and the reruns are the block.** The arm plans `3 * K + 1` calls (`planned calls: jev 169` for K=56) at `JEV_RERUNS = 3`; only 1 of the 169 is the auth test. Recorded: ~93,003 estimated input tokens (the script's own chars/4 estimate), all 56 rows measured, app latency p50 326 ms / p95 434 ms. Halving reruns would save 56 calls (33%) but F (flip count) exists only because there are 3 samples. [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:43,712,996] [SOURCE: file:~/.skilled/.labels/runs/047-024-jev-20261002/calls.jsonl]

2. **The tie rule is silently specificity-favoring.** `yesVotes >= 2` maps a 1-1-1 tie to `no`, and `no` is the 47-row majority class; the recorded corpus has zero such ties and exactly one 2-1 flip. A 4th call only on ties (or on rows whose votes straddle the threshold) is a bounded accuracy lever, not a blanket rerun increase. [SOURCE: file:score-d4-agreement.cjs:344-346] [SOURCE: file:~/.skilled/.labels/runs/047-024-jev-20261002/calls.jsonl]

3. **The threshold sliver is real but tiny.** Majority-of-3 at 0.5: the single miss is 0.43/0.43/0.40 and the worst no row is 0.40/0.38/0.43; a per-value threshold at 0.42 would fix the miss on this corpus with no no-row flip (the worst no row would cast 1 of 3 yes votes). The supporting margin is one row and at most 0.03 noul, so this is a hypothesis for a fresh agreement run with a held-out split, not a patch to apply on this corpus' evidence. [SOURCE: file:~/.skilled/.labels/runs/047-024-jev-20261002/calls.jsonl] [SOURCE: file:score-d4-agreement.cjs:344-346]

4. **Fixture allowlists are the structural lever.** None of the 21 fixtures carries an `allowlist` key, so the deterministic check's allowlist mechanism is exercised nowhere: it flagged 34 of 47 honest rows, its top false positives being the tasks' own names (`compareVersions`, `lowerBound`, `echo`, `evalExpr`, `isValidIPv4`) and builtins (`expr.slice`, `split`, `tokens.push`, `version.indexOf`). The same corpus also starves the production path: `system-grader.md` tells the grader to compare against `fixture.allowlist.cli_flags` and `allowlist.symbols`, and `buildState` already knows how to include an allowlist in the jev state but only when the key exists. Populating allowlists is therefore a three-way lever: it makes the baseline comparable (B real instead of 22), gives the Claude grader its rubric anchor, and lets `buildState` hand the jev grader the same ground truth. [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:83-105,191-192,214] [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md:22-27] [SOURCE: command:in-memory reproduction over 024-outputs (top FP tokens)]

5. **A cascade would cut calls only after allowlists land.** Routing only check-flagged rows to the jev arm would today route 43 of 56 rows (34 fp + 9 tp, because fn=0) for 130 calls vs 169, a 23% saving; with populated allowlists the check's false positives shrink toward the builtin-name mass and the routed set approaches the true positives, though the exact figure is unmeasured. The cascade is safe only while the check's sensitivity stays 1.0 on the corpus it gates; on this corpus it is exactly 1.0 (fn=0). [SOURCE: file:.../calls.jsonl] [SOURCE: command:in-memory reproduction (tp=9 tn=13 fp=34 fn=0)] [SOURCE: file:score-d4-agreement.cjs:209-231]

6. **The production grader already has a dispute hook the agreement arm lacks.** `dispute.cjs` escalates to an adversarial second call when confidence < 0.7 or the recent dispute rate > 0.15, and reports median + dispute delta (threshold 0.15). The jev arm has no escalation; its miss sat entirely below 0.5, i.e. in the band a confidence-aware policy would re-ask. 8 of 168 recorded calls (4.8%) lie in [0.40, 0.60), so a rebate call on borderline rows is a small cost increment, but it is a new measurement shape. [SOURCE: file:.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/dispute.cjs:35,52-82,110-130] [SOURCE: file:.../calls.jsonl]

7. **A production grader failure silently becomes a maximally-hallucinated output.** In the `--grader llm` path, a dispatch or parse failure yields `score: 0.0, parse_status: 'failed'` rather than an unmeasured state, and the harness parse-failure fallback is also score 0.0. With D4 weight 0.15 this drops the weighted total as if the output had invented names, when the truth is the measurement failed. Any accuracy work on the LLM grader should add an explicit unmeasured/retry outcome before it trusts failures as findings. [SOURCE: file:score-model-variant.cjs:217-229] [SOURCE: file:harness.cjs:427-438,458-465] [SOURCE: file:score-model-variant.cjs:53-58]

8. **Cost guards already exist and should stay.** The arm opens only when K>=30, each class >=5, and the baseline has headroom (`10 * baseline.right > 9 * K` opens no arm); the recorded headroom check `470 > 504` passed and spent the planned 169 calls. Caching the jev answers is the remaining cost lever, and it trades directly against the flip measurement: an answer cache keyed by state+model+question freezes one sample. Use it for regression reruns (opt-in), not for agreement claims. [SOURCE: file:score-d4-agreement.cjs:982-996] [SOURCE: file:score-d4-agreement.cjs:841-845] [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/implementation-summary.md:81]

9. **Unverified levers, named as such.** Multi-row batched calls and a cheaper `JEV_PROVIDER` are plausible but unmeasured; both change the arm's contract and would need a new agreement run before any verdict uses them. [SOURCE: file:score-d4-agreement.cjs:437] — UNKNOWN: no batching or alternate-provider experiment exists in the repo.

**Answer to Q2 (ranked).** (1) Populate fixture allowlists: the highest-leverage change, because it repairs the baseline's specificity, anchors the Claude grader, and unlocks the cascade. (2) Make the rerun policy confidence-aware: 4th call on ties/borderline rows and an explicit threshold calibrated per model on a held-out split, re-measured. (3) Add the cascade once allowlists exist; today it saves 23% for free. (4) Define an unmeasured outcome for grader failures in the production path; the current 0.0-on-failure is a correctness bug, not a cost lever. (5) Opt-in answer caching for regression reruns only.

## Sources Consulted

- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs`, `dispute.cjs`, `prompts/system-grader.md`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs`
- `~/.skilled/.labels/runs/047-024-jev-20261002/calls.jsonl` (read-only)
- `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/implementation-summary.md:81`

## Assessment

- **newInfoRatio: 0.85.** The cost anatomy refines iteration 1's numbers rather than discovering them; the allowlist lever, cascade math, dispute analogue, and failure-semantics finding are new.
- **Confidence:** high for cost arithmetic, gate lines, and failure semantics (read from source); the cascade saving with populated allowlists is inferred and labeled.

## Reflection

- Worked: reading the production grader path in the same pass as the agreement arm surfaced that the allowlist gap starves both, which is stronger than either alone.
- Failed: nothing attempted failed; no experiment was run, by contract.
- Ruled out: threshold tuning on this corpus' own evidence (post-hoc, one-row margin). Threshold policy stays a hypothesis for a held-out run.

## Recommended Next Focus

Iteration 3: Q3 — trustworthiness of the measurement: label provenance, corpus clustering, pre-registration, significance assumptions, and reporting gaps.
