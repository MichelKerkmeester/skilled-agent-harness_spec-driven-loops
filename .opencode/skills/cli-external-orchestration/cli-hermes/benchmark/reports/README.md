---
title: "cli-hermes Benchmark Reports"
description: "Index of curated benchmark run reports for cli-hermes, one row per run folder."
trigger_phrases:
  - "cli-hermes benchmark reports"
  - "cli-hermes benchmark index"
importance_tier: "normal"
contextType: "general"
---

# cli-hermes Benchmark Reports

> Curated reports derived from a completed manual-testing-playbook validation run, newest first. Raw execution evidence stays in the session that produced it, named in each run's `source.md`.

---

## 1. OVERVIEW

Each row below is one run folder. This run family validates the `cli-hermes` manual-testing playbook, not a Lane C skill-benchmark corpus, so there is no D1-D5 dimension score to report. See each folder's `skill-benchmark-report.md` for the captured verdict and per-behavior detail.

---

## 2. RUN INDEX

| Executed | Folder | Trace mode | Result | Verdict | Source |
|---|---|---|---|---|---|
| 2026-09-15 | [`2026-09-15-phase-008-third-pass/`](./2026-09-15-phase-008-third-pass/) | live + hermetic, cli-pi on deepseek-v4.1-flash (high) | 43 PASS, 1 FAIL | **PASS** |
| 2026-09-14 | [`2026-09-14-phase-008-second-pass/`](./2026-09-14-phase-008-second-pass/) | live, glm-5.3-flash via llmgateway | 22 PASS, 14 SKIP (hermetic) | **PASS** | `manual-testing-playbook` |
| 2026-09-14 | [`2026-09-14-phase-008-first-pass/`](./2026-09-14-phase-008-first-pass/) | live, glm-5.3-flash via llmgateway | 17 PASS, 2 FAIL, 14 SKIP (hermetic) | **FAIL** | `manual-testing-playbook` | (superseded)

---

## 3. HOW TO ADD A RUN

1. Execute the scenarios in `../../manual-testing-playbook/` for real and keep the raw captures with the executing session.
2. Package the run in the seven-file report shape under `<YYYY-MM-DD>--manual-testing-playbook--<variant>/`, or the run label the packet phase assigns.
3. Add the row above, newest first, and cite the packet phase that produced it.
4. Never overwrite a prior run. A result that changes gets a new folder.
