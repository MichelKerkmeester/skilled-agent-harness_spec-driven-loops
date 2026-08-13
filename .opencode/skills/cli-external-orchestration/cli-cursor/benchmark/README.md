---
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

---

## 1. OVERVIEW

This `benchmark/` tree holds **derived-after-the-fact** validation reports, not deep-improvement Lane C skill-benchmark runs. Each run folder captures a `manual-testing-playbook` scenario dispatched live against the real `cursor-agent` CLI and a real model, proven with a canary token plus a raw-transcript grep rather than the Lane C D1-D5 rubric.

Every file in a run folder that is not the machine record or its render is explicitly marked `Derived after the fact from this run's stored record, not written at run time.` — the `README.md`, `failed-runs.md`, `findings-and-recommendations.md`, and `source.md`. `skill-benchmark-report.md` carries its own disclaimer instead: it is a hand-authored render styled after the Lane C shape, not produced by `build-report.cjs`, since this tree has no Lane C scoring pass to render from. See [`skill-benchmark-storage-guide.md`](../../../sk-doc/sk-create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md) section 5 for why `skill-benchmark-report.md` is normally renderer-owned.

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

## 4. HOW TO RE-RUN

There is no automated re-run harness for this tree — it is a hand-derived capture, not a Lane C `loop-host.cjs` invocation. To reproduce the underlying evidence, follow `CU-027` Supplemental Check 4 in [`goal-hook.md`](../manual-testing-playbook/goal-hook/goal-hook.md): isolate `MK_GOAL_STATE_DIR`, seed a fresh canary objective via `bin/goal.cjs set`, then dispatch:

```bash
MK_GOAL_STATE_DIR=<iso> MK_GOAL_RUNTIME_LABEL=Cursor \
  cursor-agent -p "<prompt>" --output-format text --model composer-2.5 --auto-review --sandbox enabled </dev/null
```

Confirm `turns_used` moved `0` -> `1` via `bin/goal.cjs show`, then grep the real transcript at `~/.cursor/projects/*/agent-transcripts/*/*.jsonl` for the canary string and `[active_goal` — both must return `0` for a recorded-evidence-tier PASS, since Cursor's `sessionStart` `agent_message` channel is confirmed non-delivering to the model. Author a new sibling run-label folder — never overwrite an existing one.

---

## 5. READING THE REPORTS

Each run-label folder holds a curated 7-file set: `README.md`, `skill-benchmark-report.json`, `skill-benchmark-report.md`, `results.csv`, `failed-runs.md`, `findings-and-recommendations.md`, `source.md`. Start with the folder's own `README.md` for the verdict, `source.md` for where the raw evidence lives, and `skill-benchmark-report.md` for the narrative render. `results.csv`'s `score` column always reads `not-recorded` — this tree validates live hook-fire and model-visibility reachability, not a D1-D5 usefulness score.

---

## 6. RELATED RESOURCES

| Document | Purpose |
|---|---|
| [`cli-cursor`](../SKILL.md) | The CLI skill under measurement |
| [`goal-hook.md`](../manual-testing-playbook/goal-hook/goal-hook.md) | The `CU-027` scenario this tree validates |
| [`004-goal-hook-playbooks-and-validation`](../../../../specs/hooks/004-goal-hook-playbooks-and-validation) | The spec packet that captured this evidence |
| [`skill-benchmark-storage-guide.md`](../../../sk-doc/sk-create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md) | The storage-shape contract this tree's file naming and 7-file set follow |
