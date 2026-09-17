---
title: "system-deep-loop Benchmark Reports"
description: "Index of curated benchmark run reports for system-deep-loop, one row per run folder."
trigger_phrases:
  - "system-deep-loop benchmark reports"
  - "system-deep-loop benchmark index"
importance_tier: "important"
contextType: "general"
---

# system-deep-loop Benchmark Reports

> Curated reports derived from completed benchmark runs, newest first. Raw execution evidence stays in the packet that produced it, named in each run's `source.md`.

---

## 1. OVERVIEW

Each row below is one run folder. Rows are written by the benchmark harness at the moment it writes the report, so this table cannot fall behind the folders beside it.

---

## 2. RUN INDEX

| Executed | Folder | Runtime | Result | Verdict | Source |
|---|---|---|---|---|---|
| 2026-07-21 | [`compiled-routing/2026-07-21--real--luna-high`](./compiled-routing/2026-07-21--real--luna-high/) | skill-benchmark | complete | PASS | [`source.md`](./compiled-routing/2026-07-21--real--luna-high/source.md) |
| 2026-07-21 | [`compiled-routing/2026-07-21--verify--luna-high`](./compiled-routing/2026-07-21--verify--luna-high/) | skill-benchmark | complete | PASS | [`source.md`](./compiled-routing/2026-07-21--verify--luna-high/source.md) |
| 2026-07-21 | [`compiled-routing/2026-07-21--playbook-verify--sonnet`](./compiled-routing/2026-07-21--playbook-verify--sonnet/) | skill-benchmark | complete | UNKNOWN | [`source.md`](./compiled-routing/2026-07-21--playbook-verify--sonnet/source.md) |
| baseline | [`baseline`](./baseline/) | skill-benchmark | complete | CONDITIONAL | [`source.md`](./baseline/source.md) |

---

## 3. STORAGE RULE

Run folders are named `<YYYY-MM-DD>--<subject>--<variant>`, dated by execution. Keep curated summaries and machine-readable result tables here, and raw transcripts and copied artifacts in the source packet. A run whose result changes gets a new folder rather than overwriting a prior one.

The grammar and the report file set are owned by `create-benchmark`; this index states them only so the folder reads on its own. Where the two differ, that skill is correct.
