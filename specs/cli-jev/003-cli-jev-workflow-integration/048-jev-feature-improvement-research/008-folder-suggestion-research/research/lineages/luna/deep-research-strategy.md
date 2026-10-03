# Deep Research Strategy — Luna lineage

## Topic

Improve, refine and expand the Jev spec-folder suggestion (cli-jev feature 022), covering the measured scorer result, accuracy and cost, measurement trust, reuse elsewhere in .skilled, and default-on integration requirements, costs, and risks.

## Key Questions

1. Which scorer, corpus, baseline, and label properties explain the observed Jev keep result?
2. Which changes can improve suggestion quality or reduce inference and runtime cost?
3. What evidence and protocol changes would make future measurements reproducible and trustworthy?
4. Which other .skilled decisions are plausible beneficiaries of semantic judgment?
5. What controls, evidence, cost envelope, and rollout gates should a default-on integration require?

## Known Context

- The active packet scopes research to feature 022 and provides the measured result in spec.md:72.
- Scorer: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts; production checks live in .skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts.
- Save routing lives in .skilled/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts.
- Feature 022 and its measurement constraints are described in the packet specs for features 022 and 047.
- The checked-in resource map is absent, so no resource-map coverage gate is available.
- Write surface is this Luna lineage only. Do not run the scorer or alter its code; research and cite existing evidence.

## Boundaries

- Three iterations, minimum three, stop policy max-iterations, convergence threshold 0.05, default convergence mode.
- No executor dispatch: execute each research iteration inline.
- No writes outside this lineage; no parent packet writeback, validation, git mutation, or context generator.
- Every material finding needs file:line evidence; label measured inputs separately from inspected source evidence and inference.

## What Worked

- Source tracing tied the supplied counters to the scorer rules and separated observed mechanics from causal hypotheses.
- The second pass exposed comparator-selection and label-provenance requirements and bounded evaluator call volume from the code.

## What Failed

- The passes have no ablation or held-out sample, so they cannot establish why Jev won or how broadly the result generalizes.
- Raw fixture labels and per-call logs are not present in the visible lineage materials, leaving their adjudication and observed runtime unconfirmed.

## Next Focus

Iteration 3: trace candidate-set limits and identify other .skilled judgments that could benefit from semantic choice; then specify a default-on integration with safeguards, cost telemetry, rollout gates, and fallback behavior.
