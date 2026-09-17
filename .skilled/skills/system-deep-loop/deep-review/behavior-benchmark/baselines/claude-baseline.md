---
title: "deep-review Behavior Benchmark — Claude Baseline"
description: "Per-scenario Claude-leg baseline checkpoints and classifications for the RVB scenario set. Single-sample capture; budgets and D5 latency ratios for measured legs derive from these values."
trigger_phrases:
  - "deep review claude baseline"
  - "RVB baseline checkpoints"
  - "behavior benchmark baseline"
importance_tier: "high"
contextType: "implementation"
---

# deep-review Behavior Benchmark — Claude Baseline

## Baseline Table

| Scenario | tFirstOutput | tSetup | tFirstDispatch | tTerminal | Classification |
|---|---|---|---|---|---|
| RVB-001 | 1.6s | 19.1s | 474.6s | 1500.6s | timeout_latency |
| RVB-002 | 2.1s | 21.3s | n/a | 74.0s | pass |
| RVB-003 | 1.7s | 192.2s | n/a | 522.7s | pass |
| RVB-004 | 2.0s | 30.1s | n/a | 112.9s | pass |
| RVB-005 | 1.6s | n/a | 70.0s | 344.2s | missing_artifact |
| RVB-006 | 2.0s | 26.3s | n/a | 75.6s | pass |
| RVB-007 | 2.0s | 16.0s | 327.0s | 1338.5s | pass |
| RVB-008 | 1.3s | 34.2s | 70.5s | 1403.3s | pass |

## Capture Provenance

- **Date**: 2026-07-02
- **Leg**: `claude-cli` (`claude` v2.1.198, `-p --output-format stream-json --verbose --dangerously-skip-permissions`)
- **Sampling**: single-sample per cell (rerun policy applies; RVB-001 effectively had three attempts, all long-running — see notes)
- **Host confound (stated per the framework)**: the baseline runs a different host binary than the opencode legs, so host overhead (session bootstrap, hook wiring) is folded into every latency ratio derived from these values.

## Notes

- **RVB-001 is a long-tail cell**: three attempts (one watchdog-killed while progressing, one 15-minute budget exhaustion, one full 25-minute budget exhaustion) all showed correct routing/delegation (markers matched, real dispatch, route proofs) without reaching a natural terminal. Its tTerminal is the budget ceiling; D5 ratios against it are LOWER BOUNDS. By contrast RVB-007 (all dimensions) completed naturally at 22.3 minutes — run-to-run variance on this leg is large.
- **RVB-005 `missing_artifact`** reflects an inline-reporting hand-off (dims 2/2/2/1, two real dispatches): the taxonomy's artifact expectation should be contract-declared rather than inferred; retained as a scoring-nuance datum.
- **Four harness calibrations landed during capture** (all shipped in the shared runner/framework before these values were finalized): flagged-regex presentation markers; per-scenario watchdog windows and budget tiers for delegating cells; structured dispatch detection (claude subagent tool_use blocks — tool name "Agent" — instead of loose keyword matching, which false-positived on file contents); and a reset+checkout+clean fixture restore (staged-file contamination from concurrent sessions defeated checkout+clean alone).
