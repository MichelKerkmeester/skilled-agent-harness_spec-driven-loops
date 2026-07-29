---
title: "cli-opencode Benchmark Reports"
description: "Index of curated benchmark run reports for cli-opencode, one row per run folder."
trigger_phrases:
  - "cli-opencode benchmark reports"
  - "cli-opencode benchmark index"
importance_tier: "normal"
contextType: "general"
---

# cli-opencode Benchmark Reports

> Curated reports derived from a completed manual-testing-playbook validation run, newest first. Raw execution evidence stays in the packet that produced it, named in each run's `source.md`.

---

## 1. OVERVIEW

Each row below is one run folder. This run captures the live-headless-dispatch slice of the `CO-039` scenario (mk-goal's `experimental.chat.system.transform` injection and `mk_goal` tool exposure under `opencode run`), not a Lane C skill-benchmark corpus, so there is no D1-D5 dimension score to report. CO-039's own direct-in-process PASS verdict lives in the playbook file, not in this tree.

## 2. RUN INDEX

| Executed | Folder | Trace mode | Result | Verdict | Source |
|---|---|---|---|---|---|
| 2026-07-29 | [`2026-07-29--manual-testing-playbook--goal-hook/`](./2026-07-29--manual-testing-playbook--goal-hook/) | live | 0 PASS, 3 SKIP | **SKIP** | `034-goal-hook-playbooks-and-validation` |

## 3. STORAGE RULE

Run folders are named `<YYYY-MM-DD>--<subject>--<variant>`, dated by execution. Keep curated summaries and machine-readable result tables here, and raw transcripts and copied artifacts in the source packet. A run whose result changes gets a new folder rather than overwriting a prior one.

The grammar and the report file set are owned by `create-benchmark`; this index states them only so the folder reads on its own. Where the two differ, that skill is correct.
