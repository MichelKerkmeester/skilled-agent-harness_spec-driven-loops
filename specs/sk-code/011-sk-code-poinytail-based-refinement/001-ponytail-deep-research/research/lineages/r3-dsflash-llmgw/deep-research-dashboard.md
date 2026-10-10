---
title: "Deep Research Dashboard — sk-code round three (r3-dsflash-llmgw lineage)"
description: "Auto-generated round-three lineage dashboard: iteration telemetry, classification roll-up and the part map."
trigger_phrases: []
---

# Deep Research Dashboard

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-dashboard | v1.1 -->

## Run

| Field | Value |
|---|---|
| Lineage | `r3-dsflash-llmgw` (detached fan-out, round three) |
| Run id | `fanout-r3-dsflash-llmgw-1791620340322-xkjyb6` |
| Executor | `cli-pi` · `deepseek-v4.1-flash` · effort `max` |
| Stop policy | `max-iterations`, cap 20, convergence threshold 0.05 (telemetry only) |
| Terminal reason | `maxIterationsReached` (20/20); threshold never approached, no convergence claimed |
| Iterations | 20 |
| Findings | 73 (8 P1, 65 P2) |

## Iteration telemetry

| # | Focus | Findings | newInfoRatio |
|---|---|---|---|
| 1 | Shared-layer inventory and reachability | 4 | 0.88 |
| 2 | Shared reference consistency and stale path families | 4 | 0.87 |
| 3 | Shared workflow doctrine against the repository rules | 4 | 0.88 |
| 4 | Surface overrides, detection edges, and registry vocabulary | 5 | 0.90 |
| 5 | Override inventory close and cross-surface rule divergence | 4 | 0.83 |
| 6 | Review mode detection and surface vocabulary | 4 | 0.88 |
| 7 | Review mode internal agreement | 4 | 0.88 |
| 8 | Checklist severity models and the review agent | 3 | 0.80 |
| 9 | The review playbook against the files it tests | 3 | 0.85 |
| 10 | Review scripts on crafted inputs | 3 | 0.90 |
| 11 | Review integration and strengthening proposals (Part 2 close) | 3 | 0.80 |
| 12 | sk-code-quality fresh pass | 4 | 0.85 |
| 13 | sk-code-webflow fresh pass | 4 | 0.85 |
| 14 | sk-code-opencode fresh pass | 4 | 0.75 |
| 15 | sk-code-obsidian fresh pass | 3 | 0.70 |
| 16 | The hub files against each other | 3 | 0.75 |
| 17 | benchmark, feature-catalog and the root playbook | 3 | 0.75 |
| 18 | Refutation checks, the hub README, and a mid-run file change | 4 | 0.80 |
| 19 | Last unread corners and the ideas inventory | 4 | 0.85 |
| 20 | Consolidation pass | 3 | 0.70 |

- Mean newInfoRatio: 0.82; minimum 0.70, maximum 0.90.

## Classification roll-up

- **NEW:** 50 findings (50 actionable across the three parts plus cross-cutting rows).
- **ALREADY-ADOPTED:** 18 verification rows, no action.
- **IN-FLIGHT:** 3 phase-009 items, recorded only.
- **OBSERVATION:** 2 (the mid-run quality landing and the refutation pass).

## Part map

| Part | Iterations | Headline |
|---|---|---|
| 1 — shared layer and loaders | 1-5 | Stale path families, phase-detection staleness, the validate.sh contradiction, the duplicate pattern assets |
| 2 — sk-code-review and its agent | 6-11 | Foreign-repo detector misrouting, no Obsidian, the vacuous findings checker, the cache path, the shape split |
| 3 — other modes, hub files, tooling | 12-19 | Legacy hook naming, rename-miss packets, phantom assets, universal-tier overclaim, README drift |
| Consolidation and refutation | 18-20 | Mid-run change recorded; earliest premises re-checked; cross-cutting root cause stated |

## Stop

- `stopReason: maxIterationsReached`; synthesis in `research.md`; registry in `findings-registry.json`.
