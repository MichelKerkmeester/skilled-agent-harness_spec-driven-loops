---
Every file in a run folder that is not the machine record or its render is explicitly marked `Derived after the fact from this run's stored record, not written at run time.`: the `README.md`, `failed-runs.md`, `findings-and-recommendations.md`, and `source.md`. `skill-benchmark-report.md` carries its own disclaimer instead: it is a hand-authored render styled after the Lane C shape, not produced by `build-report.cjs`, since this tree has no Lane C scoring pass to render from.
title: "cli-cursor Goal-Hook Benchmark Artifacts"
description: "Curated, hand-derived validation reports for cli-cursor's goal-hook manual-testing-playbook scenario (CU-027), captured live against the real cursor-agent CLI. Not a deep-improvement Lane C skill-benchmark tree."
trigger_phrases:
  - "cli-cursor benchmark"
  - "cli-cursor goal hook benchmark"
  - "cli-cursor manual testing playbook validation"
importance_tier: "important"
contextType: "general"
---

# cli-cursor Goal-Hook Benchmark Artifacts

> Curated, hand-derived reports for goal-hook manual-testing-playbook validation runs against the real `cursor-agent` CLI, kept beside the skill they measure. Each run-label folder holds one captured run's report pair; this file indexes them.

> Archive status: the Lane C harness that produced these reports was retired with the skill-benchmark lane, so none of them can be re-run from the current tree. They stay as frozen historical evidence.

---

## 1. OVERVIEW

This `benchmark/` tree holds **derived-after-the-fact** validation reports, not deep-improvement Lane C skill-benchmark runs. Each run folder captures a `manual-testing-playbook` scenario dispatched live against the real `cursor-agent` CLI and a real model, proven with a canary token plus a raw-transcript grep rather than the Lane C D1-D5 rubric.


---

## 2. RUN INDEX

| Run label | Date | Trace mode | Verdict | Status | Notes |
|---|---|---|---|---|---|
| [`2026-07-29--manual-testing-playbook--goal-hook/`](./reports/2026-07-29--manual-testing-playbook--goal-hook/) | 2026-07-29 | live | PASS (recorded-evidence tier) | current | `CU-027` sessionStart-fires + model-invisible-injection proof, `composer-2.5` (paid tier) |

---

## 3. STRUCTURE

```text
benchmark/
+-- README.md                                                  # this file
`-- reports/
    +-- README.md                                              # machine-style run index
    `-- 2026-07-29--manual-testing-playbook--goal-hook/     # CU-027 recorded-evidence-tier capture
```

---

## 4. READING THE REPORTS

Each run-label folder holds a curated 7-file set: `README.md`, `skill-benchmark-report.json`, `skill-benchmark-report.md`, `results.csv`, `failed-runs.md`, `findings-and-recommendations.md`, `source.md`. Start with the folder's own `README.md` for the verdict, `source.md` for where the raw evidence lives, and `skill-benchmark-report.md` for the narrative render. `results.csv`'s `score` column always reads `not-recorded`: this tree validates live hook-fire and model-visibility reachability, not a D1-D5 usefulness score.

---

## 5. RELATED RESOURCES

| Document | Purpose |
|---|---|
| [`cli-cursor`](../SKILL.md) | The CLI skill under measurement |
| [`goal-hook.md`](../manual-testing-playbook/goal-hook/goal-hook.md) | The `CU-027` scenario this tree validates |
| [`004-goal-hook-playbooks-and-validation`](../../../../specs/hooks/004-goal-hook-playbooks-and-validation) | The spec packet that captured this evidence |
