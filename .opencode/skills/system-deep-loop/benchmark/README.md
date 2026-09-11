---
title: "system-deep-loop Benchmark Artifacts"
description: "Frozen benchmark reports for system-deep-loop, scored against the hub's manual_testing_playbook by the retired deep-improvement benchmark harness."
trigger_phrases:
  - "deep-loop benchmark"
  - "system-deep-loop routing benchmark"
  - "deep-loop hub benchmark baseline"
---

# system-deep-loop Benchmark Artifacts

> Reports for benchmarking how well `system-deep-loop` is routed, discovered, and used in practice, kept beside the skill they measure.

> Archive status: the deep-improvement harness that scored these reports was retired together with its improvement lane, so nothing here can be regenerated from the current tree. Every report below is frozen historical evidence. This `benchmark/README.md` index template and the run-label storage standard stay owned by [`sk-doc/sk-create-benchmark`](../../sk-doc/sk-create-benchmark/SKILL.md) §10; each per-run report was renderer-owned and never templated.

---

## 1. OVERVIEW

The retired deep-improvement benchmark harness scored `system-deep-loop` against its own `manual_testing_playbook` scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). Two trace modes scored the same corpus:

- **router**: deterministic and offline: replayed `hub-router.json` + `mode-registry.json` per scenario. This was the CI gate and the mode used for the baseline here.
- **live**: dispatched each scenario through `cli-opencode` to a real model and graded stated routing plus observed activation. It was the operator default for a true routing verdict, and the only mode that scored D1-inter (advisor), D4, and the browser-class scenarios.

Note: the harness lived inside this hub, so `system-deep-loop` was scored by the same tooling every other hub used; there was no special-casing.

### Key Statistics

| Metric | Value |
|---|---|
| Corpus | system-deep-loop `manual_testing_playbook` (20 scenarios across 5 categories) |
| Baseline verdict | CONDITIONAL · aggregate 71/100 (router mode) |
| Scenario outcomes | 16/16 scored routing scenarios passed; 4 MR (mode-routing) scenarios are browser-class and route out to live mode |
| D1 intra (router) | 100/100 |
| D2 discovery | 100/100 |
| D5 connectivity (hard gate) | 100/100 (every `hub-router.json` router resource resolves on disk; no orphaned vocabulary classes) |

### Known measurement gaps in this baseline

- **D3 efficiency scored 6/100 in router mode** for this corpus: a Mode-A measurement gap, not a routing failure: every routing scenario passed its replay. Treat D3 movement as meaningful only between runs of the same mode and corpus shape.
- **D1-inter and D4 are unscored** in router mode by design; they needed live mode.
- **The four MR mode-routing scenarios routed out to browser class** by the harness `classifyKind` heuristic (the `MR` prefix was treated as browser-class, matching how every hub's `MR-*` scenarios behaved). They were scored only in live mode; the router aggregate was computed over the 16 text-scorable scenarios.

---

## 2. RUN-LABEL INDEX

Every run-label folder on disk holds one run's rendered report pair: a machine-readable JSON record and its rendered markdown. One row per folder; verdicts are read from each folder's report and are not restated as a rubric here.

| Run label | What it is | Verdict/Status | Evidence |
|---|---|---|---|
| [`baseline/`](./reports/baseline/) | Frozen pre-optimization snapshot, router mode: the before-comparison anchor described in §1 | CONDITIONAL · 71 (router) | [report](./reports/baseline/README.md) |

---

## 3. RE-RUNNING

There is no re-run path. The harness that produced these reports was retired together with its improvement lane, so no run in this folder can be reproduced from the current tree. Its D5 connectivity gate ran first and hard-failed a run on structural breaks, which is why every archived verdict here already carries a resolved connectivity score.

Any future benchmark evidence for this hub belongs in a sibling run-label folder (e.g. `after/`, `live/`) rather than on top of `baseline/`: the baseline stays the frozen comparison anchor.

---

## 4. COMPILED-ROUTING ARCHIVE

Compiled-routing parity runs archive under `benchmark/compiled-routing/<run-label>/`: a durable, fail-closed sibling of the run-labels above. A run never overwrites another, the active serving manifest gates every archive, and the frozen `baseline` label is never repurposed; new parity evidence uses additive `router-compiled-parity-baseline` / `router-compiled-parity-final` siblings. Each archived pair carries repo-relative provenance (no absolute checkout path), and a joined `serving-snapshot.json` records this hub's live compiled-routing state.

Convention, schema, and storage standard: [`sk-doc/sk-create-benchmark`](../../sk-doc/sk-create-benchmark/SKILL.md) §10.
