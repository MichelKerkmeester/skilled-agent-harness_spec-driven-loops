---
title: "mcp-tooling. Skill Benchmark Runs"
description: "Lane C (skill-benchmark) run index for the mcp-tooling hub: frozen baseline plus one folder per subsequent run; reports are renderer-owned."
trigger_phrases:
  - "mcp-tooling benchmark"
  - "hub routing benchmark"
  - "skill benchmark baseline"
version: 1.0.0.0
---

# mcp-tooling. Skill Benchmark Runs

> Archive status: the Lane C harness that produced these reports was retired with the skill-benchmark lane, so none of them can be re-run from the current tree. They stay as frozen historical evidence.

## 1. OVERVIEW

The deep-improvement Lane C skill-benchmark harness benchmarks `mcp-tooling`, a seven-mode hub (four workflow modes, including mcp-obsidian, plus three transports), across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). This `benchmark/` tree holds one run-label folder per run; the sections below index them.

---

## 2. VERDICT (LATEST)

| Run | Date | Mode | Verdict | Aggregate | Scenarios | Route gold |
|---|---|---|---|---|---|---|
| `after-routing-remediation/` | 2026-07-16 | Mode A router-replay | **PASS** | 98 | 13 | ENFORCED (auto), 13 rows, 13 matches, 0 violations |
| `baseline/` | 2026-07-16 | Mode A router-replay | **PASS** | 95 | 13 | not scored (pre-gate harness; routeGoldRows 0) |

Baseline captured before mcp-obsidian was registered: six modes (three workflow + three transports), 6/6 hub_routing holdout coverage, and the post-expansion advisor index (generation 11998). The current hub has seven modes: four workflows plus three transports.

`after-routing-remediation/` is the first run under the route-gold hard gate (`--route-gold auto`, enforced for hub-type skills): every scenario's `expected_intent` and `expected_resources` scored as hard gold under the fallback-only `defaultResource` contract, 13/13 conformant.

---

## 3. STRUCTURE

- `baseline/`: FROZEN before-snapshot; never regenerated.
- `<run-label>/`: one sibling folder per subsequent run (e.g. `after_router_tuning/`).

---

## 4. COMPILED-ROUTING ARCHIVE

Compiled-routing parity runs archive under `benchmark/compiled-routing/<run-label>/`: a durable, fail-closed sibling of the run-labels above. A run never overwrites another, the active serving manifest gates every archive, and the frozen `baseline` label is never repurposed; new parity evidence uses additive `router-compiled-parity-baseline` / `router-compiled-parity-final` siblings. Each archived pair carries repo-relative provenance (no absolute checkout path), and a joined `serving-snapshot.json` records this hub's live compiled-routing state.

