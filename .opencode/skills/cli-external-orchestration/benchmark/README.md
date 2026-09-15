---
title: "cli-external-orchestration Skill-Benchmark Artifacts"
description: "Historical benchmark tree for the cli-external-orchestration parent hub, whose Lane C skill-benchmark reports are frozen, plus the compiled-routing archive convention."
trigger_phrases:
  - "cli-external-orchestration benchmark"
  - "cli-external-orchestration skill-benchmark artifacts"
  - "cli orchestration routing benchmark"
importance_tier: "important"
contextType: "general"
---

# cli-external-orchestration Skill-Benchmark Artifacts

> Reports and inputs for benchmarking how well the `cli-external-orchestration` parent hub is routed, discovered, and used in practice, kept beside the skill they measure. Each run-label folder holds one run's rendered report pair; this file indexes them.

> **Retired lane:** the Lane C skill-benchmark harness, its runner, its scoring contract and the `/deep:skill-benchmark` command were removed. No skill-benchmark report was archived in this tree, and no new run can be started from it.

---

## 1. OVERVIEW

The retired deep-improvement Lane C skill-benchmark harness benchmarked `cli-external-orchestration` against its own playbook scenarios across five dimensions (D1 routing, D2 discovery, D3 efficiency, D4 usefulness, D5 connectivity). This `benchmark/` tree holds the dual reports each archived run wrote, one run-label folder per run.

Two trace modes score the same corpus:

- **router** is deterministic and offline: it replays `hub-router.json` + `mode-registry.json`. This is the CI gate.
- **live** dispatches each scenario through `cli-opencode` to a real model and grades the model's stated routing plus observed activation.

---

## 2. RUN-LABEL INDEX

No Lane C skill-benchmark run was archived for `cli-external-orchestration` before the lane was removed, so no run-label row exists. The compiled-routing archive in section 5 is the live content of this tree.

| Run label | Trace mode | Verdict | Status | Notes |
|---|---|---|---|---|
| _(none archived)_ | — | — | — | The lane was removed before a first run landed |

---

## 3. RE-RUNNING

There is no re-run path. The Lane C harness that produced skill-benchmark reports was removed, and `loop-host.cjs` now accepts only the surviving `agent-improvement` and `model-benchmark` modes. New compiled-routing evidence is archived under the convention in section 5 instead.

---

## 4. RELATED RESOURCES

| Document | Purpose |
|---|---|
| [`deep-improvement`](../../system-deep-loop/deep-improvement/SKILL.md) | Owns the surviving improvement lanes (agent-improvement, model-benchmark) |
| [`cli-external-orchestration`](../SKILL.md) | The hub under measurement |

---

## 5. COMPILED-ROUTING ARCHIVE

Compiled-routing parity runs archive under `benchmark/compiled-routing/<run-label>/`: a durable, fail-closed sibling of the run-labels above. A run never overwrites another, the active serving manifest gates every archive, and the frozen `baseline` label is never repurposed; new parity evidence uses additive `router-compiled-parity-baseline` / `router-compiled-parity-final` siblings. Each archived pair carries repo-relative provenance (no absolute checkout path), and a joined `serving-snapshot.json` records this hub's live compiled-routing state.

Convention and schema: [`serving-snapshot-schema.md`](../../sk-doc/sk-create-benchmark/references/skill-benchmark/serving-snapshot-schema.md) · storage standard: [`skill-benchmark-storage-guide.md`](../../sk-doc/sk-create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md).
