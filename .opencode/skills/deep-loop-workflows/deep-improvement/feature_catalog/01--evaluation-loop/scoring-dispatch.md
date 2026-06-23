---
title: "Scoring dispatch"
description: "Dispatches a candidate through scoring, evidence capture, and reducer refresh steps."
trigger_phrases:
  - "scoring dispatch"
  - "score-candidate.cjs"
  - "dispatch candidate scoring"
  - "reducer refresh"
  - "evidence capture"
version: 1.17.0.2
---

# Scoring dispatch

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Dispatches a candidate through scoring, evidence capture, and reducer refresh steps.

This feature covers the handoff from proposal output into the scorer, evidence helpers, and reducer that turn raw iteration results into a reviewable state snapshot.

---

## 2. HOW IT WORKS

Both deep-improvement YAML workflows call `score-candidate.cjs` after a candidate is written, then emit `candidate_scored`, record mutation coverage and dimension trajectory, run replay-stability and trade-off helpers, append packet evidence, and refresh the runtime state with `reduce-state.cjs`. Those steps are explicit shell commands in the YAML files, so the scoring path is not inferred from prose alone.

The benchmark runner exists as a real helper, but the YAML workflows currently describe benchmark execution as an action instead of a concrete `run-benchmark.cjs` command. In practice that means scoring dispatch is fully wired, while benchmark execution still depends on the surrounding operator or wrapper flow to provide the exact benchmark invocation and output set.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_agent-improvement_auto.yaml` | Workflow | Sequences score, mutation coverage, stability, trade-off, ledger, and reduction steps in autonomous mode. |
| `.opencode/commands/deep/assets/deep_agent-improvement_confirm.yaml` | Workflow | Mirrors the dispatch sequence in interactive mode and pauses at review gates. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/score-candidate.cjs` | Scorer | Produces the dynamic 5-dimension score output for a candidate. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Benchmark helper | Scores fixture outputs and optional integration-report inputs when a profile-specific benchmark set exists. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs` | Stability helper | Measures replay stability and emits `insufficientSample` until enough replays exist. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/trade-off-detector.cjs` | Analysis helper | Detects cross-dimension regressions before the reducer refresh. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs` | Reducer | Rebuilds the registry and dashboard after each scored iteration. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/tests/benchmark-stability.vitest.ts` | Automated test | Verifies replay-stability thresholds, warnings, and insufficient-sample handling. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/tests/trade-off-detector.vitest.ts` | Automated test | Verifies trade-off detection thresholds and score-history extraction from journal events. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/model_benchmark/benchmark_operator_guide.md` | Operator reference | Documents the benchmark command shape and evidence expectations that sit beside the scorer output. |

---

## 4. SOURCE METADATA

- Group: Evaluation loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--evaluation-loop/scoring-dispatch.md`
Related references:
- [candidate-generation.md](candidate-generation.md) — Candidate generation
- [promotion-gates.md](promotion-gates.md) — Promotion gates
