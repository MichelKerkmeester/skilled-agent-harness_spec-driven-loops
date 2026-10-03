# Iteration 1: What Drove the 24-Row Result

## Focus
Reconstruct the measured result from the sampling rule, baseline construction, paired metrics, and keep gates. Separate accuracy on selected regex misses from expected value on ordinary reviewer traffic.

## Findings

1. **The corpus was selected for the exact condition that activates the fallback.** The scorer counts a row as a hit if extractVerdict returns a verdict and retains only rows where it returns null; the regex itself accepts a standalone pass, fail, or block line with an optional verdict/result/status prefix, and the last match wins. Thus K=24 is a deliberately enriched miss set, not 24 randomly drawn reviewer outputs. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:212-219] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123]

2. **The baseline was weak by construction on this balanced three-label set.** The report says majority=8/24 and loose=0/24. With three labels across 24 rows, a largest class of 8 means the labels split 8/8/8. The scorer chooses the better of majority and the last whole pass/fail/block word; here majority was the better zero-call rule. The output rows themselves were not in the repository evidence, so why the loose rule scored zero cannot be confirmed from the summary alone. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:270-310]

3. **The paired result is strong on those 24 labels, with order stability.** K=24 and M=24 mean every planned row was measured; A=24 Jev picks matched the supplied label, B=8 baseline picks matched, W=16 rows were Jev-only wins, L=0 were baseline-only wins, and F=0 means no non-modal answer among the three rotations. With 16 discordant rows and no losses, the exact one-sided binomial tail is 1/65,536 = 0.00001526. The pre-registered checks also pass coverage, margin, sign test, and flips, which yields keep. This p-value tests paired improvement over the selected baseline under its sign-test model; it is not a confidence interval for overall reviewer accuracy. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:317-356] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:405-431] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14]

4. **The benchmark establishes conditional fallback competence, not production coverage.** The profile names four built-in reviewer fixtures. The feature-025 spec reports 8 fixture cases and 8 regex hits, so the fallback would not run on those known cases; it also says the current tree lacks recorded live reviewer outputs and that live runs retain only output hashes. The user-provided premise that ordinary reviewers rarely miss the pattern therefore materially lowers expected call volume, but the 24 selected misses do not estimate the miss rate. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/reviewer-regression.json:7-13] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:68-74]

5. **The measured cost scales with misses and deliberately includes repeat judgments.** The Jev arm asks each miss in three rotated option orders and prints planned calls as 3*K+1 for the auth check. For K=24 that is 73 planned calls; the evidence table reports p50 334 ms and p95 377 ms. Its input-token estimate is based on payload characters divided by four, but this evidence does not provide provider billing, output tokens, or retry incidence, so no dollar estimate is supported. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:700-708] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:775-794] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:1071-1077] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14]

## Sources Consulted
- specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:34-55, 212-219, 270-310, 317-356, 405-431, 700-708, 775-794, 1071-1077
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123
- .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/reviewer-regression.json:7-13
- specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:68-97
- User prompt premise: real reviewer outputs rarely miss the verdict regex.
- Luna steer.md checked before this iteration; absent.

## Assessment
- newInfoRatio: 0.64
- Novelty: The measured headline depends on miss-only selection and paired comparisons against a 33% majority baseline; this clarifies why it is not a production-wide accuracy or value estimate.
- Confidence: High for implementation and reported benchmark arithmetic; moderate for the interpretation of the external 24-row labels because the row-level outputs are not present here; low for real-world miss prevalence beyond the user-supplied premise.
- Convergence telemetry: 0.64 is above the 0.05 threshold. Continue; max-iterations governs the run.

## Reflection
- Worked: Reading the scorer alongside the result table exposes how K/M/A/B/W/L/F and the exact p-value are produced.
- Limitation: The source outputs and per-call log are external to the repository, so the loose baseline's row-level failures and repeated-call correlation cannot be audited here.
- Ruled out: Treating p_win as a population accuracy interval or reading the 24/24 as production-wide coverage.

## Recommended Next Focus
Identify accuracy improvements and cost reductions that preserve the scorer's explicit verdict boundary, then distinguish safe caching/consensus changes from a new statistical claim.
