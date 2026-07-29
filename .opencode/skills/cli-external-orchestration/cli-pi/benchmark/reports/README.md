---
title: "cli-pi Benchmark Reports"
description: "Index of curated benchmark run reports for cli-pi, one row per run folder."
trigger_phrases:
  - "cli-pi benchmark reports"
  - "cli-pi benchmark index"
importance_tier: "normal"
contextType: "general"
---

# cli-pi Benchmark Reports

> Curated reports derived from a completed manual-testing-playbook validation run, newest first. Raw execution evidence stays in the packet that produced it, named in each run's `source.md`.

---

## 1. OVERVIEW

Each row below is one run folder. This run family validates the cross-runtime goal-hook scenario `PI-021`, not a Lane C skill-benchmark corpus, so there is no D1-D5 dimension score to report -- see each folder's `skill-benchmark-report.md` for the captured verdict and per-behavior detail.

## 2. RUN INDEX

| Executed | Folder | Trace mode | Result | Verdict | Source |
|---|---|---|---|---|---|
| 2026-07-29 | [`2026-07-29--manual-testing-playbook--goal-hook/`](./2026-07-29--manual-testing-playbook--goal-hook/) | live | 3 PASS, 1 SKIP | **PASS** | `034-goal-hook-playbooks-and-validation` |

## 3. STORAGE RULE

Run folders are named `<YYYY-MM-DD>--<subject>--<variant>`, dated by execution. Keep curated summaries and machine-readable result tables here, and raw transcripts and copied artifacts in the source packet. A run whose result changes gets a new folder rather than overwriting a prior one.

The grammar and the report file set are owned by `create-benchmark`; this index states them only so the folder reads on its own. Where the two differ, that skill is correct.
