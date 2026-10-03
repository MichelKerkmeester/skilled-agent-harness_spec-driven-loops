# Iteration 2: Accuracy, cost, and measurement trust

## Focus

Identify ways to improve the detector's useful accuracy and reduce serving cost, then define tests that measure generalization rather than only repeatability.

## Findings

1. **Make the label target precise.** The benchmark's binary label is “instructs” or “clean,” and its question asks whether text contains behavior-changing instructions aimed at an agent. That does not itself distinguish hostile authority-changing attempts from legitimate instructions in skill or command documentation, or quoted examples. Add separate labels for malicious redirection, benign agent instruction, quoted attack text, and ordinary prose; decide the runtime action from those labels rather than treating all imperatives alike. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:52] [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl:1-90] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:140]

2. **Do not use a lexical miss to skip semantic screening.** The baseline caught only one planted sentence. Lexical matches can be an inexpensive “raise risk” signal, but the benchmark provides no evidence that a non-match is safe. A first-stage lexical gate would therefore reduce cost by discarding most of the very attacks this test was designed to detect. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:48-49] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113]

3. **Keep the detector advisory and separate it from permission checks.** The scorer reports review, flag, and block counts at 0.25, 0.50, and 0.75. Use the score for annotation, quarantine, or review; independently validate any proposed tool call against user intent and runtime permissions. OWASP places fetched-content input screening beside deterministic controls and action screening, and warns that a guardrail model itself can be attacked. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:53-59] [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html]

4. **Reduce serving calls without weakening the benchmark.** The current benchmark makes three fresh Jev calls per row plus an auth test: 271 calls for 90 rows. It reports call p50/p95 at 324/388 ms. For serving, start by measuring one call per fetched payload (or one per bounded chunk for a long payload); keep multiple reruns for offline confidence/stability tests, not on every live fetch. A cache may reuse a decision only for an exact normalized-content hash plus classifier, prompt, transformation, and policy versions. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:56] [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:1015-1052] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113] [INFERENCE: one-call serving and exact-version cache are cost proposals; neither has been measured in the feature 035 harness.]

5. **Measure operational cost in the units the scorer already exposes.** It estimates request tokens from text characters divided by four and records per-call latency, but not total wrapper delay, retries, production cache behavior, or monetary spend. A rollout report should include calls and input tokens per fetch/chunk, p50/p95 added end-to-end latency, timeout and retry rates, and cache hit rate; do not infer serving latency from a single-call microbenchmark. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:1015-1052] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113]

6. **Audit labels blind and retain disagreement.** There are five natural “instructs” rows and 55 natural “clean” rows; natural labels carry one operator-delegated labeler, while the 30 planted rows use construction labels. Have a second blinded reviewer label the natural and hard-benign sets, adjudicate disagreements, and preserve labeler/provenance fields. This is especially important when a legitimate instruction in documentation resembles an attack. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl:1-90] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:140]

7. **Use independent source and format holdouts with hard negatives.** Freeze test rows before changing prompts or thresholds; hold out source groups/domains and collect real WebFetch/WebSearch outputs in addition to the planted challenge set. Report separate hard-benign, obfuscated, multilingual, HTML/Markdown, and structural-shift results at the same threshold. A recent detector benchmark reports that aggregate F1 can hide a very high false-positive rate on externally sourced benign security text; that is a warning about evaluation design, not a predicted Jev outcome. [SOURCE: https://arxiv.org/abs/2609.15017] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:88-100] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:140-145]

8. **Report uncertainty separately from repeat-call stability.** Using the 90-row counts, simple row-independent 95% Wilson intervals are about 82–95% for accuracy (81/90), 71–94% for precision (31/36), and 74–95% for recall (31/35). These are only rough row-independent intervals; source clustering may widen them. The scorer's three calls per row and F=0 show decision stability on the same rows, not generalization to new pages. Report source-cluster bootstrap intervals and a held-out-source estimate. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:791-830] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113] [INFERENCE: Wilson intervals calculated from the recorded counts; the source-cluster adjustment is not measured by this scorer.] [SOURCE: https://arxiv.org/abs/2609.15017]

9. **Detection and mitigation are separate outputs.** A high score can identify likely malicious content but does not reliably remove it; detection/removal research evaluates those as distinct steps. Prefer preserving provenance and attaching an untrusted/flagged annotation or quarantine decision. Any sanitization must itself be tested for removed attack text and retained useful content. [SOURCE: https://arxiv.org/abs/2502.16580]

## Ruled Out

- Treat a lexical non-match as permission to bypass Jev; only one planted sentence was caught by the baseline. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113]
- Treat three same-row calls as three independent examples; the scorer aggregates to one result per row. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:791-830]
- Treat a classifier label as the final authority to execute, reject, or rewrite agent tool behavior. [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html]

## Dead Ends

- Tuning the 0.50 threshold on these same 90 rows and then reporting the same rows as held-out evidence would contaminate the evaluation. Keep a new source/domain holdout for threshold selection. [SOURCE: https://arxiv.org/abs/2609.15017]

## Edge Cases

- The current test combines user-authored natural labels and constructed positives, but the two labeler categories do not distinguish attack intent from legitimate instruction. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl:1-90]
- Long fetched pages may exceed the scorer's 5–60-line band. A production chunking policy needs overlap and tests for instructions crossing boundaries. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:42-47] [INFERENCE: the current scorer does not process whole long fetched pages.]

## Sources Consulted

- deep-research-config.json and research.md (read before progressive synthesis update)
- deep-research-strategy.md and iterations/iteration-001.md (read before iteration 2)
- .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:43-59, 791-830, 1015-1052
- .skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl:1-90
- specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:88-100, 140-146
- specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113
- OWASP LLM Prompt Injection Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- PIDS-Bench: https://arxiv.org/abs/2609.15017
- Can Indirect Prompt Injection Attacks Be Detected and Removed?: https://arxiv.org/abs/2502.16580
- steer.md (checked before iteration 2; absent)

## Assessment

- New information ratio: 0.83
- Novelty: Six findings add new evaluation and cost controls; three partly extend the earlier comparator, stability, and operational-scope findings.
- Questions addressed: How can accuracy improve or cost fall? How can the measurement become more trustworthy?
- Questions answered: Both questions, with the distinction between evidence-backed current measurement and unmeasured design proposals stated.
- Confidence: High for current corpus composition and scorer behavior; medium for proposed serving savings until measured on real fetched payloads.

## Reflection

- What worked and why: Pairing scorer counters with independent evaluation guidance exposed both call-cost drivers and limitations that row accuracy alone cannot show.
- What did not work and why: Current evidence has no real-page, blind-labeler, source-held-out, or production-prevalence results.
- What I would do differently: Build the independent hard-benign and real-fetch holdout first, then select any threshold before querying the held-out set.

## Recommended Next Focus

Iteration 3: locate related untrusted-input judgments elsewhere in .skilled and map the runtime/tool-response seam, requirements, cost, and rollout risks for default-on integration.
