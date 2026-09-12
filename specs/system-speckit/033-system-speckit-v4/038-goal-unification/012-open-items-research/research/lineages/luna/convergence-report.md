---
title: "Luna lineage convergence and termination report"
session_id: "fanout-luna-1789202042622-4x183m"
lineage: "luna"
---

# Convergence and Termination

stopReason: maxIterationsReached

## Run result

- Configured maximum iterations: `2`
- Iterations completed: `2`
- Convergence threshold: `0.05`
- New-information ratios: `0.92`, `0.78`
- Converged: `false`
- Terminal status: `complete`

The stop reason is the configured cap, not an early convergence decision. The second iteration was
run even though convergence telemetry was available after the first. It supplied one recommendation
for each of the five open items and preserved the exact condition under which the first report would
win.

## Iteration receipts

| Iteration | Route proof | Focus | Findings | newInfoRatio | Receipt |
|---|---|---|---:|---:|---|
| 1 | `mode=research target_agent=deep-research` | Citation audit of the first report | 19 | 0.92 | `iterations/iteration-001.md`, `deltas/iter-001.jsonl` |
| 2 | `mode=research target_agent=deep-research` | Five direct recommendations | 5 | 0.78 | `iterations/iteration-002.md`, `deltas/iter-002.jsonl` |

The route-proof fields are also present in `deep-research-state.jsonl` with
`agent_definition_loaded=true`, and the terminal completion record carries the same
`stopReason: maxIterationsReached`.

## Convergence interpretation

The ratio declined from `0.92` to `0.78`, but the configured threshold is not an instruction to
synthesize before the cap. The remaining differences are policy and ownership questions: width
convention versus width gate, targeted README contract versus generic scan, and provenance-ledger
ownership versus a review-specific rename. They were recorded as `underspecified` or `thin evidence`
where the sources do not settle them.

## Final artifact set

- `deep-research-config.json`
- `deep-research-strategy.md`
- `findings-registry.json`
- `deep-research-dashboard.md`
- `deep-research-state.jsonl`
- `prompts/iteration-1.md`
- `prompts/iteration-2.md`
- `iterations/iteration-001.md`
- `iterations/iteration-002.md`
- `deltas/iter-001.jsonl`
- `deltas/iter-002.jsonl`
- `resource-map.md`
- `research.md`
- `convergence-report.md`
