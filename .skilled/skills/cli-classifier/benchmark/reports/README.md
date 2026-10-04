---
title: "cli-classifier Benchmark Reports"
description: "Index of curated benchmark run reports for cli-classifier, one row per run folder."
trigger_phrases:
  - "cli-classifier benchmark reports"
  - "cli-classifier benchmark index"
importance_tier: "important"
contextType: "general"
---

# cli-classifier Benchmark Reports

> Curated reports derived from completed benchmark runs, newest first. Raw execution evidence stays in the packet that produced it, named in each run's `source.md`.

---

## 1. OVERVIEW

Each row below is one run folder. Add a row by hand when a run folder lands, newest first.

---

## 2. RUN INDEX

| Executed | Folder | Runtime | Result | Verdict | Source |
|---|---|---|---|---|---|
| 2026-10-03 | [`2026-10-03--injection-screen--jev-pi-default/`](./2026-10-03--injection-screen--jev-pi-default/) | `score-injection-screen.mjs --jev`, default transport (Pi answered 189 of 189 classifier calls), `jev-1.13.0` | Jev right on 84 of 90 against 68 for the lexical screen, 2 false positives, p=0.0008 | **keep** | `specs/cli-jev/003-cli-jev-workflow-integration/051-followups` |
| 2026-09-26 | [`2026-09-26--manual-testing-playbook--hub-routing-phrasings/`](./2026-09-26--manual-testing-playbook--hub-routing-phrasings/) | compiled front door, `--hub cli-jev`, policy `033a20d9…` | 3 PASS, 0 FAIL, 0 SKIP. The six advertised Jev phrasings route | **PASS** | `manual-testing-playbook` |
| 2026-09-20 | [`2026-09-20-hub-routing-baseline/`](./2026-09-20-hub-routing-baseline/) | compiled front door, `--hub cli-jev`, policy `3240ebf5…` | 3 PASS, 0 FAIL, 0 SKIP | **PASS** | `manual-testing-playbook` |

The two 2026-09 runs measured the Jev routing surface before it became mode `cli-jev` of this hub, so they name the retired `cli-jev` hub and its `cli-usage` mode. They stay as recorded.

---

## 3. STORAGE RULE

Run folders are named `<YYYY-MM-DD>--<subject>--<variant>`, dated by execution. Keep curated summaries and machine-readable result tables here. Raw transcripts and copied artifacts stay in the source packet. A run whose result changes gets a new folder rather than overwriting a prior one.

The grammar and the report file set are owned by `create-benchmark`. This index states them only so the folder reads on its own. Where the two differ, that skill is correct.
