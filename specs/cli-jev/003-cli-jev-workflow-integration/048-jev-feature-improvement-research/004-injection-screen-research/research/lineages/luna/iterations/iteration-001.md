# Iteration 1: Why Jev beat the lexical comparator

## Focus

Explain the measured outcome from the scorer's question, corpus, label distribution, comparator, and keep rule.

## Findings

1. **The recorded Jev result clears the benchmark's predeclared keep rule on this sample.** With K=M=90, A=81 and B=56, Jev is correct on 25 more rows than the selected baseline. The code requires at least 90% coverage, at least 80% precision, a margin of at least 0.10, sign-test p below 0.05, and bounded call flips. Here coverage is 90/90; flagged-row precision is 31/36 (86.1%); the accuracy margin is 25/90 (27.8 points); p=0.00001118; and F=0. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:59] [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:754-761] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113]

2. **The comparison is against a narrow lexical rule.** The four case-insensitive patterns cover variants of “ignore previous instructions,” “system prompt,” “exfiltrat,” and “hidden marker.” The baseline is whichever does better on these labels: flag-nothing or that lexical screen. The live receipt reports B=56 and one planted sentence caught, so the lexical rule edges flag-nothing by one row on this sample. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:48-49] [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:642-655] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113]

3. **The 90-row label mix is 55 natural clean, 5 natural instructions, and 30 planted instructions.** A read-only count of labels.jsonl returns those totals. Thus one third of rows are constructed positives; the result is informative about this mixture, while it does not establish a production-prevalence precision. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl:1-90] [INFERENCE: production prevalence is not supplied by this benchmark, so its precision cannot be transported without a deployment base rate.]

4. **Jev's score is aggregated by row despite 270 calls.** It runs three fresh calls per row; a row is flagged when a majority score is at least 0.50. Accuracy and baseline wins/losses are then counted over rows; Brier uses each row's mean probability. The receipt's F=0 says the threshold decision did not flip among the three calls for these rows. The 271 planned calls include the one auth test. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:791-830] [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:1015-1052] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113]

5. **The scored payload is a constructed stand-in for fetched output.** Each row is a 5–60-line section read from public vendored Markdown; a planted sentence is inserted for planted rows. Feature 035 explicitly adds no fetch hook, settings matcher, or wrapper. A keep result supports using Jev as a promising classifier candidate, but says nothing yet about how reliably a live runtime can intercept or score actual HTML-to-text, search snippets, or agent-selected pages. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:42-47] [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:621-629] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:43] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:88-100] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/implementation-summary.md:170-173]

## Ruled Out

- Treat the four-pattern screen as a sufficient standalone defense for the broader injection set: it caught only 1 of 30 planted sentences in the reported run. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113]
- Treat 270 repeated calls as 270 independent examples: the scorer computes accuracy, paired wins, and Brier over 90 rows after aggregating each row's three probabilities. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:791-830]

## Dead Ends

- Re-running the same benchmark without changing corpus, labels, scorer, or prompt would not answer whether the result generalizes to real fetched content. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/implementation-summary.md:170-173]

## Edge Cases

- The planted p19 sentence contains both “ignore previous” and “system prompt”; this illustrates why a lexical match may catch an obvious attack, but the run receipt does not name which planted row was the sole hit. [SOURCE: .skilled/skills/cli-classifier/benchmark/injection-screen/planted.jsonl:19] [INFERENCE: the source files do not map the reported baseline hit to a row in the receipt.]
- Gateway projection completed and added exactly one iteration row. Its legacy upcast warned that trustedEvidenceYield is absent and recorded zero; the full evidence remains in this delta and the iteration narrative.

## Sources Consulted

- .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:38-60, 338-340, 621-655, 754-830, 1015-1052
- .skilled/skills/cli-classifier/benchmark/injection-screen/labels.jsonl:1-90
- .skilled/skills/cli-classifier/benchmark/injection-screen/planted.jsonl:1-30
- specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/goal.md:113
- specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md:43, 88-100
- specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/implementation-summary.md:170-173
- deep-research-strategy.md (read before iteration 1)
- steer.md (checked before iteration 1; absent)

## Assessment

- New information ratio: 0.90
- Novelty: Four findings add scorer, comparator, label-balance, and run-cost detail; one finding partly refines the known offline-versus-fetched-text scope.
- Questions addressed: What drove the measured Jev result?
- Questions answered: What drove the measured Jev result?
- Confidence: High for scorer arithmetic and corpus construction; limited for generalization beyond this corpus.

## Reflection

- What worked and why: Reading the result receipt alongside the scorer definitions reconciled the headline values with the exact per-row rules.
- What did not work and why: The receipt does not identify which row produced the only lexical catch; the row-level mapping remains unknown.
- What I would do differently: Use held-out sources and actual fetch-output captures in later measurement rather than infer their behavior from the offline Markdown corpus.

## Recommended Next Focus

Iteration 2: identify concrete accuracy and cost levers, then define a measurement design that distinguishes repeated-call stability from independent generalization.
