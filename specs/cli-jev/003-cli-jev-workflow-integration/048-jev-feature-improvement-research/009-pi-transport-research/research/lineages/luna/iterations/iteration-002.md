# Iteration 2: Improve the Choice Path and Find Compatible Callers

## Focus

Trace the runtime adapter’s request/result contract, fallback and provider behavior. Identify cost controls and shortlist only other .skilled call sites that actually send choice requests.

## Findings

1. **The adapter is a deliberately narrow seam.** It routes only a recognized choice command shape to Pi, preserves caller state as request context, and passes option descriptions in submitted order. Unknown flags and non-choice invocations remain on the CLI. This supports reuse where callers already have that shape, not blanket replacement of every Jev call. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:71-80] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:87-138] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:331-338]
2. **Provider intent needs an explicit compatibility rule before widening or defaulting.** The parser consumes --provider but discards its value, while the Pi route is fixed to OpenRouter and typesafe/jev-1.13. A caller that requests another provider could silently receive a different backend if Pi is enabled. Preserve the CLI route for unsupported or explicitly different providers, or add an explicit allowlisted mapping and report the resolved backend. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:32-36] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:87-93] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:356-370]
3. **The current answer contract catches incomplete results but leaves quality checks to measurement.** It rejects a choice outside the submitted keys and requires a finite probability for every key. It does not itself bound values to [0,1], check their sum, or check whether the selected choice matches the largest probability. Add diagnostics for these conditions and define tie handling before treating such outputs as valid; do not label those checks as accuracy without human or adjudicated truth labels. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:141-172]
4. **Fallback keeps callers operational but can add work on failure.** Missing Pi package/model/credential, classifier error, timeout, or unmappable result falls back to the CLI. The adapter makes one Pi classify call under the caller timeout and has no retry inside it; a failed Pi attempt followed by CLI can still add both request cost and elapsed time. Track success/fallback reason and total end-to-end latency, not only successful Pi latency. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:325-395] [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:48-64]
5. **The current measured cost is small but one-sided.** The live replay makes 333 Pi calls for 111 rows because each planned choice is evaluated across three rotations; this is appropriate for option-order robustness, but an exploratory screen could use one randomized order and reserve three rotations for confirmation. Production transport performs one Pi classify call per eligible choice, and falls back only after a Pi gate/error; no CLI unit-cost comparison exists, so cost savings are unknown. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:575-599] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-26] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:373-395]
6. **The best near-term reuse candidates are other real choice scorers.** Highest fit is system-skill-advisor’s score-suggested-order, whose source shape is the benchmark’s own choice replay. Further candidates are score-jev-tiebreak, system-spec-kit’s score-track-narrowing and score-debug-next-check, and system-deep-loop’s score-verdict-fallback and score-severity-replay. Their cited loops build choice arguments; each still needs a provider check, an adapter-compatible stdin/timeout seam, and stub-backed parity tests. The two existing imports remain the only confirmed transport callers. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs:454-467] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs:1002-1011] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1324-1333] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs:730-739] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:775-785] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs:1067-1074] [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:72-80]
7. **Do not extend to noul or score from these examples.** Feature 038 records some mixed-question callers, but the shipped adapter and measured benchmark are choice-only. Every other question type needs its own request mapping and independent evaluation. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:99-104] [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:41-46]
8. **The candidate inventory has an internal count conflict.** Feature 038 says its grep found 21 direct-spawn script files while the owner breakdown names 20. Its follow-up table shows 13 examples. Treat that table as a shortlist, not a complete census, and rerun a reproducible read-only inventory before planning broad wiring. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:106-124]

## Sources Consulted

- Lineage steer.md checked immediately before this iteration; absent.
- .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs, lines 32-36, 59-65, 71-173, 325-395.
- .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md, lines 29-80.
- .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs, line 24.
- .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs, line 26.
- .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs, lines 575-599.
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs, lines 454-467.
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs, lines 1002-1011.
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs, lines 1324-1333.
- .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs, lines 730-739.
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs, lines 775-785.
- .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs, lines 1067-1074.
- specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md, lines 99-124.

## Assessment

- newInfoRatio: 0.80
- Novelty justification: This pass adds runtime contract and failure-cost mechanics, a provider-mismatch hazard, concrete output-validation opportunities, six source-verified choice callers, and a second internal inventory discrepancy.
- Confidence: High for adapter behavior and cited choice call shapes; medium for each candidate’s practical compatibility because provider values, caller-specific timeout expectations, and full tests were not examined.

## Reflection

The adapter gives a useful reuse seam for compatible choice callers, but provider handling is the blocker to broad routing: the requested CLI provider is discarded and Pi is fixed. Fallback protects output availability while obscuring total failure-path cost unless it is measured. The candidate list is intentionally conditional; feature 038’s inconsistent inventory count prevents an exact census claim.

## Recommended Next Focus

Design a paired, truth-labeled measurement that isolates transport, then weigh default-on controls against provider drift, fallback cost, and the current evidence gap.
