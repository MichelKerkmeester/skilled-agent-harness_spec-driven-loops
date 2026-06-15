---
title: "agent-improvement: Lane A Scripts"
description: "Lane A (agent-improvement) scoring, profiling, lineage, and integration scripts for the deep-improvement skill."
trigger_phrases:
  - "lane a agent-improvement scripts"
  - "score-candidate"
  - "generate-profile"
---

# agent-improvement: Lane A Scripts

---

## 1. OVERVIEW

`agent-improvement/` holds the Lane A (agent-improvement) scripts. Lane A evaluates and improves an agent file: it builds a dynamic profile of the target agent, scores a candidate across five dimensions, scans integration surfaces, and produces lineage, drift, trade-off, and stability reporting.

Current state:

- `score-candidate.cjs` is the lane entrypoint. `shared/loop-host.cjs` spawns it in agent-improvement mode.
- `score-candidate.cjs` spawns `scan-integration.cjs` and `generate-profile.cjs` per scored candidate.
- All files import shared helpers from `../lib/` (`typed-errors.cjs`, `promotion-gates.cjs`).
- `candidate-lineage.cjs`, `trade-off-detector.cjs`, and `benchmark-stability.cjs` are library modules with named exports, not CLI entrypoints.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                      agent-improvement (Lane A)                    │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────┐      ┌──────────────────────────┐
│ shared/loop-host │ ───▶ │ score-candidate.cjs      │
│ (agent-improve)  │      │ (lane entrypoint)        │
└──────────────────┘      └────────────┬─────────────┘
                                        │ spawns (execFileSync node)
                          ┌─────────────┴─────────────┐
                          ▼                           ▼
                ┌────────────────────┐      ┌────────────────────┐
                │ generate-profile   │      │ scan-integration   │
                │ (derivedChecks)    │      │ (mirror/command/   │
                └─────────┬──────────┘      │  skill surfaces)   │
                          │                 └────────────────────┘
                          ▼
                ┌────────────────────┐
                │ ../lib/*           │
                │ typed-errors       │
                │ promotion-gates    │
                └────────────────────┘

Dependency direction: loop-host ───▶ score-candidate ───▶ generate-profile + scan-integration ───▶ ../lib
```

---

## 3. DIRECTORY TREE

```text
agent-improvement/
+-- score-candidate.cjs       # Lane entrypoint: dynamic 5-dimension scorer
+-- generate-profile.cjs      # Builds derivedChecks profile from an agent file
+-- scan-integration.cjs      # Scans mirror, command, skill, doc surfaces
+-- candidate-lineage.cjs     # Library: candidate derivation graph
+-- trade-off-detector.cjs    # Library: cross-dimension regression detection
+-- benchmark-stability.cjs   # Library: score variance + weight advisory
+-- check-mirror-drift.cjs    # CLI: canonical-to-mirror drift report
+-- rollback-candidate.cjs    # CLI: restore canonical target from backup
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `score-candidate.cjs` | Lane entrypoint. Reads candidate (and optional baseline), spawns `generate-profile.cjs` and `scan-integration.cjs`, scores structural, ruleCoherence, integration, outputQuality, and systemFitness dimensions, applies weights and promotion gates, caches by input hash, and emits a `scored` result with `mode: 'agent-improvement'`. |
| `generate-profile.cjs` | Parses an agent file into a profile with `derivedChecks` (structural sections, rule coherence, output checks, anti-patterns, integration points, capability mismatches). CLI: `--agent=<path>` with optional `--output` and `--state-dir`. |
| `scan-integration.cjs` | Scans the four runtime mirrors, commands, YAML workflows, skills, global docs, and the skill advisor for an agent name. CLI: `--agent=<name>` with optional `--repo-root` and `--output`. Emits `status: 'complete'` with `surfaces` and `summary`. |
| `candidate-lineage.cjs` | Library exports (`createLineageGraph`, `recordCandidate`, `getLineage`, `getChildren`, and related) tracking candidate derivation across parallel waves by content hash. |
| `trade-off-detector.cjs` | Library exports (`detectTradeOffs`, `getTrajectory`, `checkParetoDominance`) flagging cross-dimension regressions using hard and soft dimension thresholds. |
| `benchmark-stability.cjs` | Library exports (`measureStability`, `stabilityCoefficient`, `generateWeightRecommendations`, and related) reporting score variance and weight-optimization advisories. |
| `check-mirror-drift.cjs` | CLI reporting drift between a canonical agent body and its mirrors. Args include `--output`, `--canonical`, `--mirrors`, `--manifest`. |
| `rollback-candidate.cjs` | CLI restoring the single canonical manifest target from a backup. Args include `--target`, `--backup`, `--config`, `--manifest`. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | May import `../lib/*` (`typed-errors.cjs`, `promotion-gates.cjs`). `score-candidate.cjs` spawns sibling `generate-profile.cjs` and `scan-integration.cjs` as child processes. |
| Exports | `candidate-lineage.cjs`, `trade-off-detector.cjs`, and `benchmark-stability.cjs` expose named module exports. `score-candidate.cjs`, `generate-profile.cjs`, `scan-integration.cjs`, `check-mirror-drift.cjs`, and `rollback-candidate.cjs` run `main()` as CLI entrypoints. |
| Ownership | Lane A owns agent-file evaluation and improvement. Lane B model-benchmark scripts live in `../model-benchmark/`. Cross-lane and shared scripts live in `../shared/`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ shared/loop-host (agent-improvement mode) │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ score-candidate.cjs --candidate=<path>   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ generate-profile.cjs + scan-integration  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ 5-dimension scoring + promotion gates     │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ scored result (JSON, mode=agent-improve)  │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `score-candidate.cjs` | CLI | Lane entrypoint. `--candidate=<path> [--baseline=<path>] [--output=<path>]`. |
| `generate-profile.cjs` | CLI | `--agent=<path> [--output=<path>] [--state-dir=<path>]`. |
| `scan-integration.cjs` | CLI | `--agent=<name> [--repo-root=.] [--output=<path>]`. |
| `check-mirror-drift.cjs` | CLI | `--output=... [--canonical=...] [--mirrors=a,b,c] [--manifest=...]`. |
| `rollback-candidate.cjs` | CLI | `--target=... --backup=... --config=... --manifest=...`. |
| `candidate-lineage.cjs` | Module | Lineage graph helpers. |
| `trade-off-detector.cjs` | Module | Trade-off and Pareto helpers. |
| `benchmark-stability.cjs` | Module | Stability and weight advisory helpers. |

---

## 7. VALIDATION

Run from the repository root.

```bash
node .opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/generate-profile.cjs --agent=.opencode/agents/code.md
```

Expected result: JSON profile with a `derivedChecks` block printed to stdout.

```bash
npx vitest run --config .opencode/skills/deep-loop-workflows/deep-improvement/scripts/vitest.config.mjs
```

Expected result: the lane vitest suites pass.

---

## 8. RELATED

- [`scripts/README.md`](../README.md)
- [`lib/README.md`](../lib/README.md)
- [`shared/README.md`](../shared/README.md)
- [`model-benchmark/README.md`](../model-benchmark/README.md)
