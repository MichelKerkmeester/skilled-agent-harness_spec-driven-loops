---
title: "sk-doc Skill-Benchmark Artifacts"
description: "Benchmark tree for the sk-doc parent hub, scored by the deep-improvement Lane C harness, plus the compiled-routing archive convention. No Lane C run is archived here yet."
trigger_phrases:
  - "sk-doc benchmark"
  - "sk-doc skill-benchmark artifacts"
  - "sk-doc routing benchmark"
importance_tier: "important"
contextType: "general"
---

# sk-doc Skill-Benchmark Artifacts

> Reports and inputs for benchmarking how well the `sk-doc` parent hub is routed, discovered, and used in practice, kept beside the skill they measure. Each run-label folder holds one run's rendered report pair; this file indexes them.

> Archive status: the Lane C harness that produced these reports was retired with the skill-benchmark lane, so none of them can be re-run from the current tree. They stay as frozen historical evidence.

---

## 1. OVERVIEW

The retired deep-improvement Lane C skill-benchmark harness benchmarked `sk-doc` against its own playbook scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). This `benchmark/` tree holds the dual reports each run wrote, one run-label folder per run.

Two trace modes scored the same corpus:

- **router** was deterministic and offline: it replayed `hub-router.json` + `mode-registry.json`. It was the CI gate.
- **live** dispatched each scenario through `cli-opencode` to a real model and graded the model's stated routing plus observed activation.

The rubric, terminal buckets and pass thresholds came from the Lane C scoring contract, which was retired with the lane, not from this index.

---

## 2. RUN-LABEL INDEX

No Lane C skill-benchmark run was archived for `sk-doc` before the lane was retired, so no run-label row exists.

| Run label | Trace mode | Verdict | Status | Notes |
|---|---|---|---|---|
| _(none archived yet)_ | — | — | — | First run adds the first row |

---

## 3. RELATED RESOURCES

| Document | Purpose |
|---|---|
| [`sk-doc`](../SKILL.md) | The hub under measurement |

---

## 4. COMPILED-ROUTING ARCHIVE

Compiled-routing parity runs archive under `benchmark/compiled-routing/<run-label>/`: a durable, fail-closed sibling of the run-labels above. A run never overwrites another, the active serving manifest gates every archive, and the frozen `baseline` label is never repurposed; new parity evidence uses additive `router-compiled-parity-baseline` / `router-compiled-parity-final` siblings. Each archived pair carries repo-relative provenance (no absolute checkout path), and a joined `serving-snapshot.json` records this hub's live compiled-routing state.

