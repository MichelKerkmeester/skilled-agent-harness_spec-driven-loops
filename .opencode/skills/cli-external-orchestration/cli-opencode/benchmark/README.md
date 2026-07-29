---
title: "cli-opencode Benchmark Artifacts"
description: "Benchmark tree for cli-opencode holding curated goal-hook validation reports derived from packet 034's captured evidence -- a manual-testing-playbook record, not a Lane C skill-benchmark D1-D5 run."
trigger_phrases:
  - "cli-opencode benchmark"
  - "cli-opencode goal hook validation report"
  - "mk-goal headless validation report"
importance_tier: "normal"
contextType: "general"
---

# cli-opencode Benchmark Artifacts

> Curated, derived-after-the-fact reports for cli-opencode's manual-testing-playbook validation runs, kept beside the CLI they measure. Each run-label folder holds one already-captured run's report package; this file indexes the tree and states how to read it.

---

## 1. OVERVIEW

This `benchmark/` tree holds reports **derived after the fact from a manual-testing-playbook validation run**, not the deep-improvement Lane C skill-benchmark harness -- no D1 to D5 dimension scoring applies here, and no field in this tree was written by a harness at run time. The archived run below packages an already-captured attempt to validate the OpenCode-native `mk-goal` plugin's live injection path through headless `opencode run` -- the `CO-039` scenario's Optional Supplemental Check, not its primary direct-in-process contract (which independently returned an overall PASS documented in the same playbook file). This tree tracks only the live-dispatch slice.

Every file inside a run-label folder carries the marker `_Derived after the fact from this run's stored record, not written at run time._` for that reason.

## 2. RUN-LABEL INDEX

| Run label | Trace mode | Verdict | Scenarios | Source |
|---|---|---|---|---|
| [`2026-07-29--manual-testing-playbook--goal-hook/`](./reports/2026-07-29--manual-testing-playbook--goal-hook/) | live | **SKIP** | 3 (0 PASS, 3 SKIP) | `034-goal-hook-playbooks-and-validation` |

## 3. STRUCTURE

```text
benchmark/
`-- reports/
    +-- README.md                                                  # run index
    `-- 2026-07-29--manual-testing-playbook--goal-hook/       # this run's 7-file package
```

## 4. READING THE REPORTS

Each run-label folder holds the seven-file package the storage guide defines:

| File | Content |
|---|---|
| `skill-benchmark-report.json` | The machine record every other file derives from |
| `skill-benchmark-report.md` | The same record rendered for reading |
| `results.csv` | One row per checked behavior, for spreadsheet and diff use |
| `failed-runs.md` | Per-behavior failure detail, or a statement that none was captured |
| `findings-and-recommendations.md` | Boundaries and findings grouped by cause |
| `source.md` | Where the packet, playbook, and raw evidence live |
| `README.md` | Per-run context: verdict, fields, and the file map |

## 5. RELATED RESOURCES

| Document | Purpose |
|---|---|
| [`cli-opencode`](../SKILL.md) | The CLI under measurement |
| [`goal-hook.md`](../manual-testing-playbook/goal-hook/goal-hook.md) | The `CO-039` scenario this run's headless slice is drawn from |
| [`034-goal-hook-playbooks-and-validation`](../../../../specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/spec.md) | The spec packet that captured the underlying evidence |
| [`skill-benchmark-storage-guide.md`](../../../sk-doc/sk-create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md) | The storage standard this tree follows |
