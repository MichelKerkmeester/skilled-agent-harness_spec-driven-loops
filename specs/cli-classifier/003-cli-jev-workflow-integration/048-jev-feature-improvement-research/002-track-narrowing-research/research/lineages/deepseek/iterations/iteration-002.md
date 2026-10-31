---
title: "Iteration 2: Raise Accuracy Or Lower Cost"
trigger_phrases: []
---
# Iteration 2: Raise Accuracy Or Lower Cost

## Focus

Enumerate amendment-class options to raise the narrowing's accuracy or lower its cost, with recorded-run evidence and expected effect. All new numbers in this iteration were computed offline from the recorded run's `out/calls.jsonl` (811 records) and `out/report.json`; no model call and no repository write was made.

## Findings

1. The keep rule's margin condition is exactly a 10-point-gain floor: `10*(A-B) >= M` is `A >= B + M/10`, and the recorded headroom line declares the target as `a 10-point gain fits above 68/256`. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:883] [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt] Jev's 97/256 is an 11.3-point gain (37.9 percent vs 26.6 percent), so the feature passed a 10.0-point bar by 1.3 points. Accuracy work should target the 2-of-3 modal pick and the abstain boundary, because ~4 rows move the verdict.

2. Abstention is lost information, not latent right answers. Offline replay of the 57 rows whose modal pick was `none`: zero of them had the gold track submitted in any of the three orders. Excluding the `none`-modal rows, pick accuracy is 97/199 = 48.7 percent — below half even on the decided subset. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl] Any amendment that simply ignores `none` votes or counts abstention neutrally recovers nothing; the 57 rows need better inputs (question text, candidate set) to become pickable at all.

3. The recorded probabilities are unused and buy a small, real gain with zero calls. Each call record stores `pickProb` and `noneProb`. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1357] Offline, replacing the modal-key vote with the argmax of summed `pickProb` across the three orders raises A from 97 to 98 on the same 811 recorded calls, with one row gained and none lost. Scoring never reads those fields today. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:937] Calibration data is also available: mean `pickProb` on submitted picks is 0.641, mean `noneProb` on `none` picks is 0.475. A probability-aware aggregation and a calibrated abstain boundary are the two highest-leverage accuracy changes that need no new measurement runs.

4. Option rotation is not the accuracy tax it might appear to be. Per-order right counts are flat — 94, 95, 96 of 256 for orders 0, 1, 2 — and per-order `none` counts are 58, 56, 57. The 47 flips are mostly hard rows whose answer is not stable across orders, not a systematic position effect. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl] A 2-order design would reduce flips and cost but would also cut stability evidence; the modal rule already needs three orders to mean anything. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:843]

5. Cost is dominated by the 17-option block, not by the questions. From the run's own payload estimate (905,891 input tokens over 811 calls) and the option construction: per call is about 4,474 characters (~1,118 tokens), the option block is 4,330 characters (96.8 percent), and the average question is about 108 characters (~3 percent). [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1240] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:585] A two-stage design — shortlist N candidate tracks with the existing lexical lanes, then ask the model among N+1 options — cuts per-call input roughly in proportion: 5 options is about 1,408 characters (~352 tokens), a 68 percent input reduction, and removes distractor options the model currently must discount. It also changes `CHOICE_INSTRUCTION`, the option set and therefore the keep rule, so it is an amendment. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:53]

6. The corpus cap has cheap power on the table. 256 rows were kept out of 1,727 usable descriptions; `system-speckit` alone had 1,009 usable and contributed 20, and `cli-orca` contributed 1. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt] Raising the cap or raising K spends calls (~3 per row, ~330 ms and ~1.1k tokens each) to buy statistical power and per-track resolution, not pick accuracy. Tracks with 1-12 rows cannot support any per-track claim today.

7. The question family is the accuracy gap the probes already expose. On the 14 gold-bearing Latin paraphrase probes, Jev's modal pick was `none` on 9 and correct on 2; ripgrep was right on 8. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl] The paraphrase failure is predominantly abstention, matching finding 2. The fixture holds 120 probe rows (latin/cjk x exact/paraphrase/distractor) but the scorer loads only latin paraphrase and uses latin exact only as gold donor. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:731] A second question family (the frozen `prompt-set.json` fixture, or real session prompts) would test the input distribution Gate 1 actually sees before any integration. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/prompt-set.json]

8. Amendment cost is concrete: the contract is pinned by a 978-line test suite across ten describes (test set, lookup baseline, ripgrep baseline, options and summary, paraphrase probes, verdict, entry point, jev gate, jev arm). [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts:184] [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts:502] and by the module note that normalization, fixtures and recorded relations move together. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:7] The rule's own comment states any call-shape or keep-rule change is an amendment, not a tuning. [SOURCE: file:.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:53]

9. The recorded run is mechanically clean, which matters for cost realism: all 811 calls were measured on attempt 1 with exit code 0 — no retries, no timeouts, no partial rows — so p50 330 ms and p95 391 ms represent uncontaminated single-call cost. [SOURCE: file:specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl]

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl` (offline replay)
- `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/prompt-set.json`
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/lineages/deepseek/steer.md` (absent)

## Assessment

- newInfoRatio: 0.72
- Novelty justification: the iteration produced three new measured facts from the recorded calls — zero recoverable abstentions, +1 row from probability aggregation, and the 96.8 percent option-block share of payload — and ranked them against the amendment cost.
- Confidence: high for the replay numbers (recomputed from 811 recorded records); medium for the two-stage cost estimate, which is arithmetic on the recorded payload estimate, not a measured run.
- Code graph note: no code graph query used.

## Reflection

- Worked: replaying `calls.jsonl` offline turned a 47-flip stability statistic into per-order and per-row answers, and killed one plausible amendment (drop `none` votes) with hard evidence.
- Failed: question text is not in `calls.jsonl`, so residual-name and per-track error analysis could not be replayed; carried to Q3.
- Ruled out: "ignore abstentions to lift accuracy" — zero recoverable rows; "order rotation as the main accuracy tax" — per-order accuracy is flat within 1 percent.

## Recommended Next Focus

Iteration 3: make the measurement more trustworthy. Separate reproducibility gaps (row identity, out-dir behavior, prompt-set pinning) from statistical gaps (clustering, near-threshold margin, one-sided tail) and baseline-fairness questions, with evidence.
