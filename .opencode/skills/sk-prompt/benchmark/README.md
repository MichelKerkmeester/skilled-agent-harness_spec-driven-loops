---
title: "sk-prompt Skill-Benchmark Artifacts"
description: "Benchmark reports for the sk-prompt parent hub, scored by the deep-improvement Lane C harness in router and live modes, plus the compiled-routing archive convention."
trigger_phrases:
  - "sk-prompt benchmark"
  - "sk-prompt skill-benchmark artifacts"
  - "sk-prompt routing benchmark"
importance_tier: "important"
contextType: "general"
---

# sk-prompt Skill-Benchmark Artifacts

> Reports for benchmarking how well the `sk-prompt` parent hub is routed, discovered, and used in practice, kept beside the skill they measure. Each run-label folder holds one run's rendered report pair; this file indexes them.

---

## 1. OVERVIEW

The deep-improvement Lane C skill-benchmark harness benchmarks `sk-prompt` against its own playbook scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). This `benchmark/` tree holds the dual reports each run writes, one run-label folder per run.

Two trace modes score the same corpus:

- **router** is deterministic and offline — it replays `hub-router.json` + `mode-registry.json`. This is the CI gate.
- **live** dispatches each scenario through `cli-opencode` to a real model and grades the model's stated routing plus observed activation.

The rubric, terminal buckets, and pass thresholds are the deep-improvement Lane C **scoring contract's**, not this index's — see section 5. Where a number here and the scoring contract disagree, the scoring contract prevails. A deeper post-merge narrative lives in [`BENCHMARK-SUMMARY.md`](./BENCHMARK-SUMMARY.md).

## 2. RUN-LABEL INDEX

Verdicts are read from each folder's rendered report; see [`BENCHMARK-SUMMARY.md`](./BENCHMARK-SUMMARY.md) for the full per-dimension breakdown.

| Run label | Trace mode | Verdict | Status | Notes |
|---|---|---|---|---|
| [`router-final/`](./router-final/) | router (Mode A, CI gate) | PASS · 100 | current | Canonical deterministic run |
| [`live-final/`](./live-final/) | live (Mode B, `cli-opencode` dispatch) | PASS · 100 | current | Real dispatch confirmed via captured model responses |

## 3. STRUCTURE

```text
benchmark/
+-- router-final/          # Current deterministic run (router mode, the CI gate)
+-- live-final/            # Current live run (cli-opencode dispatch)
+-- BENCHMARK-SUMMARY.md   # Post-merge narrative summary across both runs
`-- compiled-routing/      # Compiled-routing parity archive (see section 6)
```

## 4. READING THE REPORTS

Each run-label folder holds a matched pair:

| File | Content |
|---|---|
| `skill-benchmark-report.json` | Machine report: verdict, D1 to D5, funnel, ranked bottlenecks, scenario rows |
| `skill-benchmark-report.md` | The same report rendered for reading, generated from the JSON by `build-report.cjs` to avoid drift |

Start with the `.md` file for the verdict and the ranked bottlenecks; open the `.json` file for per-scenario detail. The `.md` is an anti-drift render, never hand-edited.

## 5. RELATED RESOURCES

| Document | Purpose |
|---|---|
| [`deep-improvement`](../../system-deep-loop/deep-improvement/SKILL.md) | Owns the Lane C skill-benchmark harness, runner, and scoring |
| [`sk-prompt`](../SKILL.md) | The hub under measurement |
| [`scoring-contract.md`](../../system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md) | The normative Lane C measurement contract every verdict is scored against |
| [`/deep:skill-benchmark`](../../../commands/deep/skill-benchmark.md) | The command that drives a benchmark run |

## 6. COMPILED-ROUTING ARCHIVE

Compiled-routing parity runs archive under `benchmark/compiled-routing/<run-label>/` — a durable, fail-closed sibling of the run-labels above. A run never overwrites another, the active serving manifest gates every archive, and the frozen `baseline` label is never repurposed; new parity evidence uses additive `router-compiled-parity-baseline` / `router-compiled-parity-final` siblings. Each archived pair carries repo-relative provenance (no absolute checkout path), and a joined `serving-snapshot.json` records this hub's live compiled-routing state.

Convention and schema: [`serving-snapshot-schema.md`](../../sk-doc/create-benchmark/references/skill-benchmark/serving-snapshot-schema.md) · storage standard: [`skill-benchmark-storage-guide.md`](../../sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md).
