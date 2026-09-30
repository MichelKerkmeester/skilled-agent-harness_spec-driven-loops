---
title: "system-skill-advisor v0.14.0.0, An Offline Suggested-Order Eval"
description: "A new offline script measures whether a Jev or local Deem order of the advisor's whole near-tie cluster beats the best zero-call order and fits the 2,200 ms advisor budget. Its default run makes no model call."
trigger_phrases:
  - "system-skill-advisor v0.14.0.0"
  - "system-skill-advisor 0.14.0.0"
  - "offline suggested-order eval"
  - "near-tie cluster order"
importance_tier: "normal"
contextType: "general"
version: 0.14.0.0
---

# v0.14.0.0, An Offline Suggested-Order Eval

The advisor can now be measured against a model's order of its whole near-tie cluster, timed inside the same child the prompt hook runs in, without any change to how it routes. A new offline script times the advisor alone first and, only when there is room and only when asked, lets Jev or the local Deem order each cluster under a keep rule fixed before any run.

> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order` (Level 1)

## What's New at a Glance

- **The advisor's own time comes first.** `runtime/scripts/routing-accuracy/score-suggested-order.mjs` reuses the tie-break eval's census and comparators, then runs the built hook for each of the 241 skill-firing prompts in a child spawned like the prompt shim's. One `advisor child:` line reports p50, p95, max and the children past 2,200 ms or killed at 2,500 ms. The default run spawns no model binary.
- **No headroom stops everything.** Below 5 movable rows the run prints `no headroom (movable)`, and with an advisor p95 above 2,200 ms it prints `no headroom (latency)`. Either line stops both arms before any gate or call. Otherwise it prints the planned calls for each arm.
- **Each arm orders the whole cluster.** `--jev` and `--deem` keep their own gates from the tie-break eval. Each asks every eligible row three times, once per rotation of the cluster keys plus `none`, and every call runs in a timed child after the advisor. Either switch needs `--out <dir>`, and without it the script exits 2 before any output.
- **Every verdict follows a rule fixed in advance.** Each column ends in one `keep`, `kill` or `stop (<reason>)` line from coverage, a loss test, a 0.05 mean reciprocal-rank margin over the best zero-call order, a sign test, a flip cap and the child's p95 wall time. `--out <dir>` writes one `calls.jsonl` line per call and a `report.json` with each verdict's fields.

## Upgrade

No migration required. Nothing calls the script, and the advisor routes exactly as before.
