---
title: "cli-devin Benchmark Reports"
description: "Index of curated goal-hook validation run reports for cli-devin, one row per run folder."
trigger_phrases:
  - "cli-devin benchmark reports"
  - "cli-devin benchmark index"
importance_tier: "important"
contextType: "general"
---

# cli-devin Benchmark Reports

_Derived after the fact from this run's stored record, not written at run time._

> Curated reports derived from completed goal-hook validation runs, newest first. Raw execution evidence stays in the packet that produced it, named in each run's `source.md`.

---

## 1. OVERVIEW

Each row below is one run folder. Unlike a Lane C skill-benchmark tree, no automated harness writes these rows at run time — they were hand-derived after the fact from the run's stored record (canary-token + transcript-grep evidence captured in packet `034-goal-hook-playbooks-and-validation`).

## 2. RUN INDEX

| Executed | Folder | Runtime | Result | Verdict | Source |
|---|---|---|---|---|---|
| 2026-07-29 | [`2026-07-29--manual-testing-playbook--glm-5-2/`](./2026-07-29--manual-testing-playbook--glm-5-2/) | live (devin, glm-5-2) | 1 PASS | **PASS** | `034-goal-hook-playbooks-and-validation` |

## 3. STORAGE RULE

Run folders are named `<YYYY-MM-DD>--<subject>--<variant>`, dated by execution. Keep curated summaries and machine-readable result tables here, and raw transcripts and copied artifacts in the source packet. A run whose result changes gets a new folder rather than overwriting a prior one.

The grammar and the report file set are owned by `create-benchmark`; this index states them only so the folder reads on its own. Where the two differ, that skill is correct.
