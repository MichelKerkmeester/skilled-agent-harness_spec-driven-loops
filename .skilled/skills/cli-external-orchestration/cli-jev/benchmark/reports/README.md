---
title: "cli-jev Benchmark Reports"
description: "Index of curated benchmark run reports for cli-jev, one row per run folder."
trigger_phrases:
  - "cli-jev benchmark reports"
  - "cli-jev benchmark index"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.0
---

# cli-jev Benchmark Reports

> Curated reports derived from a completed manual-testing-playbook validation run, newest first. Raw
> execution evidence stays in the session that produced it, named in each run's report.

---

## 1. OVERVIEW

Each row below is one run folder. This run family validates the `cli-jev` manual-testing playbook,
not a Lane C skill-benchmark corpus, so there is no dimension score to report. See each folder's
report for the captured verdict and per-scenario detail.

---

## 2. RUN INDEX

| Executed | Folder | Trace mode | Result | Verdict | Source |
|---|---|---|---|---|---|
| 2026-09-20 | [`2026-09-20-authenticated-verification/`](./2026-09-20-authenticated-verification/) | live, authenticated (operator `official` key in the credential store) | JEV-021 PASS in full, JEV-022 PASS; the other twenty rows unchanged | **PASS** | `manual-testing-playbook` |
| 2026-09-20 | [`2026-09-20-phase-004-unauthenticated-pass/`](./2026-09-20-phase-004-unauthenticated-pass/) | live, unauthenticated (no provider key in the environment at run time) | 20 PASS, 0 FAIL, 2 SKIP (authenticated) | **PASS** | `manual-testing-playbook` |

The unauthenticated run records the two credential-gated scenarios as SKIP with the blocker named,
never as passes. The authenticated verification then closes both rows with observed output after the
operator stored an `official` key, and it leaves the other twenty rows as recorded — so the two
reports together cover the whole playbook. A machine with no stored key reproduces every no-key row
by pointing `XDG_CONFIG_HOME` at an empty directory.
