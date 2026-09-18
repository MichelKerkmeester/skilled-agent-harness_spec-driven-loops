# Deep Research Dashboard — deepseek lineage

| Field | Value |
|---|---|
| Session | `fanout-deepseek-1789762218897-56yqt6` |
| Executor | `cli-pi` model=deepseek-v4.1-flash (max effort) |
| Topic | Compiled-serving admission after the Lane C parity retirement |
| Spec folder | `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/015-compiled-serving-admission-research` |
| Iterations | 5 / 5 |
| Stop reason | `maxIterationsReached` |
| Questions answered | 5 / 5 |
| Findings | 32 (deltas), 17 registered key findings |
| Ruled-out directions | 7 |
| Avg newInfoRatio | 0.71 (1.00 → 0.85 → 0.80 → 0.55 → 0.35) |
| Recommendation | Path B — new compiled-vs-gold checker as a standing gate; bar restated |
| Operator decision | Accept the restated admission sentence, or demand literal legacy equality |

## Per-Iteration

| # | Focus | Findings | newInfoRatio | Status |
|---|---|---|---|---|
| 1 | Q1 — Lane C parity contract + restore inventory | 8 | 1.00 | complete |
| 2 | Q2 — compiledRoute vs gold feasibility + defer/holdout/negative scoring | 7 | 0.85 | complete |
| 3 | Q3 — Frozen tables, manifest re-mint, guard freshness | 7 | 0.80 | complete |
| 4 | Q4 — Costs and risks of A/B/C | 6 | 0.55 | complete |
| 5 | Q5 — Recommendation + build steps | 4 | 0.35 | complete |

## Key Questions

- [x] KQ-1 — What Lane C measured; restore inventory
- [x] KQ-2 — compiledRoute vs gold as the bar; defer/holdout/negative
- [x] KQ-3 — Admission machinery beyond the check
- [x] KQ-4 — Costs and risks per path
- [x] KQ-5 — Recommendation and build steps

## Knowledge Flags

- Topology drift flagged: docs say seven hubs, live cohort is five (7→6→5).
- Drift-gate absence flagged: nothing compares compiled to legacy since retirement.
- Unowned step flagged: no CLI flips `servingAuthority` to `compiled`.
