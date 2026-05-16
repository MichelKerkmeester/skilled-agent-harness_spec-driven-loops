# Iteration 9: D4 Maintainability — Metal Acceleration Regression Risk

## Focus
Assess whether the Option A rebuild of node-llama-cpp from source (commit c2ce9a02e/docs) introduces any behavioral differences compared to the prebuilt binary, specifically around the token budget and context handling paths added in Bug B.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 2
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.10

## Findings

### P2 — Suggestion

- **F021**: Source-build artifacts should produce identical API surface but `trainContextSize` availability depends on build configuration — `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts:229`. The `model.trainContextSize` property is accessed with a fallback of `2048` (line 229: `const trainContextSize = model.trainContextSize ?? 2048`). If the source-built binary exposes `trainContextSize` as `undefined` instead of a number (e.g., on platforms where Metal GPU is not available), the fallback to 2048 is sensible but undocumented. The ADR for llama-cpp Metal (specs 041) records that Option A was chosen (rebuild from source), and the 037 deep-dive confirmed that `model.trainContextSize` is available in node-llama-cpp v3.17.1. The risk is low because the fallback is correct, but the fallback value (2048) should be documented as a configuration constant rather than an inline magic number.

## Assessment
- New findings ratio: 0.10
- Dimensions addressed: maintainability
- Novelty justification: Metal/API surface concern is a new maintainability angle.

## Recommended Next Focus
Stabilization pass: re-verify all dimensions and check for any missed issues.