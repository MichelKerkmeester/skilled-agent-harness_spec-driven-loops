# Iteration 1: Reconstruct the Adopt Result

## Focus

Explain the recorded pi-transport adopt verdict from the benchmark’s actual keep rule and report. Separate what the result shows from what it cannot establish, and check the packet’s component and phase labels against the evidence.

## Findings

1. **The outcome follows three fixed gates.** The scorer requires at least 90% coverage, at least 95% top-choice agreement, and Pi p95 latency no higher than 1.5 times the CLI p95. The judge checks those in that order; cost is printed but does not affect adoption. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:69-74] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1060-1087]
2. **All 111 rows were measured, with 333 calls per arm and no reported timeouts or exclusions.** The report records K=111, M=111, 100% coverage, Pi p95=340 ms and recorded CLI p95=387 ms. At 0.8785×, the reported latency comparison is inside the 1.5× bound. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-29] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:31-54]
3. **Agreement only narrowly clears the threshold.** The reported 95.5% implies 106 of 111 matching top choices (rounded to one decimal); five rows differ. One additional mismatch would mean 105/111, about 94.6%, below the 95% keep rule. This is arithmetic derived from the report’s rounded percentage, not a separately reported count. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:46-67] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:72-74]
4. **The verdict is parity plus operational bounds, not proof of higher correctness.** The benchmark compares the Pi top choice with the CLI top choice; its README says it rebuilds the advisor’s recorded choice questions and asks Pi, and the phase 038 spec says the CLI latency side is the older recorded 019 run. The report also pairs OpenRouter Pi typesafe/jev-1.13 with official CLI jev-1.13.0, so provider/model and time are confounded with transport. No independent labeled answers appear in the report. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/README.md:3-9] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:41-50] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-44]
5. **The reported Pi cost is not a comparative cost result.** Pi reports $0.0022399 per 100 calls, while the CLI cost is null; the scorer’s judge never uses cost. It therefore supports a Pi-side usage estimate, not a claim that Pi is cheaper than the CLI or that cost drove adoption. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:24-26] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:39-44] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1083-1087]
6. **The research packet mislabels both the scorer path and measured phase.** Its scope calls shared/scripts/jev-transport.mjs the scorer and says Phase 047 measured the result. The README and repository place the scorer at benchmark/pi-transport/score-pi-transport.mjs; the cited run is in feature 037, and phase 038 says it adopted feature 037’s verdict. Treat the packet’s “047” and scorer label as metadata/terminology errors; the report supports the metric values independently. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/009-pi-transport-research/spec.md:45-72] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/README.md:7-34] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:41-48]

## Sources Consulted

- Lineage steer.md checked immediately before this iteration; absent.
- specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json, lines 16-67.
- .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs, lines 69-80, 1031-1087, 1112-1155, 1330-1352.
- .skilled/skills/cli-classifier/benchmark/pi-transport/README.md, lines 3-32.
- specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md, lines 41-50.
- specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/009-pi-transport-research/spec.md, lines 45-72.

## Assessment

- newInfoRatio: 1.00
- Novelty justification: First iteration; six distinct findings establish the gate mechanics, report basis, cost boundary, and two documentation contradictions for this lineage.
- Confidence: High for the arithmetic, configured thresholds, and recorded report fields; medium for interpreting the benchmark as parity rather than correctness because no independent label set was found in the inspected benchmark artifacts.

## Reflection

The report and scorer make the threshold path reproducible without rerunning a model. The most important limitation is attribution: this was a cross-provider, cross-version comparison against a recorded CLI arm. Cost was not part of the keep rule. The scope’s scorer and phase references are contradicted by the implementation and artifact paths; this affects navigation and provenance labels, not the independently cited report values.

## Recommended Next Focus

Trace concrete accuracy and cost levers through jev-transport.mjs and the confirmed callers, then identify safe adjacent .skilled candidates by actual request shape.
