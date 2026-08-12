---
title: "sk-create-diagram Benchmark Reports"
description: "Index of curated benchmark run reports for sk-create-diagram, one row per run folder."
trigger_phrases:
  - "sk-create-diagram benchmark reports"
  - "sk-create-diagram benchmark index"
importance_tier: "important"
contextType: "general"
---

# sk-create-diagram Benchmark Reports

> Curated reports derived from completed benchmark runs, newest first. Raw execution evidence stays in the packet that produced it, named in each run's `source.md`.

---

## 1. OVERVIEW

Each row below is one run folder. Rows are written by the benchmark harness at the moment it writes the report, so this table cannot fall behind the folders beside it.

## 2. RUN INDEX

| Executed | Folder | Runtime | Result | Verdict | Source |
|---|---|---|---|---|---|
| 2026-08-12 | [`2026-08-12--manual-testing-playbook--hub-registration/`](./2026-08-12--manual-testing-playbook--hub-registration/) | deepseek-v4-flash deepseek/deepseek-v4-flash hub-registration | 1 PASS | **PASS** | `manual-testing-playbook` |
| 2026-08-12 | [`2026-08-12--manual-testing-playbook--create-diagram-command/`](./2026-08-12--manual-testing-playbook--create-diagram-command/) | deepseek-v4-flash deepseek/deepseek-v4-flash create-diagram-command | 1 PASS | **PASS** | `manual-testing-playbook` |
| 2026-08-12 | [`2026-08-12--manual-testing-playbook--export-guidance/`](./2026-08-12--manual-testing-playbook--export-guidance/) | deepseek-v4-flash deepseek/deepseek-v4-flash export-guidance | 1 SKIP | **SKIP** | `manual-testing-playbook` |
| 2026-08-12 | [`2026-08-12--manual-testing-playbook--mermaid-import/`](./2026-08-12--manual-testing-playbook--mermaid-import/) | deepseek-v4-flash deepseek/deepseek-v4-flash mermaid-import | 1 PASS | **PASS** | `manual-testing-playbook` |
| 2026-08-12 | [`2026-08-12--manual-testing-playbook--drawio-import/`](./2026-08-12--manual-testing-playbook--drawio-import/) | deepseek-v4-flash deepseek/deepseek-v4-flash drawio-import | 1 PASS | **PASS** | `manual-testing-playbook` |
| 2026-08-12 | [`2026-08-12--manual-testing-playbook--primitive-variants/`](./2026-08-12--manual-testing-playbook--primitive-variants/) | deepseek-v4-flash deepseek/deepseek-v4-flash primitive-variants | 1 PASS | **PASS** | `manual-testing-playbook` |
| 2026-08-12 | [`2026-08-12--manual-testing-playbook--onboarding-flow/`](./2026-08-12--manual-testing-playbook--onboarding-flow/) | deepseek-v4-flash deepseek/deepseek-v4-flash onboarding-flow | 1 PASS | **PASS** | `manual-testing-playbook` |
| 2026-08-12 | [`2026-08-12--manual-testing-playbook--editorial-style-and-connectors/`](./2026-08-12--manual-testing-playbook--editorial-style-and-connectors/) | deepseek-v4-flash deepseek/deepseek-v4-flash editorial-style-and-connectors | 1 PASS | **PASS** | `manual-testing-playbook` |
| 2026-08-12 | [`2026-08-12--manual-testing-playbook--type-selection-and-routing/`](./2026-08-12--manual-testing-playbook--type-selection-and-routing/) | deepseek-v4-flash deepseek/deepseek-v4-flash type-selection-and-routing | 1 PASS | **PASS** | `manual-testing-playbook` |

## 3. STORAGE RULE

Run folders are named `<YYYY-MM-DD>--<subject>--<variant>`, dated by execution. Keep curated summaries and machine-readable result tables here, and raw transcripts and copied artifacts in the source packet. A run whose result changes gets a new folder rather than overwriting a prior one.

The grammar and the report file set are owned by `create-benchmark`; this index states them only so the folder reads on its own. Where the two differ, that skill is correct.
