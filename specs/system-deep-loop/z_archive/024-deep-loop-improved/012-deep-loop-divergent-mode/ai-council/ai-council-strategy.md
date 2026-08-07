---
title: "AI Council Strategy: Divergent Convergence Mode"
description: "Depth-1 native OpenCode deliberation for divergent pivots in research and review."
created_at: "2026-07-10T09:43:07.977Z"
---
# AI Council Strategy: Divergent Convergence Mode

## Purpose
Resolve decisions A-H for an opt-in `convergenceMode: divergent` modifier while preserving research/review ownership, hard stops, append-only state, and existing mode behavior.

## Task Framing
Translate only an eligible post-gate legal STOP into a non-terminal scope-expansion pivot. Do not create a workflowMode, runtimeLoopType, command, skill, or agent.

## Selected Seats
1. Analytical Architecture — smallest control-flow and state-machine design.
2. Critical Reliability — resume, quorum, collisions, recursion, scope, verdict locks, hard stops.
3. Pragmatic Integration — minimal surfaces, propagation, parity, reducers, synthesis, tests.

## Execution
Depth 1 via sequential_thinking; current native OpenCode runtime only; no external CLI or sub-agent.

## Evidence Inputs
- `runtime/scripts/convergence.cjs:46,177-237,693-742`
- `deep_research_auto.yaml:296-347,485-727`
- `deep_research_confirm.yaml:300-350,479-645`
- `deep_review_auto.yaml:519-724`
- `deep_review_confirm.yaml:487-697`
- Configs, reducers, strategy templates, multi-seat dispatch, cost guards, Council persistence.

## Convergence Rule
All three seats return; two-of-three agree materially; cross-critique leaves no high-severity blocker.

## Constraints
Planning only; packet-local `ai-council/**` writes only. Hub, mode registry, and hub router remain logic-free and byte-unchanged. Compiled command contracts remain generated projections. Pin no-regression fixtures for default/off/sliding-window.
