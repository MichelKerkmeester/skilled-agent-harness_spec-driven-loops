# Deep Research Strategy

## Research Topic

Improve, refine and expand the Jev Pi native classifier transport (cli-jev feature 037). The transport is .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs; it measures whether Jev choice questions reach the model through the Jev CLI or Pi classify(). score-clarify-default.cjs and leaf-route-replay.cjs import it; it is off when JEV_TRANSPORT is unset. Recorded verdict: pi-transport adopt, K=111, M=111, coverage=100.0%, agreement=95.5%, median_abs_dp=0.0100, p95_ms=340/387, cost_per_100=0.0022. It shipped as opt-in in phase 038. Answer five questions: result drivers; accuracy/cost levers; measurement trust; other .skilled opportunities; default-on integration needs, cost, and risk.

## Known Context

- Feature 037 measured 111 baseline rows; all 111 Pi rows were measured. Reported verdict: adopt at coverage 100.0%, agreement 95.5%, median absolute probability delta 0.0100, Pi p95 340 ms versus recorded CLI p95 387 ms, and Pi cost $0.0022 per 100 classifications. The phase 038 spec warns that the CLI comparison came from an older run and a different provider/model pairing. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-67] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:41-50]
- The prompt calls jev-transport.mjs a scorer, while the benchmark README and implementation identify score-pi-transport.mjs as the scorer and jev-transport.mjs as the runtime adapter. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/009-pi-transport-research/spec.md:45-72] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/README.md:7-34] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:4-8]
- The shipped adapter is opt-in and choice-only; its current confirmed imports are the two sk-doc choice-question scripts. [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:29-64] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:24] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:26]
- No resource-map is present in this lineage; resource-map emission is disabled to keep the run self-contained.

## Key Questions

1. What drove the recorded adopt result, and what does it establish?
2. Which changes can improve decision accuracy or reduce transport cost?
3. How can future measurements provide stronger causal and correctness evidence?
4. Where else in .skilled could the same choice-classification judgment pay off?
5. What would default-on integration require, cost, and risk?

## Answered Questions

- [x] Q1 — answered in iteration 1.
- [x] Q2 — answered in iteration 2.
- [x] Q3 — answered in iteration 3.
- [x] Q4 — shortlisted compatible choice call sites in iteration 2; compatibility remains conditional on provider/seam checks.
- [x] Q5 — answered in iteration 3 with cost and rollout caveats.

## What Worked

- Start with the persisted report, scorer gates, and runtime adapter to separate measured evidence from feature description.

## What Failed

- No implementation failure was observed in the recorded report. The benchmark design has attribution and ground-truth limits; investigate before broadening the claim.

## Exhausted Approaches

- No new model calls, network calls, test runs, or live benchmark reruns are in scope; this is source-based research.

## Ruled-Out Directions

- Do not infer “more accurate than CLI” from agreement alone; the report has no independent truth labels.
- Do not generalize from choice questions to arbitrary classifier tasks; the adapter exposes choice-only parsing and payload mapping.

## Next Focus

Synthesis complete at the three-iteration max-iterations cap; carry forward the paired gold-label study, corrected source inventory, provider-preserving route, and canary gate.
