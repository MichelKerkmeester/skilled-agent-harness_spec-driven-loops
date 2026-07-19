---
title: "mcp-tooling — Skill Benchmark Runs"
description: "Lane C (skill-benchmark) run index for the mcp-tooling hub: frozen baseline plus one folder per subsequent run; reports are renderer-owned."
trigger_phrases:
  - "mcp-tooling benchmark"
  - "hub routing benchmark"
  - "skill benchmark baseline"
version: 1.0.0.0
---

# mcp-tooling — Skill Benchmark Runs

> Lane C run storage for the six-mode hub. Report pairs (`skill-benchmark-report.json` + `.md`) are written by the `/deep:skill-benchmark` harness renderer — never hand-edited. Scoring contract: `system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md`.

## Verdict (latest)

| Run | Date | Mode | Verdict | Aggregate | Scenarios | Route gold |
|---|---|---|---|---|---|---|
| `after-routing-remediation/` | 2026-07-16 | Mode A router-replay | **PASS** | 98 | 13 | ENFORCED (auto) — 13 rows, 13 matches, 0 violations |
| `baseline/` | 2026-07-16 | Mode A router-replay | **PASS** | 95 | 13 | not scored (pre-gate harness; routeGoldRows 0) |

Baseline captured with all six modes registered (three workflow + three transports), 6/6 hub_routing holdout coverage, and the post-expansion advisor index (generation 11998).

`after-routing-remediation/` is the first run under the route-gold hard gate (`--route-gold auto`, enforced for hub-type skills): every scenario's `expected_intent` and `expected_resources` scored as hard gold under the fallback-only `defaultResource` contract, 13/13 conformant.

## Structure

- `baseline/` — FROZEN before-snapshot; never regenerated.
- `<run-label>/` — one sibling folder per subsequent run (e.g. `after_router_tuning/`).

## How to re-run

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill mcp-tooling \
  --outputs-dir .opencode/skills/mcp-tooling/benchmark/<run-label> \
  --trace-mode router
```

Mode B (live) additionally needs `SKILL_BENCH_OPENCODE_MODEL` configured; the D5 connectivity gate runs first.
