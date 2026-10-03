# Iteration 2 — Corpus validity and evaluation cost

## Focus

Audit the labeled-row contract and same-sample comparator selection, assess whether the reported corpus represents real low-alignment saves, and derive the scorer’s call and latency envelope from its implementation.

## Actions Taken

- Re-read the lineage steer.md path before this iteration; the file is absent.
- Read the scorer’s row parser, effective-label and baseline rules, keep calculation, call loop, and transcript row exporter.
- Compared the measurement corpus description with the feature 022 record of observed low-alignment saves.

## Findings

1. **The reported comparison is conditional on a baseline selected from the same labels.** chooseBaseline counts how often each row’s effective label matches the target and the first alternative, then chooses the more accurate column. The supplied result says the target is right on zero rows and baseline=top is right on 30, so the comparison is Jev against that selected top alternative. The reported sign-test value matches the 10 wins and 1 loss among disagreements, but the source code selects the comparator on the evaluated labels themselves. Treat p=0.0059 as evidence for this corpus and comparator; a future generalization claim should predeclare target and top comparisons or select a comparator on development rows and report on held-out rows. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:579-592, 653-690] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/008-folder-suggestion-research/spec.md:72]

2. **The row schema cannot establish independent gold-label provenance.** A row stores id, path, target, alternatives, state, gold, and label, with no adjudicator, decision time, provenance, or final-folder field. effectiveLabel trusts a nonempty label, then falls back to gold if it names an offered option. The transcript exporter sets gold from the recorded event pick and leaves label blank. Those mechanics do not show how this particular fixture was labeled; they mean the reported counts alone cannot show that each answer is an independently adjudicated final destination. Preserve the source event, final saved folder, label author and rationale, timestamp, and disagreement history for each row. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:508-567, 1354-1375]

3. **The fixture does not by itself demonstrate performance on production low-match saves.** The research packet describes 40 rows drawn from real spec folders, while feature 022 says its committed evidence had only two below-50 saves and neither had a paired final folder. Unless the 40 rows are verified save events with known final destinations, this is a folder-choice fixture rather than an observed production evaluation set. Future measurement should collect real low-match saves, retain the final destination, and stratify the results by validateContentAlignment versus validateFolderAlignment, project, and folder family. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/008-folder-suggestion-research/spec.md:60, 72] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:79-89]

4. **The current evaluator plans 121 calls for 40 callable rows, with repeated sequential inference.** The scorer reports 3 × rows + 1 planned calls: 120 choice calls plus one Jev auth check. It sends the row state and option descriptions, estimates input tokens from their text length, rotates order across three passes, and records wall time, exit status, model, provider, and version. Choice calls run sequentially; exit code 4 triggers one retry after a two-second backoff, and each call has a 90-second timeout. The implementation does not establish a dollar cost, and the packet does not provide per-call logs, so cost should be reported as actual calls, elapsed time, token usage, and provider price rather than inferred dollars. Keep the three-pass protocol for evaluation; a default-on path should test whether one call with abstention and confirmation gives an acceptable latency and quality tradeoff. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:28-67, 1011-1057, 1066-1107, 1115-1140]

## Questions Answered

- **Measurement trust:** The keep arithmetic is internally consistent, but the comparator was chosen using the same labeled rows and the row format lacks label provenance. Preserve a predeclared baseline and independently adjudicated held-out labels.
- **Cost:** The 40-row evaluator planned 121 calls, including 120 choices and one auth check; live dollar cost and per-save latency remain unmeasured.
- **Representativeness:** The available packet evidence does not pair the feature’s observed below-50 saves with final destinations; collect that outcome data before making a production-lift claim.

## Questions Remaining

- Do the 40 labels come from independent review of final saved destinations, and how clustered are the rows by folder or project?
- Can a one-call live suggestion retain acceptable agreement and abstention quality?
- Which candidate-generation changes improve recall before Jev is asked to choose?

## Sources Consulted

- steer.md — checked before this iteration; absent.
- specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/008-folder-suggestion-research/spec.md:60, 72
- specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:79-92
- .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:28-67, 508-592, 618-690, 1011-1140, 1241-1267, 1354-1375
- deep-research-state.jsonl and deep-research-strategy.md — read to resume the existing lineage.

## Assessment

- newInfoRatio: 0.68
- Justification: This pass adds a label-dependent comparator-selection caveat, a concrete provenance gap in the row schema, a production-population gap from feature 022, and the evaluator’s exact planned call shape. The label source and production accuracy remain unresolved.
- Confidence: High for the comparator, row schema, and planned-call mechanics; medium for what the 40-row sample represents because its raw rows and adjudication records are not present in the visible lineage.

## Reflection

The keep verdict is mechanically correct for the evaluated rows, yet its generalization depends on how the labels and comparator were chosen. The strongest next improvements are stronger candidate recall, a genuine save-outcome corpus, and a low-latency live policy distinct from the three-pass evaluator.

## Recommended Next Focus

Iteration 3: trace candidate-set limits and identify other .skilled judgments that could benefit from semantic choice; then specify a default-on integration with safeguards, cost telemetry, rollout gates, and fallback behavior.
